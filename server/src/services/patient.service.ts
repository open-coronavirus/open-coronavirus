import {repository} from "@loopback/repository";
import {PatientRepository} from "../repositories";
import {Contact, InfectionExposure, Patient} from "../models";
import {PatientStatus} from "../common/utils/enums";
import {HttpErrors} from "@loopback/rest";
import {PushNotificationService} from "./pushnotification.service";
import {service} from "@loopback/core";
import {ExposureRisk, ExposureRiskDecisor} from "./exposure-risk-decisor";
import {BluetoothUuidGenerator} from "../common/utils/bluetooth-uuid-generator";
import {UserValidatorService} from "./user-validator.service";


export class PatientService {

    constructor(
        @repository(PatientRepository) public patientRepository : PatientRepository,
        @service('UserValidatorService') public userValidatorService: UserValidatorService,
        @service(PushNotificationService) public pushNotificationService: PushNotificationService,
        @service('ExposureRiskDecisor') public exposureRiskDecisor: ExposureRiskDecisor,
    ) {}


    async signUpPatient(patient: Patient): Promise<Patient | null> {

        if(patient != null) {
            //generate an unique uuid for each patient (it will be used on centralized model only)
            patient.serviceAdvertisementUUID = BluetoothUuidGenerator.generateUUID();
            patient.status = PatientStatus.UNKNOWN; //initial status
            patient.created = new Date();

            let existingPatinet = null;
            //try to find the patient by the health insurance card number
            if (patient.healthInsuranceCardNumber != null && patient.healthInsuranceCardNumber.length > 0) {
                patient.healthInsuranceCardNumber = this.normalizeDocumentId(patient.healthInsuranceCardNumber);
                existingPatinet = await this.patientRepository.findOne({where: {healthInsuranceCardNumber: patient.healthInsuranceCardNumber}});
            }
            //if no existing patient, try with the document number (need to refactor this piece to be configurable)
            if (existingPatinet == null && patient.documentNumber != null && patient.documentNumber.length > 0) {
                patient.documentNumber = this.normalizeDocumentId(patient.documentNumber);
                existingPatinet = await this.patientRepository.findOne({where: {documentNumber: patient.documentNumber}});
            }
            if (existingPatinet != null) {
                //ovewrite everything with the given patient data (to avoid issues with validateUsers because the
                //user has been loaded from database, so it was previously validated
                existingPatinet.copy(patient);
                existingPatinet.updated = new Date();
                //and now set the existing patient to the current patient variable
                patient = existingPatinet;
            }

            //very important: validation not just validate the user information against the
            //correspondent health department or authority, but also alter the patient with
            //info from them
            let validationResult = await this.userValidatorService.validateUser(<Patient>patient);

            if (validationResult.isValid) {
                patient = validationResult.patient; //recover the patient from the validation result before creating it:
                if(existingPatinet != null) {
                    await this.patientRepository.update(patient);
                    return new Promise<Patient>(resolve => resolve(patient));
                }
                else {
                    return this.patientRepository.create(patient);
                }
            } else {
                throw new HttpErrors.UnprocessableEntity(validationResult.message);
            }
        }
        else {
            throw new HttpErrors.BadRequest("Internal Server Error");
        }

    }

    public normalizeDocumentId(documentId: string) {

        let returnValue = documentId;
        if(documentId != null && documentId.length > 0) {
            returnValue = documentId.replace(/\s+/gi, "").toUpperCase();
        }
        return returnValue;

    }

    /**
     * Centralized model to decide to put in quarantine
     *
     * @param contacts
     */
    async putInQuarantine(contacts: Contact[]) {

        //resolve:
        let uniqueContactUUIDs = new Map<string, boolean>();
        contacts.forEach(contact => {
            uniqueContactUUIDs.set(contact.targetUuid, true);
        });

        for (let key of uniqueContactUUIDs.keys()) {
            let patient = await this.patientRepository.findOne({"where": { "serviceAdvertisementUUID": key.toLowerCase() }});
            if(patient != null) {
                //update status of unknown users or uninfected users (that may be now infected). Also do not change the status if it's already infection suspected!
                if(patient.status != PatientStatus.IMMUNE && patient.status != PatientStatus.INFECTED && patient.status != PatientStatus.INFECTION_SUSPECTED) {
                    this.doChangeStatus(patient, PatientStatus.INFECTION_SUSPECTED);
                }
            }
            else {
                console.error("No patient found for advertisement uuid: " + key.toLowerCase());
            }
        }

    }

    /**
     * Decentralized model to decide to put in quarantine
     *
     * @param contacts
     */
    async decideToPutInQuarantine(infectionExposures: InfectionExposure[]) {
        let patientsToPutInQuarantine = new Map<string, InfectionExposure[]>()
        infectionExposures.forEach(infectionExposure => {
            if(!patientsToPutInQuarantine.has(infectionExposure.patientId)) {
                patientsToPutInQuarantine.set(infectionExposure.patientId, []);
            }
            patientsToPutInQuarantine.get(infectionExposure.patientId)?.push(infectionExposure);
        });

        for (let patientId of patientsToPutInQuarantine.keys()) {

            let patientInfectionExposures = patientsToPutInQuarantine.get(patientId);
            if(patientInfectionExposures != undefined) {

                let patient = await this.patientRepository.findById(patientId);
                if (patient != null) {
                    let risk = this.exposureRiskDecisor.decideRisk(patientInfectionExposures);

                    switch(risk) {
                        case ExposureRisk.HIGH:
                            console.log('HIGH RISK DETECTED on patient: ' + patientId);
                            break;
                        case ExposureRisk.LOW:
                            console.log('LOW RISK DETECTED on patient: ' + patientId);
                            break;
                        case ExposureRisk.NONE:
                            console.log('NO RISK DETECTED on patient: ' + patientId);
                            break;
                    }

                    if ((risk == ExposureRisk.HIGH && process.env.EXPOSURE_RISK_LEVEL_TO_QUARANTINE == 'HIGH') ||
                        (risk == ExposureRisk.LOW && process.env.EXPOSURE_RISK_LEVEL_TO_QUARANTINE == 'LOW')) {
                        //update status of unknown users or uninfected users (that may be now infected). Also do not change the status if it's already infection suspected!
                        if (patient.status != PatientStatus.IMMUNE && patient.status != PatientStatus.INFECTED && patient.status != PatientStatus.INFECTION_SUSPECTED) {
                            await this.doChangeStatus(patient, PatientStatus.INFECTION_SUSPECTED);
                        }
                    } else if(risk == ExposureRisk.LOW) {
                        //back to need to make a test (but not quarantine) since the exposure exists but with no risk
                        if (patient.status != PatientStatus.IMMUNE && patient.status != PatientStatus.INFECTED && patient.status != PatientStatus.INFECTION_SUSPECTED && patient.status != PatientStatus.UNKNOWN) {
                            await this.doChangeStatus(patient, PatientStatus.UNKNOWN);
                        }
                    }
                }
                else {
                    console.error("No patient found for id: " + patientId);
                }
            }
        }
    }

    public changeStatus(documentNumber: string, healthInsuranceCardNumber: string, status: number, date: string) {

        let where: any = {};
        if(documentNumber != null && documentNumber.length > 0) {
            where['documentNumber'] = this.normalizeDocumentId(documentNumber);
        }
        if(healthInsuranceCardNumber != null && healthInsuranceCardNumber.length > 0) {
            where['healthInsuranceCardNumber'] = this.normalizeDocumentId(healthInsuranceCardNumber);
        }

        let filter = {'where': where};

        let returnValue: Promise<Patient | null> = new Promise((resolve, reject) => {

            this.patientRepository.find(filter).then(patients => {
                if (patients != null && patients.length > 0) {
                    patients.forEach(async patient => {
                        await this.doChangeStatus(patient, status, date);
                    });
                    resolve(patients[0]); //for legacy compatibility
                }
                else {
                    reject(new HttpErrors[404]);
                }
            })
                .catch(error => {
                    console.error("Error trying to locate patient with document number " + documentNumber + ", healthInsuranceCardNumber " + healthInsuranceCardNumber + ": " + JSON.stringify(error));
                    reject(new HttpErrors[404]);
                });

        });

        return returnValue;
    }

    protected async doChangeStatus(patient: any, status: number, date: string | null = null) {

        patient.status = status;
        patient.statusDate = date;
        patient.updated = new Date();
        await this.patientRepository.update(patient);
        let title = "Atención";
        let text = null;
        switch (status) {
            case PatientStatus.INFECTED:
                text = "Ya tienes los resultados de tu test: POSITIVO. Ponte en cuarentena y contacta con tu centro de salud.";
                break;
            case PatientStatus.UNINFECTED:
                text = "Ya tienes los resultados de tu test: NEGATIVO. Enhorabuena!";
                break;
            case PatientStatus.INFECTION_SUSPECTED:
                text = "Has estado en contacto activamente con pacientes con riesgo de coronavirus en los últimos días. Por favor, ponte en cuarentena y contacta con tu centro de salud.";
                break;
            case PatientStatus.IMMUNE:
                text = "Ya tienes los resultados de tu test: NEGATIVO. Enhorabuena!";
                break;
        }
        if (text != null) {
            this.pushNotificationService.sendNotificationToPatient(patient.id, title, text);
        }
    }

}

import {repository} from "@loopback/repository";
import {PatientRepository} from "../repositories";
import {Contact, InfectionExposure, Patient} from "../models";
import {PatientStatus} from "../common/utils/enums";
import {HttpErrors} from "@loopback/rest";
import {PushNotificationService} from "./pushnotification.service";
import {service} from "@loopback/core";
import {ExposureRisk, ExposureRiskDecisor} from "./exposure-risk-decisor";


export class PatientService {

    constructor(
        @repository(PatientRepository) public patientRepository : PatientRepository,
        @service(PushNotificationService) public pushNotificationService: PushNotificationService,
        @service('ExposureRiskDecisor') public exposureRiskDecisor: ExposureRiskDecisor,
    ) {}

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
                    if ((risk == ExposureRisk.HIGH && process.env.EXPOSURE_RISK_LEVEL_TO_QUARANTINE == 'HIGH') || risk == ExposureRisk.LOW) {
                        //update status of unknown users or uninfected users (that may be now infected). Also do not change the status if it's already infection suspected!
                        if (patient.status != PatientStatus.IMMUNE && patient.status != PatientStatus.INFECTED && patient.status != PatientStatus.INFECTION_SUSPECTED) {
                            this.doChangeStatus(patient, PatientStatus.INFECTION_SUSPECTED);
                        }
                    } else {
                        //back to need to make a test (but not quarantine) since the exposure exists but with no risk
                        if (patient.status != PatientStatus.IMMUNE && patient.status != PatientStatus.INFECTED && patient.status != PatientStatus.INFECTION_SUSPECTED && patient.status != PatientStatus.UNKNOWN) {
                            this.doChangeStatus(patient, PatientStatus.UNKNOWN);
                        }
                    }
                }
                else {
                    console.error("No patient found for id: " + patientId);
                }
            }
        }
    }

    public changeStatus(documentNumber: string, status: number, date: string) {
        let filter = {
            "where": {
                "documentNumber": documentNumber
            }
        };

        let returnValue: Promise<Patient | null> = new Promise((resolve, reject) => {

            this.patientRepository.findOne(filter).then(patient => {
                if (patient != null) {
                    this.doChangeStatus(patient, status, date);
                    resolve(patient);
                }
                else {
                    reject(new HttpErrors[404]);
                }
            })
            .catch(error => {
                console.error("Error trying to locate patient with document number " + documentNumber + ": " + JSON.stringify(error));
                reject(new HttpErrors[404]);
            });

        });

        return returnValue;
    }

    protected doChangeStatus(patient: any, status: number, date: string | null = null) {

        patient.status = status;
        patient.statusDate = date;
        patient.updated = new Date();
        this.patientRepository.update(patient);
        let title = "Atención";
        let text = null;
        switch (status) {
            case PatientStatus.INFECTED:
                text = "Ya tienes los resultados de tu test: POSITIVO. Revísalo aquí";
                break;
            case PatientStatus.UNINFECTED:
                text = "Ya tienes los resultados de tu test: NEGATIVO. Revísalo aquí.";
                break;
            case PatientStatus.INFECTION_SUSPECTED:
                text = "Has estado en contacto activamente con pacientes con riesgo de coronavirus. Ponte en cuarentena!";
                break;
            case PatientStatus.IMMUNE:
                text = "Ya tienes los resultados de tu test: NEGATIVO. Revísalo aquí.";
                break;
        }
        if (text != null) {
            this.pushNotificationService.sendNotificationToPatient(patient.id, title, text);
        }
    }

}

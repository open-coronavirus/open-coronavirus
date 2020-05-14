import {InfectionExposureRepository, InstallationRepository, PatientRepository} from '../../../repositories';
import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {InfectionExposure, Patient} from "../../../models";
import {PushNotificationService} from "../../../services/pushnotification.service";
import {PatientService} from "../../../services/patient.service";
import {UserValidatorMockService} from "../../../services/impl/user-validator-mock.service";
import {EcdcExposureRiskDecisor} from "../../../services/impl/ecdc-exposure-risk-decisor";
import {expect} from "@loopback/testlab";
import {PatientStatus} from "../../../common/utils/enums";
import {InfectionExposureController} from "../../../controllers";

describe('ExposureRiskDecisor (integration)', () => {

    let patientRepository: PatientRepository;
    let infectionExposureRepository: InfectionExposureRepository;
    let patientService: PatientService;
    let infectionExposureController: InfectionExposureController;

    beforeEach(prepareRepositoriesAndServices);

    function prepareRepositoriesAndServices() {

        //set the exposure risk level to HIGHT
        process.env.EXPOSURE_RISK_LEVEL_TO_QUARANTINE = 'HIGH';

        patientRepository = new PatientRepository(testdb);
        infectionExposureRepository = new InfectionExposureRepository(testdb);

        patientService = new PatientService(patientRepository,
            new UserValidatorMockService(),
            new PushNotificationService(new InstallationRepository(testdb)),
            new EcdcExposureRiskDecisor(patientRepository)
        );

        infectionExposureController = new InfectionExposureController(
            patientService,
            infectionExposureRepository
        );

    }

    describe('decideRisk(infectionExposures)', () => {
        it('decide risk based on ONE single infection exposure entries', async () => {

            let patient: Patient = new Patient();
            patient.firstName = 'Antuan';
            patient.lastName = 'Parrax';
            patient.documentNumber = '443512342N';
            patient.birthday = new Date();

            let result: Patient| null= await patientService.signUpPatient(patient);

            expect(result).to.not.null();
            expect(result).to.containEql({status: PatientStatus.UNKNOWN});

            if(result != null) {

                let infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 3600000;
                infectionExposure.timestampTo = new Date().getTime() - 1400000;
                infectionExposure.rssi = -30;
                infectionExposure.anonymizedInfectedUuid = '55555';

                let infectionExposures = new Array();
                infectionExposures.push(infectionExposure);

                await infectionExposureController.createAll(infectionExposures);

                let patientFromDb = await patientRepository.findById(result.id);

                expect(patientFromDb).to.not.null();
                expect(patientFromDb).to.containEql({status: PatientStatus.INFECTION_SUSPECTED});

            }

        });

        it('HIGH risk based on 2 single infection exposure entries', async () => {

            let patient: Patient = new Patient();
            patient.firstName = 'Antuan';
            patient.lastName = 'Parrax';
            patient.documentNumber = '447546712N';
            patient.birthday = new Date();

            let result: Patient| null= await patientService.signUpPatient(patient);

            expect(result).to.not.null();
            expect(result).to.containEql({status: PatientStatus.UNKNOWN});

            if(result != null) {

                let infectionExposures = new Array();

                let infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 4200000;
                infectionExposure.timestampTo = new Date().getTime() - 4100000;
                infectionExposure.rssi = -60;
                infectionExposure.anonymizedInfectedUuid = '44444';
                infectionExposures.push(infectionExposure);

                infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 2450000;
                infectionExposure.timestampTo = new Date().getTime() - 2430000;
                infectionExposure.rssi = -40;
                infectionExposure.anonymizedInfectedUuid = '44444';
                infectionExposures.push(infectionExposure);

                //the algo is expected to join both exposures so: average rssi: -50, average distance: 0.11220184543019636, total time exposed: 1650000 (4100000 - 2450000)

                await infectionExposureController.createAll(infectionExposures);

                let patientFromDb = await patientRepository.findById(result.id);

                expect(patientFromDb).to.not.null();
                expect(patientFromDb).to.containEql({status: PatientStatus.INFECTION_SUSPECTED});

            }

        });

        it('LOW risk based on 2 single infection exposure entries', async () => {

            let patient: Patient = new Patient();
            patient.firstName = 'Antuan';
            patient.lastName = 'Parrax';
            patient.documentNumber = '423446712R';
            patient.birthday = new Date();

            let result: Patient| null= await patientService.signUpPatient(patient);

            expect(result).to.not.null();
            expect(result).to.containEql({status: PatientStatus.UNKNOWN});

            if(result != null) {

                result.status = PatientStatus.UNINFECTED;
                result.firstName = 'Anthony';
                await patientRepository.save(result);

                let patientFromDb = await patientRepository.findById(result.id);

                expect(patientFromDb).to.not.null();
                expect(patientFromDb).to.containEql({status: PatientStatus.UNINFECTED});

                let infectionExposures = new Array();

                let infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 14200000;
                infectionExposure.timestampTo = new Date().getTime() - 14100000;
                infectionExposure.rssi = -60;
                infectionExposure.anonymizedInfectedUuid = '44444';
                infectionExposures.push(infectionExposure);

                infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 2450000;
                infectionExposure.timestampTo = new Date().getTime() - 2430000;
                infectionExposure.rssi = -40;
                infectionExposure.anonymizedInfectedUuid = '44444';
                infectionExposures.push(infectionExposure);

                //the algo is expected to join both exposures so: average rssi: -50, average distance: 0.11220184543019636, total time exposed: 120000 ((14200000 - 14100000) + (2450000 - 2430000))
                //because the separation of timestamps between both infection exposures is greater than 30 minutes
                //take into account that the algo just unify infection exposures that are so closed in time (at least less than 30 minutes)
                await infectionExposureController.createAll(infectionExposures);

                patientFromDb = await patientRepository.findById(result.id);

                expect(patientFromDb).to.not.null();
                expect(patientFromDb).to.containEql({status: PatientStatus.UNKNOWN});

                // ------------------------------------------------------------------------

                //Now check that LOW priority or even HIGH priority does not change if the patient
                //is already infected
                patientFromDb.status = PatientStatus.INFECTED;
                await patientRepository.save(patientFromDb);

                patientFromDb = await patientRepository.findById(result.id);

                expect(patientFromDb).to.not.null();
                expect(patientFromDb).to.containEql({status: PatientStatus.INFECTED});

                infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 14200000;
                infectionExposure.timestampTo = new Date().getTime() - 14100000;
                infectionExposure.rssi = -60;
                infectionExposure.anonymizedInfectedUuid = '77777';
                infectionExposures.push(infectionExposure);

                infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 2450000;
                infectionExposure.timestampTo = new Date().getTime() - 2430000;
                infectionExposure.rssi = -40;
                infectionExposure.anonymizedInfectedUuid = '77777';
                infectionExposures.push(infectionExposure);

                await infectionExposureController.createAll(infectionExposures);

                patientFromDb = await patientRepository.findById(result.id);

                expect(patientFromDb).to.not.null();
                expect(patientFromDb).to.containEql({status: PatientStatus.INFECTED});

                // ------------------------------------------------------------------------
                //Now check that LOW priority does not change if the patient
                //is already infection suspected


                patientFromDb.status = PatientStatus.INFECTION_SUSPECTED;
                await patientRepository.save(patientFromDb);

                patientFromDb = await patientRepository.findById(result.id);

                expect(patientFromDb).to.not.null();
                expect(patientFromDb).to.containEql({status: PatientStatus.INFECTION_SUSPECTED});

                infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 14200000;
                infectionExposure.timestampTo = new Date().getTime() - 14100000;
                infectionExposure.rssi = -60;
                infectionExposure.anonymizedInfectedUuid = '123098';
                infectionExposures.push(infectionExposure);

                infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 2450000;
                infectionExposure.timestampTo = new Date().getTime() - 2430000;
                infectionExposure.rssi = -40;
                infectionExposure.anonymizedInfectedUuid = '123098';
                infectionExposures.push(infectionExposure);

                await infectionExposureController.createAll(infectionExposures);

                patientFromDb = await patientRepository.findById(result.id);

                expect(patientFromDb).to.not.null();
                expect(patientFromDb).to.containEql({status: PatientStatus.INFECTION_SUSPECTED});

            }

        });

        it('HIGH risk based on 4 single infection exposure entries', async () => {

            let patient: Patient = new Patient();
            patient.firstName = 'Antuan';
            patient.lastName = 'Parrax';
            patient.documentNumber = '447523712H';
            patient.birthday = new Date();

            let result: Patient| null= await patientService.signUpPatient(patient);

            expect(result).to.not.null();
            expect(result).to.containEql({status: PatientStatus.UNKNOWN});

            if(result != null) {

                let infectionExposures = new Array();

                let infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 14200000;
                infectionExposure.timestampTo = new Date().getTime() - 14100000;
                infectionExposure.rssi = -60;
                infectionExposure.anonymizedInfectedUuid = '123456';
                infectionExposures.push(infectionExposure);

                infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 22450000;
                infectionExposure.timestampTo = new Date().getTime() - 21830000;
                infectionExposure.rssi = -40;
                infectionExposure.anonymizedInfectedUuid = '123456';
                infectionExposures.push(infectionExposure);

                infectionExposure = new InfectionExposure();
                infectionExposure.patientId = result.id;
                infectionExposure.timestampFrom = new Date().getTime() - 450000;
                infectionExposure.timestampTo = new Date().getTime() - 130000;
                infectionExposure.rssi = -40;
                infectionExposure.anonymizedInfectedUuid = '123456';
                infectionExposures.push(infectionExposure);

                //the algo is expected to join both exposures so: average rssi: -50, average distance: 0.11220184543019636, total time exposed: 1650000 (4100000 - 2450000)

                await infectionExposureController.createAll(infectionExposures);

                let patientFromDb = await patientRepository.findById(result.id);

                expect(patientFromDb).to.not.null();
                expect(patientFromDb).to.containEql({status: PatientStatus.INFECTION_SUSPECTED});

            }

        });

    });

});

import {InstallationRepository, PatientRepository} from '../../../repositories';
import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {Patient} from "../../../models";
import {PushNotificationService} from "../../../services/pushnotification.service";
import {PatientService} from "../../../services/patient.service";
import {UserValidatorMockService} from "../../../services/impl/user-validator-mock.service";
import {EcdcExposureRiskDecisor} from "../../../services/impl/ecdc-exposure-risk-decisor";
import {expect} from "@loopback/testlab";
import {PatientStatus} from "../../../common/utils/enums";

describe('PatientService (integration)', () => {

    describe('signUpPatient(patient)', () => {
        it('sign up and double sign up works as expected', async () => {

            const patientRepository = new PatientRepository(testdb);

            const patientService = new PatientService(patientRepository,
                new UserValidatorMockService(),
                new PushNotificationService(new InstallationRepository(testdb)),
                new EcdcExposureRiskDecisor(patientRepository)
                );

            let patient: Patient = new Patient();
            patient.firstName = 'Antuan';
            patient.lastName = 'Parrax';
            patient.documentNumber = '45556712Z';
            patient.birthday = new Date();
            patient.status = PatientStatus.IMMUNE; //just to check that signup patient reset the status to UNKNOWN

            let result: Patient| null= await patientService.signUpPatient(patient);

            expect(result).to.not.null();
            expect(result).to.containEql({firstName: 'Antuan', lastName: 'Parrax'});
            expect(result).to.not.containEql({created: undefined});
            expect(result).to.containEql({updated: undefined});
            expect(result).to.not.containEql({serviceAdvertisementUUID: undefined});
            expect(result).to.containEql({status: PatientStatus.UNKNOWN});

            if(result != null) {

                let serviceAdvertisementUUID = result.serviceAdvertisementUUID;

                result.status = PatientStatus.INFECTION_SUSPECTED;
                result.firstName = 'Anthony';
                await patientRepository.save(result);

                let patient2: Patient = new Patient();
                patient2.firstName = 'Antuan';
                patient2.lastName = 'Parraga';
                patient2.documentNumber = '45556712Z';
                patient2.birthday = new Date();
                patient2.status = PatientStatus.IMMUNE; //just to check that signup patient reset the status to UNKNOWN

                let resultAgain: Patient | null = await patientService.signUpPatient(patient2);
                expect(resultAgain).to.containEql({firstName: 'Antuan', lastName: 'Parraga'});
                expect(resultAgain).to.not.containEql({created: undefined});
                expect(resultAgain).to.containEql({serviceAdvertisementUUID: serviceAdvertisementUUID});
                expect(resultAgain).to.not.containEql({updated: undefined});
                expect(resultAgain).to.containEql({status: PatientStatus.INFECTION_SUSPECTED});
            }

        });
    });

});

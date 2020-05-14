import {PatientRepository} from '../../../repositories';
import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {Patient} from "../../../models";
import {expect} from "@loopback/testlab";

describe('PatientRepository (integration)', () => {

    describe('save(patient)', () => {
        it('save the patient', async () => {

            const repository = new PatientRepository(testdb);

            let patient: Patient = new Patient();
            patient.firstName = 'Antuan';
            patient.lastName = 'Parrax';
            patient.documentNumber = '45546712Z';
            patient.birthday = new Date();

            let result = await repository.save(patient);
            expect(result).to.containEql({firstName: 'Antuan', lastName: 'Parrax'});

            result = await repository.save(patient);
            expect(result).to.containEql({firstName: 'Antuan', lastName: 'Parrax'});

        });
    });
});

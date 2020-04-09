import { AuthService } from "../auth.service";
import { PoliceOfficer, Sanitarian, Auth } from "../../models";
import { repository } from "@loopback/repository";
import { PoliceOfficerRepository, SanitarianRepository } from "../../repositories";


export class AuthMockService implements AuthService {

    constructor(
        @repository(PoliceOfficerRepository) public policeOfficerRepository: PoliceOfficerRepository,
        @repository(SanitarianRepository) public sanitarianRepository: SanitarianRepository
    ) { }

    public postPoliceOfficerLogin(auth: Auth): Promise<PoliceOfficer | null> {

        return new Promise(resolve => {

            this.policeOfficerRepository.findById("1").then(existingPoliceOfficer => {
                if (existingPoliceOfficer != null) {
                    resolve(existingPoliceOfficer);
                }
            }).catch(error => {
                if (error.code == 'ENTITY_NOT_FOUND') {
                    let policeOfficer: PoliceOfficer = new PoliceOfficer();

                    policeOfficer.id = '1';
                    policeOfficer.uniqueId = '244124';
                    policeOfficer.firstName = 'Pedro';
                    policeOfficer.lastName = 'Garrido Jiménez';
                    policeOfficer.documentNumber = '123456789B';
                    policeOfficer.hash = 'asdfasdf';
                    policeOfficer.position = 'Policía Nacional';
                    policeOfficer.age = 25;
                    policeOfficer.street = 'San Juan nº 33';
                    policeOfficer.city = 'Alicante';
                    policeOfficer.postalCode = '03640';
                    this.policeOfficerRepository.create(policeOfficer).then(policeOfficerSaved => {
                        resolve(policeOfficerSaved);
                    }).catch(error => {
                        console.log(error);
                    })

                }
            });
        })

    }

    public postSanitarianLogin(auth: Auth): Promise<Sanitarian | null> {

        return new Promise(resolve => {

            this.sanitarianRepository.findById("1").then(existingSanitarian => {
                if (existingSanitarian != null) {
                    resolve(existingSanitarian);
                }
            }).catch(error => {
                if (error.code == 'ENTITY_NOT_FOUND') {
                    let sanitarian: Sanitarian = new Sanitarian();

                    sanitarian.id = '1';
                    sanitarian.uniqueId = '146211';
                    sanitarian.firstName = 'Amparo';
                    sanitarian.lastName = 'Suárez García';
                    sanitarian.documentNumber = '987654321B';
                    sanitarian.hash = 'asdfasdf';
                    sanitarian.position = 'Doctor';
                    sanitarian.age = 42;
                    sanitarian.street = 'San Pablo nº 1';
                    sanitarian.city = 'Alicante';
                    sanitarian.postalCode = '03001';

                    this.sanitarianRepository.create(sanitarian).then(sanitarianSaved => {
                        resolve(sanitarianSaved);
                    }).catch(error => {
                        console.log(error);
                    })

                }
            });
        })

    }

}

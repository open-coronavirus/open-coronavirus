import {HealthCenterService} from "../health-center.service";
import {HealthCenter} from "../../models";
import {repository} from "@loopback/repository";
import {HealthCenterRepository, TestAppointmentRepository} from "../../repositories";


export class HealthCenterMockService implements HealthCenterService {

    constructor(@repository(HealthCenterRepository) public healthCenterRepository : HealthCenterRepository,) {
    }

    public getPatientHealthCenter(patientId: string): Promise<HealthCenter | null> {

        return new Promise(result => {

            this.healthCenterRepository.findById("1").then(existingHealthCenter => {
                if(existingHealthCenter != null) {
                    result(existingHealthCenter);
                }
            })
            .catch(error => {

                if(error.code == 'ENTITY_NOT_FOUND') {

                    let healthCenter: HealthCenter = new HealthCenter();

                    healthCenter.id = "1";
                    healthCenter.name = "Hospital La Fé Valencia"
                    healthCenter.address = "Av. de Fernando Abril Martorell 106";
                    healthCenter.postalCode = "46026";
                    healthCenter.latitude = 39.444043;
                    healthCenter.longitude = -0.375940;

                    this.healthCenterRepository.create(healthCenter).then(healthCenterSaved => {
                        result(healthCenter);
                    })
                    .catch(error => {
                        console.log(error);
                    })

                }
            });

        })

    }

}

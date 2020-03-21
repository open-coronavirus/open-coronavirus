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
                let healthCenter: HealthCenter = new HealthCenter();

                healthCenter.id = "1";
                healthCenter.name = "Hospital La Paz Valencia"
                healthCenter.address = "Av. de Fernando Abril Martorell 106";
                healthCenter.postalCode = "46026";
                healthCenter.latitude = 38.8909943;
                healthCenter.longitude = -0.9913938;

                this.healthCenterRepository.save(healthCenter).then(healthCenterSaved => {
                    result(healthCenter);
                });
            });

        })

    }

}

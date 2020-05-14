import {ExposureRisk, ExposureRiskDecisor} from "../exposure-risk-decisor";
import {InfectionExposure} from "../../models";
import {repository} from "@loopback/repository";
import {PatientRepository} from "../../repositories";


export class EcdcExposureRiskDecisor implements ExposureRiskDecisor {

    constructor(@repository(PatientRepository) public patientRepository : PatientRepository,) {}

    public decideRisk(infectionExposures: InfectionExposure[]): ExposureRisk {

        let risk = ExposureRisk.NONE; //by default

        let infectionExposuresPerContact = new Map<string, InfectionExposure[]>();

        infectionExposures.forEach(infectionExposure => {
            if(!infectionExposuresPerContact.has(infectionExposure.anonymizedInfectedUuid)) {
                infectionExposuresPerContact.set(infectionExposure.anonymizedInfectedUuid, []);
            }
            infectionExposuresPerContact.get(infectionExposure.anonymizedInfectedUuid)?.push(infectionExposure);
        });

        console.log(infectionExposuresPerContact);

        for(let anonymizedInfectedUuuid of infectionExposuresPerContact.keys()) {

            let contactInfectionExposures = infectionExposuresPerContact.get(anonymizedInfectedUuuid);
            if(contactInfectionExposures != undefined) {
                let totalTime = 0;
                let rssiSignalsAddition = 0;
                let totalSignalMeasurements = 0;

                //sort by timestamp
                contactInfectionExposures.sort((n1,n2) => n1.timestampFrom - n2.timestampFrom);

                let previousInfectionExposure: InfectionExposure | null = null;
                contactInfectionExposures.forEach(infectionExposure => {

                    if(previousInfectionExposure != null && infectionExposure.timestampFrom - previousInfectionExposure.timestampFrom < 30 * 60 * 1000) {
                        totalTime -= previousInfectionExposure.timestampTo - previousInfectionExposure.timestampFrom; //remove the local range
                        totalTime += infectionExposure.timestampFrom - previousInfectionExposure.timestampFrom; //add the time past from previous to current infection exposure item
                    }
                    totalTime += infectionExposure.timestampTo - infectionExposure.timestampFrom;

                    if(infectionExposure.rssi != null) {
                        rssiSignalsAddition += infectionExposure.rssi;
                        let distance = this.calculateDistance(infectionExposure.rssi);
                        totalSignalMeasurements++;
                        if(distance <= 2 && infectionExposure.timestampTo - infectionExposure.timestampFrom >= 15 * 60 * 1000) {
                            risk = ExposureRisk.HIGH;
                        }
                        else if((distance <= 2 || infectionExposure.timestampTo - infectionExposure.timestampFrom >= 15 * 60 * 1000) && risk != ExposureRisk.HIGH) {
                            risk = ExposureRisk.LOW;
                        }
                    }

                    previousInfectionExposure = infectionExposure;

                });

                if(totalSignalMeasurements > 0) {
                    let avgSignal = rssiSignalsAddition / totalSignalMeasurements;
                    let distance = this.calculateDistance(avgSignal);
                    console.log(totalSignalMeasurements + ", " + avgSignal + ", " + distance + ", " + totalTime);
                    if(distance <= 2 && totalTime >= 15 * 60 * 1000) {
                        risk = ExposureRisk.HIGH;
                    }
                    else if((distance <= 2 || totalTime >= 15 * 60 * 1000) && risk != ExposureRisk.HIGH) {
                        risk = ExposureRisk.LOW;
                    }
                }
                else if(totalTime >= 15 * 60 * 1000 && risk != ExposureRisk.HIGH) {
                    risk = ExposureRisk.LOW;
                }

            }

        }

        return risk;

    }

    /**
     * Based on
     * https://iotandelectronics.wordpress.com/2016/10/07/how-to-calculate-distance-from-the-rssi-value-of-the-ble-beacon/
     *
     * @param rssi
     */
    protected calculateDistance(rssi: number) {

        let measuredPower = -69;
        let N = 2;
        let distance = 10 ** ((measuredPower - rssi)/(10 * N));

        return distance;

    }


}

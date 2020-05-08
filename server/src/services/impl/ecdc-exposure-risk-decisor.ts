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
        });

        for(let anonymizedInfectedUuuid of infectionExposuresPerContact.keys()) {

            let contactInfectionExposures = infectionExposuresPerContact.get(anonymizedInfectedUuuid);
            if(contactInfectionExposures != undefined) {
                let totalTime = 0;
                let rssiSignalsAddition = 0;
                let totalSignalMeasurements = 0;
                contactInfectionExposures.forEach(infectionExposure => {
                    totalTime += infectionExposure.timestampTo - infectionExposure.timestampFrom;
                    if(infectionExposure.rssi != null) {
                        rssiSignalsAddition += infectionExposure.rssi;
                        totalSignalMeasurements++;
                        if(infectionExposure.rssi > -120 && infectionExposure.timestampTo - infectionExposure.timestampFrom >= 15 * 60 * 1000) {
                            risk = ExposureRisk.HIGH;
                        }
                        else if(infectionExposure.rssi > -120 || infectionExposure.timestampTo - infectionExposure.timestampFrom >= 15 * 60 * 1000 && risk != ExposureRisk.HIGH) {
                            risk = ExposureRisk.LOW;
                        }
                    }
                });
                if(totalSignalMeasurements > 0) {
                    let avgSignal = rssiSignalsAddition / totalSignalMeasurements;
                    if(avgSignal > -120 && totalTime >= 15 * 60 * 1000) {
                        risk = ExposureRisk.HIGH;
                    }
                    else if(avgSignal > -120 && totalTime >= 15 * 60 * 1000 && risk != ExposureRisk.HIGH) {
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


}

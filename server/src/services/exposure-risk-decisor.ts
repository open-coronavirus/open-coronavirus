import {InfectionExposure} from "../models";


export interface ExposureRiskDecisor {

    /**
     * Decides the risk of infection for a given patient.
     * Consider all the infection exposure items from the same patient
     *
     * This method returns HIGH, LOW or NONE depending the risk
     * that the implementation decides
     *
     * @param infectionExposures
     */
    decideRisk(infectionExposures: InfectionExposure[]): ExposureRisk;

}

export enum ExposureRisk {
    NONE = 1,
    LOW = 2,
    HIGH = 3
}

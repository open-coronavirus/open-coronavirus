import { PatientStatus } from '../../../../../server/src/common/utils/enums';

export function getNameStatus(status) {
    switch (status) {
        case PatientStatus.UNKNOWN:
            return $localize`:@@statusNoData:Anónimo`;
        case PatientStatus.UNINFECTED:
            return $localize`:@@statusNoInfected:Negativo`;
        case PatientStatus.INFECTION_SUSPECTED:
            return $localize`:@@statusQuarantine:Cuarentena obligatoria`;
        case PatientStatus.INFECTED:
            return $localize`:@@statusInfected:Positivo`;
        case PatientStatus.IMMUNE:
            return $localize`:@@statusImune:Inmune`;
    }
}

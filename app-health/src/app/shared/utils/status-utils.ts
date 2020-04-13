
export function getNameStatus(status) {
    switch (status) {
        case 1:
            return $localize`:@@statusNoData:Anónimo`;
        case 2:
            return $localize`:@@statusNoInfected:Negativo`;
        case 3:
            return $localize`:@@statusQuarantine:Cuarentena obligatoria`;
        case 4:
            return $localize`:@@statusInfected:Positivo`;
        case 5:
            return $localize`:@@statusImune:Inmune`;
    }
}

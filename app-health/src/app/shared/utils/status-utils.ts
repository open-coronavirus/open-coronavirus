
export function getNameStatus(status) {
    switch (status) {
        case 1:
            return $localize`:@@pleaseWait:Anónimo`;
        case 2:
            return $localize`:@@pleaseWait:Negativo`;
        case 3:
            return $localize`:@@pleaseWait:Cuarentena obligatoria`;
        case 4:
            return $localize`:@@pleaseWait:Positivo`;
    }
}

export enum TestResultEnum {
    CORONAVIRUS_SUSPICIOUS = 1,
    OK = 2
}

export enum TestActionEnum {
    SHOW_PHONE_INFORMATION = 1,
    SCHEDULE_TEST_APPOINTMENT_AT_HEALTH_CENTER = 2,
    SCHEDULE_TEST_APPOINTMENT_AT_HOME = 3
}

export enum AppointmentType {
    AT_HOME = 1,
    AT_HEALTH_CENTER = 2
}

export enum TestType {
    AUTOTEST = 'autotest',
    FOLLING_UP = 'following-up'
}

export enum PatientStatus {
    UNKNOWN = 0,
    INFECTED = 1,
    UNINFECTED = 2,
    INFECTION_SUSPECTED = 3,
    IMMUNE = 10

}

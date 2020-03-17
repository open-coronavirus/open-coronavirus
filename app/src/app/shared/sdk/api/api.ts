export * from './geolocationController.service';
import { GeolocationControllerService } from './geolocationController.service';
export * from './leaveRequestController.service';
import { LeaveRequestControllerService } from './leaveRequestController.service';
export * from './patientController.service';
import { PatientControllerService } from './patientController.service';
export * from './pingController.service';
import { PingControllerService } from './pingController.service';
export const APIS = [GeolocationControllerService, LeaveRequestControllerService, PatientControllerService, PingControllerService];

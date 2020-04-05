export * from './userController.service';
import { UserControllerService } from './userController.service';
import { PatientControllerService } from './patientController.service';

export const APIS = [ UserControllerService, PatientControllerService];

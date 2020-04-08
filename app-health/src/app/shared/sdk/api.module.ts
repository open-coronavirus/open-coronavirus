import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AuthControllerService } from './api/authController.service';
import { BluetoothLeAdvertisementControllerService } from './api/bluetoothLeAdvertisementController.service';
import { DocumentControllerService } from './api/documentController.service';
import { GeolocationControllerService } from './api/geolocationController.service';
import { HealthCenterControllerService } from './api/healthCenterController.service';
import { LeaveRequestControllerService } from './api/leaveRequestController.service';
import { PatientControllerService } from './api/patientController.service';
import { PingControllerService } from './api/pingController.service';
import { PoliceOfficerControllerService } from './api/policeOfficerController.service';
import { SanitarianControllerService } from './api/sanitarianController.service';
import { TestAppointmentControllerService } from './api/testAppointmentController.service';
import { TestQuestionControllerService } from './api/testQuestionController.service';
import { TestResultControllerService } from './api/testResultController.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}

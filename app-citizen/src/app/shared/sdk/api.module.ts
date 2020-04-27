import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { ContactControllerService } from './api/contactController.service';
import { GeolocationControllerService } from './api/geolocationController.service';
import { HealthCenterControllerService } from './api/healthCenterController.service';
import { InfectedKeyControllerService } from './api/infectedKeyController.service';
import { InfectionExposureControllerService } from './api/infectionExposureController.service';
import { InstallationControllerService } from './api/installationController.service';
import { LeaveRequestControllerService } from './api/leaveRequestController.service';
import { MeControllerService } from './api/meController.service';
import { MinVersionControllerService } from './api/minVersionController.service';
import { PatientControllerService } from './api/patientController.service';
import { PingControllerService } from './api/pingController.service';
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

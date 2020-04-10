import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import axios from 'axios';
import {join} from 'path';
import {MySequence} from './sequence';
import {HealthCenterMockService} from './services/impl/health-center-mock.service';
import {LeaveRequestService} from './services/leave-request.service';
import {AuthMockService} from './services/impl/auth-mock.service';
import {SampleGovernmentServerAppointmentService} from './services/impl/SampleGovernmentServerAppointmentService';
import {SampleGovernmentServerHttpClient} from './infrastructure/application/query/patient/http/SampleGovernmentServerHttpClient';

const fs = require('fs');
const dotenv = require('dotenv');

export class CoronavirusServerApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    console.log('Loading ' + join(process.cwd(), '.env') + ' ...');
    let envConfig = dotenv.parse(fs.readFileSync(join(process.cwd(), '.env')));
    for (let envVarName in envConfig) {
      process.env[envVarName] = envConfig[envVarName];
    }
    //environment specific
    console.log(
      'Loading ' + join(process.cwd(), '.env.' + process.env.NODE_ENV),
    );
    envConfig = dotenv.parse(
      fs.readFileSync(join(process.cwd(), '.env.' + process.env.NODE_ENV)) +
        ' ...',
    );
    for (let envVarName in envConfig) {
      process.env[envVarName] = envConfig[envVarName];
    }

    options.rest = {
      port: process.env.PORT,
      cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true,
      },
    };

    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    //Define custom services at this point:
    this.service(SampleGovernmentServerAppointmentService, {
      interface: 'AppointmentService',
    });
    this.service(HealthCenterMockService, {interface: 'HealthCenterService'});
    this.service(AuthMockService, {interface: 'AuthService'});
    this.service(LeaveRequestService);

    // Other
    this.bind('SampleGovernmentServerHttpClient').toDynamicValue(
      () =>
        new SampleGovernmentServerHttpClient(
          axios.create({
            baseURL: process.env.SAMPLE_GOVERNMENT_HTTP_URL,
            timeout: 1000,
          }),
        ),
    );

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}

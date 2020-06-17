import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, ContextTags} from '@loopback/core';
import {RestExplorerBindings, RestExplorerComponent,} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {join} from 'path';
import {AppointmentMockService} from './services/impl/appointment-mock.service';
import {HealthCenterMockService} from './services/impl/health-center-mock.service';
import {LeaveRequestService} from "./services/leave-request.service";
import {AuthenticationSequence} from "./authentication-sequence";
import {AuthenticationComponent, registerAuthenticationStrategy} from "@loopback/authentication";
import {AuthorizationComponent, AuthorizationTags} from "@loopback/authorization";
import {Auth0AuthenticationStrategy, JWTServiceProvider} from "./security";
import {MyAuthorizationProvider} from "./security/authorizor";
import {PushNotificationService} from "./services/pushnotification.service";
import {PatientService} from "./services/patient.service";
import {UserValidatorMockService} from "./services/impl/user-validator-mock.service";
import KEY = ContextTags.KEY;
import {EcdcExposureRiskDecisor} from "./services/impl/ecdc-exposure-risk-decisor";

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
    console.log('Loading ' + join(process.cwd(), '.env.' + process.env.NODE_ENV));
    envConfig = dotenv.parse(fs.readFileSync(join(process.cwd(), '.env.' + process.env.NODE_ENV)) + ' ...');
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
      }
    };

    super(options);

    // Bind authentication component related elements
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    // Register the Auth0 JWT authentication strategy
    registerAuthenticationStrategy(this, Auth0AuthenticationStrategy);
    this.configure(KEY).to({
      jwksUri: process.env.JWKS_URI,
      audience: process.env.AUDIENCE,
      issuer: process.env.ISSUER,
      algorithms: ['RS256'],
    });

    this.bind('authorizationProviders.my-provider')
      .toProvider(MyAuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);


    // Set up the custom sequence
    this.sequence(AuthenticationSequence);

    // Customize @loopback/rest-explorer configuration here
    // todo: uncomment to enjoy the rest explorer (don't do that in production)
    //this.bind(RestExplorerBindings.CONFIG).to({
    //  path: '/explorer'
    //});
    //this.component(RestExplorerComponent);

    //Define custom services at this point:
    this.service(AppointmentMockService, { interface: 'AppointmentService' });
    this.service(HealthCenterMockService, { interface: 'HealthCenterService' });
    this.service(UserValidatorMockService, { interface: 'UserValidatorService' });
    this.service(EcdcExposureRiskDecisor, { interface: 'ExposureRiskDecisor' });
    this.service(LeaveRequestService);
    this.service(PatientService);
    this.service(PushNotificationService, { interface: 'PushNotificationService' });
    this.service(JWTServiceProvider);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      }
    };

  }

}

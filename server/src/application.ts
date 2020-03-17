import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path, {join} from 'path';
import {MySequence} from './sequence';

const fs = require('fs');
const dotenv = require('dotenv');

export class CoronavirusServerApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {

    console.log("Loading " + join(process.cwd(), '.env'));

    let envConfig = dotenv.parse(fs.readFileSync(join(process.cwd(), '.env')));
    for (var k in envConfig) {
      process.env[k] = envConfig[k]
    }
    //environment specific
    envConfig = dotenv.parse(fs.readFileSync(join(process.cwd(), '.env.' + process.env.NODE_ENV)));
    for (var k in envConfig) {
      process.env[k] = envConfig[k]
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

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    //this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

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

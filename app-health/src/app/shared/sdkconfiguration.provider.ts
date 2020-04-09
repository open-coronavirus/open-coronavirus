import {Configuration} from './sdk';

const sdkConfigurationFactory = (environment: any) => {
    const returnValue = new Configuration();
    returnValue.basePath = environment.apiBasePath;

    return returnValue;
};

export let sdkConfigurationProvider = { provide: Configuration,
      useFactory: sdkConfigurationFactory,
      deps: ['environment']
    };


import {juggler} from '@loopback/repository';

export const testdb: juggler.DataSource = new juggler.DataSource({
    name: 'db',
    connector: 'memory',
});

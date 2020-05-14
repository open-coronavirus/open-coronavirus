import {inject} from '@loopback/context';
import {Response, Request, RestBindings} from '@loopback/rest';
import {
    AuthenticationStrategy,
    AuthenticationBindings,
    AuthenticationMetadata,
} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';

import * as jwt from 'express-jwt';
import {JWT_SERVICE} from './types';
const jwtAuthz = require('express-jwt-authz');

export class Auth0AuthenticationStrategy implements AuthenticationStrategy {

    name = 'auth0-jwt';

    constructor(
        @inject(RestBindings.Http.RESPONSE)
        private response: Response,
        @inject(AuthenticationBindings.METADATA)
        private metadata: AuthenticationMetadata,
        @inject(JWT_SERVICE)
        private jwtCheck: jwt.RequestHandler,
    ) {}

    async authenticate(request: Request): Promise<UserProfile | undefined> {
        return new Promise<UserProfile | undefined>((resolve, reject) => {
            this.jwtCheck(request, this.response, (err?: any) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                // If the `@authenticate` requires `scopes` check
                if (this.metadata.options && this.metadata.options.scopes) {
                    jwtAuthz(this.metadata.options!.scopes, {failWithError: true})(
                        request,
                        this.response,
                        (err2?: any) => {
                            if (err2) {
                                console.error(err2);
                                reject(err2);
                                return;
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            resolve((request as any).user);
                        },
                    );
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    resolve((request as any).user);
                }
            });
        });
    }
}

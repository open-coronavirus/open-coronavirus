import {BindingKey} from '@loopback/context';
import jwt = require('express-jwt');
import {
    AuthenticationStrategy,
    AuthenticationBindings,
} from '@loopback/authentication';

export interface Auth0Config {
    jwksUri: string;
    audience: string;
    issuer: string;
    algorithms: string[];
}

export const JWT_SERVICE = BindingKey.create<jwt.RequestHandler>(
    'services.JWTService',
);

export const KEY = BindingKey.create<AuthenticationStrategy>(
    `${AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME}.JWTAuthenticationStrategy`,
);

import {Provider} from '@loopback/context';
import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';


export class MyAuthorizationProvider implements Provider<Authorizer> {
    /**
     * @returns an authorizer function
     *
     */
    value(): Authorizer {
        return this.authorize.bind(this);
    }

    async authorize(
        context: AuthorizationContext,
        metadata: AuthorizationMetadata,
    ) {

        if( context.principals.length > 0 ) {

            let principal = context.principals[0];
            //principal.email, principal....
            console.log(principal);
            //here can check permissions at this point
            return AuthorizationDecision.ALLOW;
        }

        return AuthorizationDecision.DENY;
    }
}

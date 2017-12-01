import { Accounts } from 'meteor/accounts-base';
import { HTTP } from 'meteor/http';
import { OAuth } from 'meteor/oauth';
const crypto = Npm.require('crypto');
const whitelistedFields = [
    'id',
    'email',
    'name',
    'first_name',
    'last_name',
    'link',
    'gender',
    'locale',
    'age_range',
];
const getIdentity = (accessToken, fields) => {
    const config = ServiceConfiguration.configurations.findOne({
        service: 'facebook',
    });
    if (!config) {
        throw new ServiceConfiguration.ConfigError();
    }
    const hmac = crypto.createHmac('sha256', OAuth.openSecret(config.secret));
    hmac.update(accessToken);
    try {
        return HTTP.get('https://graph.facebook.com/v2.8/me', {
            params: {
                access_token: accessToken,
                fields: fields.join(',')
            }
        }).data;
    } catch (err) {
        throw _.extend(
            new Error(`Failed to fetch identity from Facebook. ${err.message}`),
            { response: err.response }
        );
    }
}
const handleAuthFromAccessToken = (accessToken, expiresAt) => {
    const identity = getIdentity(accessToken, whitelistedFields);
    const serviceData = {
        accessToken,
        expiresAt,
    };
    const fields = _.pick(identity, whitelistedFields);
    _.extend(serviceData, fields);
    return {
        serviceData,
        options: { profile: { name: identity.name } }
    }
}
export const registerFacebookMobileLoginHandler = () => {
    Accounts.registerLoginHandler('facebookMobileLogin', params => {
        const data = params.facebookMobileLogin;
        if (!data) {
            return undefined;
        }
        const identity = handleAuthFromAccessToken(
            data.accessToken,
            (+new Date()) + (1000 * data.expirationTime)
        )
        return Accounts.updateOrCreateUserFromExternalService(
            'facebook',
            {
                ...identity.serviceData
            },
            identity.options
        )
    })
}
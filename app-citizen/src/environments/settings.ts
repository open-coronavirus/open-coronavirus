export const settings = {
    header: {
        logo: '',
        text: '<strong>Sacyl</strong> CORONAVIRUS', //'<strong>OPEN</strong> CORONAVIRUS',
        bgcolor: '#6599CB' //#c80f2e'
    },
    footer: {
        logo: '/assets/images/icon-escudo-castilla-leon.svg',
    },
    home : {
        moduleHome: true,
        moduleRequestTest: true,
        moduleAutoTest: true,
        moduleFollowingUp: true,
    },
    moreInfoUrl: 'https://coronavirus.epidemixs.org/#/opening',
    autoTestUrl: '',
    followingUpUrl: '',
    appVersion: '1.0.0',
    techSupportPhone: '555 555 5555',
    shareApp: {
        text: 'Compartir App para luchar juntos'
    },
    enabled: {
        push: true,
        gps: false,
        bluetooth: true
    },
    screens: {
        selfDeclarationLeave: false
    },
    uploadAutomaticallyContactsToServerIfUserHasCoronavirus: false,
    // If uploadAutomaticallyContactsToServerIfUserHasCoronavirus is activated, this property is ignored
    requestUserConsentToUploadContactsToServerIfUserHasCoronavirus: true,
    stores: {
        urlAppStore: 'https://itunes.apple.com/es/app/coronaapp/idxxxxxx',
        urlGooglePlay: 'https://play.google.com/store/apps/details?id=xxxx.coronaapp.xxx'
    }


};

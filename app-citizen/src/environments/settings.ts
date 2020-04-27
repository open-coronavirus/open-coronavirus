export const settings = {
    appId: 'com.opencoronavirus',
    header: {
        logo: '',
        text: '<strong>OPEN</strong> CORONAVIRUS',
        bgcolor: '#c80f2e'
    },
    footer: {
        logo: '',
    },
    home : {
        moduleHome: true,
        moduleRequestTest: true,
        moduleAutoTest: true,
        moduleFollowingUp: true,
    },
    moreInfoUrl: 'https://coronavirus.epidemixs.org/#/opening',
    requestTestUrl: '',
    autoTestUrl: '',
    followingUpUrl: '',
    appVersion: '${VERSION_NUMBER}',
    techSupportPhone: '555 555 5555',
    useDecentralizedProtocol: true,
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
    debug: {
        showMyUUID: true,
        showNearestDevicesUUID: true
    },
    uploadAutomaticallyContactsToServerIfUserHasCoronavirus: false,
    // If uploadAutomaticallyContactsToServerIfUserHasCoronavirus is activated, this property is ignored
    requestUserConsentToUploadContactsToServerIfUserHasCoronavirus: true,
    stores: {
        urlAppStore: 'https://itunes.apple.com/es/app/coronaapp/idxxxxxx',
        urlGooglePlay: 'https://play.google.com/store/apps/details?id=xxxx.coronaapp.xxx'
    },
    autoshare: false,
    identifierQR: true,
    register: {
        moduleHome : true,
        moduleContact : true
    }

};

// Settings
FacebookInAppBrowser.settings.appId = '1545172195712716';
FacebookInAppBrowser.settings.redirectUrl = 'http://example.com';
FacebookInAppBrowser.settings.permissions = 'email, ';

// Optional
FacebookInAppBrowser.settings.timeoutDuration = 7500;

// Login(accessToken will be stored trough localStorage in 'accessToken');
FacebookInAppBrowser.login({
    send: function() {
        console.log('login opened');
    },
    success: function(access_token) {
        console.log('done, access token: ' + access_token);
    },
    denied: function() {
        console.log('user denied');
    },
    timeout: function(){
        console.log('a timeout has occurred, probably a bad internet connection');
    },
    complete: function(access_token) {
        console.log('window closed');
        if(access_token) {
            console.log(access_token);
        } else {
            console.log('no access token');
        }
    },
    userInfo: function(userInfo) {
        if(userInfo) {
            console.log(JSON.stringify(userInfo));
        } else {
            console.log('no user info');
        }
    }
});

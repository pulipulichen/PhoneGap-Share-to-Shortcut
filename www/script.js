ready = function () {
    try {
        window.plugins.intent.setNewIntentHandler(function (intent) {
            /*
            try {
                intent_handler(intent);
            } catch (e) {
                alert(e);
                navigator.app.exitApp();
            }
            */
        }, function (e) {
            
        });

        window.plugins.intent.getCordovaIntent(function (intent) {
            try {
                $.getScript("config_sts.js", function () {
                    intent_handler(intent);
                });
            } catch (e) {
                alert(e);
                navigator.app.exitApp();
            }
        });
    } catch (e) {
        alert("ready fail: " + e);
    }
};

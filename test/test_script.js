intent_handler = function (intent) {
    //alert("換了 可以嗎？");
    //alert(JSON.stringify(intent));
    $.post("http://pc.pulipuli.info/phonegap-build-projects/PhoneGapBuild-ShareToShortcut/test/post.php", {
        data: JSON.stringify(intent, null, "\t")
    });
    
    if (typeof(intent.extras) === "object" 
            && typeof(intent.extras["pgb_share_to_shortcut.pulipuli.info.action"]) === "string" ) {
        
        openActivity(intent);
        return;
    }
    
    /*
    var shortcut = {
        id: 'my_shortcut_1',
        shortLabel: 'Short description',
        //longLabel: 'Longer string describing the shortcut',
        //iconBitmap: '<Bitmap for the shortcut icon, base64 encoded>', // Defaults to the main application icon
        intent: {
            action: 'android.intent.action.RUN',
            categories: [
                'android.intent.category.TEST', // Built-in Android category
                'MY_CATEGORY' // Custom categories are also supported
            ],
            flags: 67108864, // FLAG_ACTIVITY_CLEAR_TOP
            data: 'pgb://path/to/launch?param=value', // Must be a well-formed URI
            extras: {
                'android.intent.extra.SUBJECT': 'Hello world!', // Built-in Android extra (string)
                'MY_BOOLEAN': true, // Custom extras are also supported (boolean, number and string only)
            }
        }
    }
    */
    var shortcut = {
        id: 'my_shortcut_7',
        shortLabel: '1503 Short description',
        //longLabel: 'Longer string describing the shortcut',
        iconBitmap: "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", // Defaults to the main application icon
        intent: {
            //action: 'android.intent.action.WEB_SEARCH',
            /*
            categories: [
                'android.intent.category.TEST', // Built-in Android category
                'MY_CATEGORY' // Custom categories are also supported
            ],
            flags: 67108864, // FLAG_ACTIVITY_CLEAR_TOP
            data: 'pgb://path/to/launch?param=value', // Must be a well-formed URI
            */
            extras: {
                //'android.intent.extra.SUBJECT': 'Hello world!', // Built-in Android extra (string)
                //'MY_BOOLEAN': true, // Custom extras are also supported (boolean, number and string only)
                "action": 'android.intent.action.WEB_SEARCH',
                "extras.query": "Pokemon go"
            }
        }
    };
    
    window.plugins.Shortcuts.addPinned(shortcut, function() {
        window.alert('Shortcut pinned successfully');
    }, function(error) {
        window.alert('Error: ' + error);
    })
    
    navigator.app.exitApp();
    return;
    
    if (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.MAIN") {
        // 沒有要檢索的東西，回家吧。
        //alert("空空");
        openActivity();
        navigator.app.exitApp();
        return;
    }

    var _search_items = [];

    var _has_string = function (_item) {
        return (typeof (_item) === "string"
                && _item.trim() !== "");
    };

    if (typeof (intent.extras) === "object") {
        var _extras = intent.extras;

        var _key_list = [
            "android.intent.extra.SUBJECT",
            "android.intent.extra.TEXT",
            "android.intent.extra.PROCESS_TEXT",
        ];
        
        //alert(_key_list.length);

        for (var _i = 0; _i < _key_list.length; _i++) {
            if (_has_string(_extras[_key_list[_i]])) {
                var _subject = _extras[_key_list[_i]].trim();
                for (var _j = 0; _j < FILTER_SUBJECT.length; _j++) {
                    var _needle = FILTER_SUBJECT[_j];
                    if (_subject === _needle) {
                        //_text = _text.substring(_needle.length, _text.length).trim();
                        _subject = null;
                        break;
                    }
                }
                if (null !== _subject) {
                    _search_items.push(_subject);
                }
            }
        }
        /*
         if (_has_string(_extras["android.intent.extra.SUBJECT"])) {
         _search_items.push(_extras["android.intent.extra.SUBJECT"].trim());
         }
         if (_has_string(_extras["android.intent.extra.TEXT"])) {
         _search_items.push(_extras["android.intent.extra.TEXT"].trim());
         }
         if (_has_string(_extras["android.intent.extra.PROCESS_TEXT"])) {
         _search_items.push(_extras["android.intent.extra.PROCESS_TEXT"].trim());
         }
         */
        
        //alert(JSON.stringify(_search_items));
    }

    var _test_url = _search_items.join(" ");
    _test_url = _test_url.split("\n").join(" ");
    var _url_list = [];

    var _http_list = _test_url.split("http://");
    for (var _i = 1; _i < _http_list.length; _i++) {
        var item = _http_list[_i];
        var pos = item.indexOf(" ");
        if (pos === -1) {
            pos = item.indexOf("\n");
        }
        if (pos === -1) {
            pos = item.length;
        }
        _url_list.push("http://" + item.substring(0, pos));
    }

    var _https_list = _test_url.split("https://");
    for (var _i = 1; _i < _https_list.length; _i++) {
        var item = _https_list[_i];
        var pos = item.indexOf(" ");
        if (pos === -1) {
            pos = item.indexOf("\n");
        }
        if (pos === -1) {
            pos = item.length;
        }
        _url_list.push("https://" + item.substring(0, pos));
    }
    
    //alert(_url_list.length);

    //alert(JSON.stringify(_url_list));
    if (_url_list.length > 0) {
        for (var i = 0; i < _url_list.length; i++) {
            //setTimeout(function () {
            window.open(_url_list[i], "_system");
            //}, 0);
        }
        navigator.app.exitApp();
        return;

    }

    if (_search_items.length > 0) {
        if (_search_items.length === 1
                && (_search_items[0].startsWith("http://") || _search_items[0].startsWith("https://"))) {
            //alert(encodeURIComponent(_search_items[0]));
            window.open(_search_items[0], "_system");
            navigator.app.exitApp();
        } else {
            //var _url = "https://www.google.com/search?q=" + encodeURIComponent(_search_items.join(" "));
            //var _url = "android-app://com.google.android.googlequicksearchbox/" + encodeURIComponent(_search_items.join(" "));

            //window.open(_url, "_system");

            var _search_text = _search_items.join(" ");

            var _config = {
                //action: "android.app.SearchManager.INTENT_ACTION_GLOBAL_SEARCH",
                action: "android.intent.action.WEB_SEARCH",
                //data: _search_text,
                //uri: _search_text,
                //url: _search_text,
                //pacakge: "com.google.android.googlequicksearchbox",
                extras: {
                    "query": _search_text,
                }
            };

            try {
                window.plugins.webintent.startActivity(_config,
                        function () {
                            navigator.app.exitApp();
                        },
                        function () {
                            alert('Failed:' + JSON.stringify(_search_items.join(" "), null, 2));
                            navigator.app.exitApp();
                        }
                );
            } catch (e) {
                alert(e);
            }
        }
    }
    else {
        openActivity();
    }
    //alert([JSON.stringify(_search_items)
    //    , _search_items.length === 1
    //    , _search_items[0].startsWith("http://") 
    //    , _search_items[0].startsWith("https://")]);

    //navigator.app.exitApp();
};


openActivity = function (_intent) {
    var _config = {
        action: _intent.extras["pgb_share_to_shortcut.pulipuli.info.action"],
        extras: {}
    };
    
    // parsing extras
    var _intent_extras = _intent.extras;
    for (var _i in _intent_extras) {
        if (_i === "pgb_share_to_shortcut.pulipuli.info.action"
                || _i.startsWith("extras.") === false) {
            continue;
        }
        
        var _key = _i.substring(_i.indexOf(".") + 1, _i.length);
        var _value = _intent_extras[_i];
        _config.extras[_key] = _value;
    }

    try {
        window.plugins.webintent.startActivity(_config,
                function () {
                    navigator.app.exitApp();
                },
                function () {
                    navigator.app.exitApp();
                }
        );
    } catch (e) {
        alert(e);
    }
};

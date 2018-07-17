DEBUG = false;

var FILTER_SUBJECT = [
    "Text Scanner"
];

intent_handler = function (intent) {
    //alert("換了 可以嗎？ 沒有換");
    //alert(JSON.stringify(intent));
    //alert("intent: " + typeof(STS_QUEUE));
    
    // -----------------------------
    /*
    var fpath = "file:///storage/emulated/0/Download/a.pdf";
    alert(fpath);
    window.plugins.gdrive.uploadFile(fpath,
            function (response) {
                //simple response message with the status
                alert(JSON.stringify(response));
            },
            function (error) {
                aler(error);
            }
    );
    */
    
    // ------------------------------
    
    if (typeof(intent.extras) === "object" 
            && typeof(intent.extras["pgb_share_to_shortcut.pulipuli.info.action"]) === "string" ) {
        debugMessage("shortcut", intent);
        openActivity(intent);
        return;
    }
    else {
        debugMessage("send", intent);
    }
    
    // ----------------------------
    
    /*
    var toLocalDest = "cdvfile://localhost/temporary/tmp.pdf";
    //var toLocalDest = "file:///storage/emulated/0/Download/b.pdf";
    var fileid = "1TSbj3xPnzwKyQnVmvFmRTM3XDuCTXSQf";
    alert(fileid);
    window.plugins.gdrive.downloadFile(toLocalDest, fileid,
       function (response) {
           alert("ok: " + JSON.stringify(response));
           navigator.app.exitApp();
       },
       function (error){
         alert("error: " +JSON.stringify(error));
         navigator.app.exitApp();
       }
    );
    */
    
    /*
    var fpath = "file:///storage/emulated/0/Download/a.pdf";
    alert(fpath);
    window.plugins.gdrive.uploadFile(fpath,
            function (response) {
                //simple response message with the status
                alert(JSON.stringify(response));
            },
            function (error) {
                aler(error);
            }
    );
    */
   
    //return;
    
    // ---------------------------
    
    if (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.MAIN") {
        // 直接開啟主程式
        openMainTest();
        
        // 沒有要檢索的東西，回家吧。
        CTS_CLIPBOARD.process(function () {
            CTS_CUSTOM_SHORTCUT.process();
        });
        return;
    }
    
    // ----------------------------

    for (var _i = 0; _i < STS_QUEUE.length; _i++) {
        var _sts = STS_QUEUE[_i];
        
        if (_sts.isSendFrom(intent) ) {
            //alert(_sts.action);
            _sts.createShortcut(intent);
            return;
        }
    }
    //alert("no sts found");
            
    // -----------------------------
    
    var _search_items = [];

    if (typeof (intent.extras) === "object") {
        var _extras = intent.extras;

        var _key_list = [
            "android.intent.extra.SUBJECT",
            "android.intent.extra.TEXT",
            "android.intent.extra.PROCESS_TEXT",
        ];
        
        //alert(_key_list.length);

        for (var _i = 0; _i < _key_list.length; _i++) {
            if (hasString(_extras[_key_list[_i]])) {
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
            //window.open(_url_list[i], "_system");
            var _extras = {
                //'android.intent.extra.SUBJECT': 'Hello world!', // Built-in Android extra (string)
                //'MY_BOOLEAN': true, // Custom extras are also supported (boolean, number and string only)
                "action": 'android.intent.action.WEB_SEARCH',
                "extras.query": _url_list[i]
            };
            //createShortcut("測試", _extras, "search"); 
        }
        navigator.app.exitApp();
        return;

    }
    
    // ---------------------------------------------

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

createShortcut = function (_title, _extras, _icon_type) {
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
    
    var _icon = _icon_type;
    if (typeof(ICON_BASE64[_icon]) === "string") {
        _icon = ICON_BASE64[_icon];
    }
    //alert(_icon);
    
    var _shortcut = {
        id: 'pgb-share-to-shortcut.pulipuli.info_' + (new Date().getTime()),
        shortLabel: _title,
        //longLabel: 'Longer string describing the shortcut',
        iconBitmap: _icon,
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
            extras: _extras
        }
    };
    
    /*
    window.plugins.Shortcuts.addPinned(shortcut, function() {
        window.alert('Shortcut pinned successfully');
    }, function(error) {
        window.alert('Error: ' + error);
    });
    */
    //alert(1);
    //alert(_shortcut);
    try {
        window.plugins.Shortcuts.addPinned(_shortcut, function () {
            navigator.app.exitApp();
        }, function (error) {
            alert(error);
            /*
            window.plugins.Shortcuts.setDynamic([_shortcut], function() {
                navigator.app.exitApp();
            }, function(error) {
                //window.alert('Error: ' + error);
                alert(error);
            });
            */
        });
    } catch (e) {
        alert(e);
    }
    
    //navigator.app.exitApp();
    //return;
};

openActivity = function (_intent) {
    var _action = _intent.extras["pgb_share_to_shortcut.pulipuli.info.action"];
    for (var _i = 0; _i < STS_QUEUE.length; _i++) {
        var _sts = STS_QUEUE[_i];
        if (_action === _sts.action) {
            _sts.openActivity(_intent);
            return;
        }
    } 
    
    // -----------------------------------------
    
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
        
        if (["beginTime", "dtstart", "endTime", "dtend"].indexOf(_key) > 0) {
            //alert(_value);
            eval("_value = " + _value.split('\"').join(""));
        }
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

openMainTest = function () {
    return;
    
    if (DEBUG === false) {
        return;
    }
    
    // folder:R6WNVF2Z
    
    //var _url = "https://drive.google.com/drive/u/0/search?q=R6WNVF2Z";
    var _url = "https://drive.google.com/drive/mobile/search?q=type:folder%20R6WNVF2Z";
    window.open(_url, "_system");
    
    navigator.app.exitApp();
};
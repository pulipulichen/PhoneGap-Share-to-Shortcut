DEBUG = false;

var FILTER_SUBJECT = [
    "Text Scanner"
];

intent_handler = function (intent) {
    //alert("換了 可以嗎？ 沒有換沒換沒換");
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
    
    if (typeof(_title) !== 'string') {
      _title = 'SHORTCUT'
    }
    
    var _icon = _icon_type;
    if (typeof(ICON_BASE64[_icon]) === "string") {
        _icon = ICON_BASE64[_icon];
    }
    else if (typeof(_icon) !== 'string') {
      _icon = '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'
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
    
    debugMessage('addPinned', _shortcut)
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
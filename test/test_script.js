DEBUG = false;

intent_handler = function (intent) {
    //alert("換了 可以嗎？");
    //alert(JSON.stringify(intent));
    
    if (typeof(intent.extras) === "object" 
            && typeof(intent.extras["pgb_share_to_shortcut.pulipuli.info.action"]) === "string" ) {
        
        
        debugMessage("shortcut", intent);
        
        openActivity(intent);
        return;
    }
    else {
        
        debugMessage("send", intent);
        
    }
    
    // ---------------------------
    
    if (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.MAIN") {
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
        
        if (_key === "beginTime") {
            alert(_value);
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

// --------------

debugMessage = function (_filename, _data) {
    if (DEBUG !== true) {
        return;
    }
    
    if (typeof(_data) === "object") {
        _data = JSON.stringify(_data, null, "\t");
    }
    
    $.post("http://pc.pulipuli.info/phonegap-build-projects/PhoneGapBuild-ShareToShortcut/test/post.php?filename=" + _filename, {
        data: _data
    });
};
    


hasString = function (_item) {
    return (typeof (_item) === "string"
            && _item.trim() !== "");
};

getURLtoTitle = function (_url, _callback) {
    $.ajax({
        url: _url,
        async: true,
        success: function (data) {
            //alert(data);
            //var matches = data.match(/<title>(.*?)<\/title>/);
            //var doc = new DOMParser().parseFromString(data, "text/html");
            //var title = $(jQuery.parseHTML(data)).html();
            var _head = data.indexOf("<title>") + 7;
            var _foot = data.indexOf("</title>", _head);
            var title = null;
            if (_head > -1 && _foot > -1) {
                title = data.substring(_head, _foot).trim();
            }
            _callback(title);
        }
    });
};

getURLtoHTML = function (_url, _selector, _callback) {
    $.ajax({
        url: _url,
        async: true,
        success: function (data) {
            var _head = data.indexOf("<body");
            var _foot = data.indexOf("</body>", _head) + 7;
            var _title = "";
            if (_head > -1 && _foot > -1) {
                var _body = data.substring(_head, _foot).trim();
                _title = $(_body).find(_selector).html();
            }
            _callback(_title);
        }
    });
};

getTimeDelay = function (_min) {
    // 1531061447642
    // 1531076363
    var _current = (new Date()).getTime();
    var _delay_second = _min * 60 * 1000;
    //_delay_second += 8 * 60 * 60 * 1000;
    return _current + _delay_second;
};

intentStartActivity = function (_config) {
    if (typeof(_config.extras) === "object") {
        var _extras = _config.extras;
        if (typeof(_extras["beginTime"]) === "string") {
            eval('_extras["beginTime"] = ' + _extras["beginTime"]);
        }
    }
    window.plugins.webintent.startActivity(_config,
            function () {
                navigator.app.exitApp();
            },
            function (e) {
                alert('Start activity failed:' + JSON.stringify(e, null, 2));
                navigator.app.exitApp();
            }
    );
};


// ----------------------------------

CTS_TEST = {
    action: "cts.test",
    isSendFrom: function () {
        return true;
    },
    createShortcut: function () {
        var _subject = "STS TEST";
        //var _url = "https://drive.google.com/drive/u/0/search?q=type:pdf";
        var _extras = {
            "action": this.action,
            //"url": _url
        };
        createShortcut(_subject, _extras, "test"); 
        navigator.app.exitApp();
    },
    openActivity: function (_intent) {
        
        // Prepare the picker configuration
        var config = {
            title: "Select a Fruit",
            items: [
                {text: "Orange", value: "orange"},
                {text: "Apple", value: "apple"},
                {text: "Watermelon", value: "watermelon"},
                {text: "Papaya", value: "papaya"},
                {text: "Banana", value: "banana"},
                {text: "Pear", value: "pear"},
                {text: "Orange", value: "orange"},
                {text: "Apple", value: "apple"},
                {text: "Watermelon", value: "watermelon"},
                {text: "Papaya", value: "papaya"},
                {text: "Banana", value: "banana"},
                {text: "Pear", value: "pear"},
                {text: "Orange", value: "orange"},
                {text: "Apple", value: "apple"},
                {text: "Watermelon", value: "watermelon"},
                {text: "Papaya", value: "papaya"},
                {text: "Banana", value: "banana"},
                {text: "Pear", value: "pear"},
            ],
            selectedValue: "papaya",
            doneButtonLabel: "Done",
            cancelButtonLabel: "Cancel"
        };

// Show the picker
        window.plugins.listpicker.showPicker(config,
                function (item) {
                    alert("You have selected " + item);
                },
                function () {
                    alert("You have cancelled");
                }
        );
        
        // -------------------------
        
        //var _url = "https://drive.google.com/drive/u/0/search?q=";  // Google Drive Recent
        //var _url = "https://www.youtube.com/feed/history";  // YouTube Recent
        //var _url = "fb://facewebmodal/f?href=https://www.facebook.com/pulipuli.chen";   // 布丁FB
        //var _url = "fb://facewebmodal/f?href=https://www.facebook.com/pulipuli.chen/allactivity";   // 布丁FB記錄
        //var _url = "fb://facewebmodal/f?href=https://www.facebook.com/groups/932304146879607/permalink/1506316986144984/";   // PKGO蓋塔
        //var _url = "fb://facewebmodal/f?href=https://www.facebook.com/groups/932304146879607/";   // PKGO社團
        
        /*
        intentStartActivity({
            action: "android.intent.action.EDIT",
            type: "vnd.android.cursor.item/event",
            extras: {
                title: "變身",
                beginTime: getTimeDelay(90),
            }
        });
        */
       
       /*
       intentStartActivity({
            action: "android.intent.action.EDIT",
            type: "vnd.android.cursor.item/event",
            extras: {
                title: "衣服洗好",
                beginTime: getTimeDelay(45),
            }
        });
        */
       
       /*
       intentStartActivity({
            action: "android.intent.action.EDIT",
            type: "vnd.android.cursor.item/event",
            extras: {
                title: "手環重連",
                beginTime: getTimeDelay(60),
            }
        });
        */
       
       // ---------------------
        
        //var _url = "https://drive.google.com/drive/u/0/search?q=type:pdf";
        
        //var _url = "bilibili://movie/weekend";
        //var _url = "https://ani.gamer.com.tw/viewList.php?u=guest&q=/animeVideo.php";
        
        
        //var _url = "https://calendar.google.com/calendar/event?action=TEMPLATE&text=%E8%AE%8A%E8%BA%AB&dates=20180708T213232Z/20180708T221433Z&location=l&details=d&reminder=50";
        //window.open(_url, "_system");
        //navigator.app.exitApp();
        
        
        /*
        var sApp = startApp.set({ // params 
                "action":"ACTION_MAIN",
                //"category":"android.intent.category.LAUNCHER",
                "category":"CATEGORY_LAUNCHER",
                "package": "com.bimilyoncu.sscoderss.floatingplayerforyoutube",
                //"type": "application/pdf"
        });
        sApp.start(function() { // success 
                alert("OK");
        }, function(error) { //  fail 
                alert(error);
        });
        */
        
        
        /*
        var _config = {
                //action: "android.app.SearchManager.INTENT_ACTION_GLOBAL_SEARCH",
                //action: "android.intent.action.WEB_SEARCH",
                //data: _search_text,
                //uri: _search_text,
                //url: _search_text,
                //pacakge: "com.google.android.googlequicksearchbox",
                action: "com.google.android.apps.docs.actions.SEARCH_SHORTCUT_ACTION",
                //category: "android.intent.category.LAUNCHER",
                package: "com.google.android.apps.docs",
                //type: "application/pdf",
                
                extras: {
                    "query": "a.pdf",
                }
        };
        
        window.plugins.webintent.startActivity(_config,
                function () {
                    navigator.app.exitApp();
                },
                function (e) {
                    alert('Failed:' + JSON.stringify(e, null, 2));
                    navigator.app.exitApp();
                }
        );
        */
    }
};

CTS_GOOGLE_DRIVE_RECENT = {
    display: "🕐 Google Drive Recent",
    shortcut_text: "GDrive Recent",
    icon_type: "gdrive_pdf_recent",
    url: "https://drive.google.com/drive/u/0/search?q="
};

CTS_YOUTUBE_RECENT = {
    display: "🕐 YouTube Recent",
    shortcut_text: "YouTube Recent",
    icon_type: "youtube_recent",
    url: "https://www.youtube.com/feed/history"
};

CTS_FB_PULIPULI = {
    display: "🏠 FB pulipuli.chen",
    shortcut_text: "FB布丁",
    icon_type: "facebook",
    url: "fb://facewebmodal/f?href=https://www.facebook.com/pulipuli.chen"
};

CTS_FB_PULIPULI_ACTIVITY = {
    display: "🕐 FB pulipuli.chen activity",
    shortcut_text: "FB活動",
    icon_type: "facebook",
    url: "fb://facewebmodal/f?href=https://www.facebook.com/pulipuli.chen/allactivity"
};

CTS_FB_PKGO_GROUP_CP = {
    display: "🧚 FB PKGO蓋塔",
    shortcut_text: "PKGO蓋塔",
    icon_type: "facebook",
    url: "fb://facewebmodal/f?href=https://www.facebook.com/groups/932304146879607/permalink/1506316986144984/"
};

CTS_FB_PKGO_GROUP = {
    display: "🧚 FB PKGO社團",
    shortcut_text: "PKGO社團",
    icon_type: "facebook",
    url: "fb://facewebmodal/f?href=https://www.facebook.com/groups/932304146879607/"
};

CTS_EVENT_TRANSFORM = {
    display: "⏳ 變身(90分後)",
    shortcut_text: "變身",
    icon_type: "hourglass",
    url: {
            action: "android.intent.action.EDIT",
            type: "vnd.android.cursor.item/event",
            extras: {
                title: "變身",
                beginTime: "getTimeDelay(90)",
            }
    }
};

CTS_EVENT_LAUNDRY = {
    display: "⏳ 衣服洗好(45分後)",
    shortcut_text: "衣服洗好",
    icon_type: "hourglass",
    url: {
            action: "android.intent.action.EDIT",
            type: "vnd.android.cursor.item/event",
            extras: {
                title: "衣服洗好",
                beginTime: "getTimeDelay(45)",
            }
    }
};

CTS_EVENT_PKGO_PLUS = {
    display: "⏳ 手環重連(60分後)",
    shortcut_text: "手環重連",
    icon_type: "hourglass",
    url: {
            action: "android.intent.action.EDIT",
            type: "vnd.android.cursor.item/event",
            extras: {
                title: "手環重連",
                beginTime: "getTimeDelay(60)",
            }
    }
};

CTS_LIST = [
    CTS_GOOGLE_DRIVE_RECENT,
    CTS_YOUTUBE_RECENT,
    CTS_FB_PULIPULI_ACTIVITY,
    CTS_FB_PULIPULI,
    CTS_FB_PKGO_GROUP_CP,
    CTS_FB_PKGO_GROUP,
    CTS_EVENT_TRANSFORM,
    CTS_EVENT_LAUNDRY,
    CTS_EVENT_PKGO_PLUS,
];

// --------------------------------

CTS_CLIPBOARD = {
    process: function (_callback) {
        //alert("檢查CLIPBOARD");
        //alert(typeof(cordova.plugins.clipboard.paste));
        cordova.plugins.clipboard.paste(function (_text) { 
            //alert(_text); 
            debugMessage("clipboard", _text);

            for (var _i = 0; _i < CLIPBOARD_LIST.length; _i++) {
                var _cb = CLIPBOARD_LIST[_i];
                if (_cb.isClipboardFrom(_text)) {
                    cordova.plugins.clipboard.copy("");
                    _cb.createShortcut(_text);
                    //navigator.app.exitApp();
                    return;
                }
            }

            if (typeof(_callback) === "function") {
                _callback();
            }
        });
    }
};

CTS_FACEBOOK = {
    needle_head: "https://www.facebook.com/",
    isClipboardFrom: function (_text) {
        // https://www.facebook.com/100000601780771/posts/2145127208850651/
        // https://www.facebook.com/1654388834/posts/10215594510729894/
        //alert(_text);
        return (_text.startsWith(this.needle_head));
    },
    createShortcut: function (_text) {
        var _title_url = _text;
        // fb://facewebmodal/f?href=https://www.facebook.com/533105913/posts/10155739441090914/ 
        var _url = "fb://facewebmodal/f?href=" + _title_url;
        //var _url = _title_url;
        var _icon_type = "facebook";
        
        var _extras = {
            "action": STS_FLIPERLINK.action,
            "url": _url
        };
        //alert("FB " + getDateTime());
        createShortcut("FB" + getDateTime(), _extras, _icon_type); 
        
        //CTS_TEST.createShortcut();
        //navigator.app.exitApp();
    },
};

getDateTime = function () {
    var date = new Date();
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
    var hh = date.getHours();
    var min = date.getMinutes();

    return [
        mm,
        "/",
        dd,
        " ",
        hh,
        ":",
        min
    ].join('');
};

CLIPBOARD_LIST = [
    CTS_FACEBOOK
];

CTS_CUSTOM_SHORTCUT = {
    process: function () {
        var config = {
            title: "Create a shortcut",
            items: [],
            doneButtonLabel: "Create",
            cancelButtonLabel: "Cancel"
        };

        for (var _i = 0; _i < CTS_LIST.length; _i++) {
            config.items.push({
                text: CTS_LIST[_i].display,
                value: _i
            });
        }

        // Show the picker
        window.plugins.listpicker.showPicker(config,
                function (item) {
                    //alert("You have selected " + item);
                    var _cts = CTS_LIST[item];
                    var _subject = _cts.shortcut_text;
                    var _icon_type = _cts.icon_type;
                    var _url = _cts.url;
                    if (typeof (_url) === "object") {
                        _url = JSON.stringify(_url);
                    }
                    var _extras = {
                        "action": STS_FLIPERLINK.action,
                        "url": _url
                    };
                    //alert(_url);
                    createShortcut(_subject, _extras, _icon_type);
                    navigator.app.exitApp();
                },
                function () {
                    //alert("You have cancelled");
                    navigator.app.exitApp();
                }
        );
    }
};

// --------------------------------
STS_GOOGLE_CHROME = {
    action: "app.open.googlechrome",
    isSendFrom: function (intent) {
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.SUBJECT"]) === "string"
            && typeof (intent.extras["android.intent.extra.TEXT"]) === "string"
            && (intent.extras["android.intent.extra.TEXT"].startsWith("http://") || intent.extras["android.intent.extra.TEXT"].startsWith("https://"))
            && typeof (intent.extras["share_screenshot_as_stream"]) === "string");
    },
    createShortcut: function (intent) {
        var _subject = intent.extras["android.intent.extra.SUBJECT"];
        var _text = intent.extras["android.intent.extra.TEXT"];
        var _url = "googlechrome://navigate?url=" + _text;
        var _extras = {
            "action": this.action,
            "url": _url
        };
        
        getFaviconBase64(_text, function (_base64) {
            //alert(_icon_type);
            createShortcut(_subject, _extras, _base64); 
            navigator.app.exitApp();
        });
    },
    openActivity: function (_intent) {
        var _url = _intent.extras["pgb_share_to_shortcut.pulipuli.info.url"];
        
        //alert(_url);
        if (_url.startsWith("{") === false) {
            window.open(_url, "_system");
            navigator.app.exitApp();
        }
        else {
            var _intent_config = JSON.parse(_url);
            intentStartActivity(_intent_config);
        }
    },
};

// ------------------------------

STS_FLIPERLINK = {
    action: "app.open.flyperlink",
    isSendFrom: function (intent) {
        return typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.SUBJECT"]) === "undefined"
            && typeof (intent.extras["android.intent.extra.TEXT"]) === "string"
            && (intent.extras["android.intent.extra.TEXT"].startsWith("http://") || intent.extras["android.intent.extra.TEXT"].startsWith("https://"));
    },
    createShortcut: function (intent) {
        var _text = intent.extras["android.intent.extra.TEXT"];
        var _this = this;
        getURLtoTitle(_text, function (_subject) {
            
            var _extras = {
                "action": _this.action,
                "url": _text
            };

            getFaviconBase64(_text, function (_base64) {
                createShortcut(_subject, _extras, _base64); 
                navigator.app.exitApp();
            });
        });
    },
    openActivity: STS_GOOGLE_CHROME.openActivity,
};


// ------------------------------

STS_FEEDLY = {
    action: "window.open.feedly",
    isSendFrom: function (intent) {
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.SUBJECT"]) === "undefined"
            && typeof (intent.extras["android.intent.extra.TEXT"]) === "string"
            && intent.extras["android.intent.extra.TEXT"].startsWith("http") === false
            && intent.extras["android.intent.extra.TEXT"].indexOf("http") > 1
            );
    },
    createShortcut: function (intent) {
        var _text = intent.extras["android.intent.extra.TEXT"];
        
        var _pos = _text.lastIndexOf("http://");
        if (_pos === -1) {
            _pos = _text.lastIndexOf("https://");
        }
        
        var _url  = _text.substring(_pos, _text.length).trim();
        var _subject = _text.substring(0, _pos).trim();
        
        //alert(_url);
        var _extras = {
            "action": this.action,
            "url": _url
        };

        getFaviconBase64(_url, function (_base64) {
            createShortcut(_subject, _extras, _base64); 
            navigator.app.exitApp();
        });
    },
    openActivity: STS_GOOGLE_CHROME.openActivity,
};

// ------------------------------

STS_GREADER = {
    action: "window.open.greader",
    isSendFrom: function (intent) {
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.SUBJECT"]) === "string"
            && typeof (intent.extras["android.intent.extra.TEXT"]) === "string"
            && intent.extras["android.intent.extra.TEXT"].startsWith("http") === true
            );
    },
    createShortcut: function (intent) {
        var _subject = intent.extras["android.intent.extra.SUBJECT"];
        var _text = intent.extras["android.intent.extra.TEXT"];
        
        var _extras = {
            "action": this.action,
            "url": _text
        };
        
        getFaviconBase64(_text, function (_base64) {
            //alert(_icon_type);
            createShortcut(_subject, _extras, _base64); 
            navigator.app.exitApp();
        });
    },
    openActivity: STS_GOOGLE_CHROME.openActivity,
};

// -----------------------------

STS_BILIBILI_BANGUMI = {
    action: "app.open.bilibili.bangumi",
    isSendFrom: function (intent) {
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.TEXT"]) === "string"
            && intent.extras["android.intent.extra.TEXT"].startsWith("https://") === false
            && intent.extras["android.intent.extra.TEXT"].indexOf("http://m.bilibili.com/bangumi/play/ss") > -1);
    },
    createShortcut: function (intent) {
        //var _subject = intent.extras["android.intent.extra.SUBJECT"];
        var _text = intent.extras["android.intent.extra.TEXT"];
        var _needle = "http://m.bilibili.com/bangumi/play/ss";
        var _url = _text.substring(_text.indexOf(_needle), _text.length);
        
        getURLtoTitle(_url, function (_subject) {
            _subject = _subject.replace("_番剧_bilibili_哔哩哔哩", "");
            _subject = _subject.replace("_番剧_哔哩哔哩", "");
            
            // 超时空要塞 Frontier：第1话_番剧_bilibili_哔哩哔哩
            //alert(_subject);
            var _pos = _subject.lastIndexOf("：第");
            var _number = _subject.substring(_pos + 2, _subject.length-1).trim();
            var _title = _subject.substring(0, _pos).trim();
            _subject = "[" + _number + "] " + _title;
            
            _text = _text.substring(_text.indexOf(_needle) + _needle.length, _text.length);
            _text = "bilibili://bangumi/season/" + _text + "?url_from_h5=1";
            //alert(_text);
            var _extras = {
                "action": STS_BILIBILI_BANGUMI.action,
                "url": _text
            };

            createShortcut(_subject, _extras, "bilibili"); 
            navigator.app.exitApp();
        });
    },
    openActivity: STS_GOOGLE_CHROME.openActivity,
};

// -----------------------------

STS_BILIBILI_VIDEO = {
    action: "app.open.bilibili.video",
    isSendFrom: function (intent) {
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.TEXT"]) === "string"
            && intent.extras["android.intent.extra.TEXT"].startsWith("https://") === false
            && intent.extras["android.intent.extra.TEXT"].indexOf("http://www.bilibili.com/video/av") > -1);
    },
    createShortcut: function (intent) {
        var _subject = intent.extras["android.intent.extra.SUBJECT"];
        var _text = intent.extras["android.intent.extra.TEXT"];
        var _needle = "http://www.bilibili.com/video/av";
        var _url = _text.substring(_text.indexOf(_needle), _text.length);
        
        // 一部尺度超大的动画！？动画界的大黑马？【鱼的吐槽】_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili
        _subject = _subject.replace("_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili", "");
        //_subject = _subject.replace("_番剧_哔哩哔哩", "");
        
        //_text = _text.substring(_text.indexOf(_needle) + _needle.length, _text.length);
        //_text = "bilibili://bangumi/season/" + _text + "?url_from_h5=1";
        //alert(_text);
        var _extras = {
            "action": this.action,
            "url": _url
        };

        createShortcut(_subject, _extras, "bilibili"); 
        navigator.app.exitApp();
    },
    openActivity: STS_GOOGLE_CHROME.openActivity,
};


// -----------------------------

STS_GOOGLE_MAP = {
    action: "app.open.googlemap",
    needle: "https://goo.gl/maps/",
    isSendFrom: function (intent) {
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.SUBJECT"]) === "string"
            && typeof (intent.extras["android.intent.extra.TEXT"]) === "string"
            && intent.extras["android.intent.extra.TEXT"].startsWith("https://") === false
            && intent.extras["android.intent.extra.TEXT"].indexOf(this.needle) > -1);
    },
    createShortcut: function (intent) {
        var _subject = intent.extras["android.intent.extra.SUBJECT"];
        var _text = intent.extras["android.intent.extra.TEXT"];
        var _url = _text.substring(_text.indexOf(this.needle), _text.length).trim();
        
        var _extras = {
            "action": this.action,
            "url": _url
        };

        createShortcut(_subject, _extras, "googlemap"); 
        navigator.app.exitApp();
    },
    openActivity: STS_GOOGLE_CHROME.openActivity,
};

// ------------------

STS_GOOGLE_PLAY = {
    action: "app.open.googleplay",
    needle: "https://play.google.com/store/apps/details?id=",
    icon_type: "googleplay",
    isSendFrom: function (intent) {
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.SUBJECT"]) === "string"
            && typeof (intent.extras["android.intent.extra.TEXT"]) === "string"
            && intent.extras["android.intent.extra.TEXT"].startsWith("https://") === true
            && intent.extras["android.intent.extra.TEXT"].indexOf(this.needle) > -1);
    },
    createShortcut: function (intent) {
        var _subject = intent.extras["android.intent.extra.SUBJECT"];
        var _head_needle = "立即體驗「";
        if (_subject.startsWith(_head_needle)) {
            _subject = _subject.substring(_head_needle.length, _subject.length);
        }
        var _foot_needle = "」";
        if (_subject.endsWith(_foot_needle)) {
            _subject = _subject.substring(0, _subject.length - _foot_needle.length);
        }
        var _text = intent.extras["android.intent.extra.TEXT"];
        var _url = _text.substring(_text.indexOf(this.needle), _text.length).trim();
        
        var _extras = {
            "action": this.action,
            "url": _url
        };

        createShortcut(_subject, _extras, this.icon_type); 
        navigator.app.exitApp();
    },
    openActivity: STS_GOOGLE_CHROME.openActivity,
};


// ------------------

STS_YOUTUBE = {
    action: "app.open.youtube",
    needle: "https://youtu.be/",
    icon_type: "youtube",
    isSendFrom: function (intent) {
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.SUBJECT"]) === "string"
            && typeof (intent.extras["android.intent.extra.TEXT"]) === "string"
            && intent.extras["android.intent.extra.TEXT"].startsWith(this.needle) === true
            && intent.extras["android.intent.extra.TEXT"].indexOf(this.needle) > -1);
    },
    createShortcut: function (intent) {
        var _subject = intent.extras["android.intent.extra.SUBJECT"];
        var _head_needle = "在 YouTube 上觀看「";
        if (_subject.startsWith(_head_needle)) {
            _subject = _subject.substring(_head_needle.length, _subject.length);
        }
        var _foot_needle = "」";
        if (_subject.endsWith(_foot_needle)) {
            _subject = _subject.substring(0, _subject.length - _foot_needle.length);
        }
        var _text = intent.extras["android.intent.extra.TEXT"];
        var _url = _text.substring(_text.indexOf(this.needle), _text.length).trim();
        
        var _extras = {
            "action": this.action,
            "url": _url
        };

        createShortcut(_subject, _extras, this.icon_type); 
        navigator.app.exitApp();
    },
    openActivity: STS_GOOGLE_CHROME.openActivity,
};


// ------------------

STS_BAHAANI = {
    action: "app.open.bahaani",
    needle: "http://ani.gamer.com.tw/animeVideo.php?sn=",
    icon_type: "bahaani",
    isSendFrom: function (intent) {
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.SUBJECT"]) === "undefined"
            && typeof (intent.extras["android.intent.extra.TEXT"]) === "string"
            && intent.extras["android.intent.extra.TEXT"].startsWith(this.needle) === true
            && intent.extras["android.intent.extra.TEXT"].indexOf(this.needle) > -1);
    },
    createShortcut: function (intent) {
        var _url = intent.extras["android.intent.extra.TEXT"];
        var _this = this;
        //aler(_url);
        getURLtoTitle(_url, function (_subject) {
            // 驚爆危機 Invisible Victory[10] - 巴哈姆特動畫瘋
            var _foot_needle = " - 巴哈姆特動畫瘋";
            if (_subject.endsWith(_foot_needle)) {
                _subject = _subject.substring(0, _subject.length - _foot_needle.length);
            }
            
            // 把編號跟名稱對調
            var _pos = _subject.lastIndexOf("[");
            var _number = _subject.substring(_pos, _subject.length).trim();
            var _title = _subject.substring(0, _pos).trim();
            _subject = _number + " " + _title;

            var _extras = {
                "action": _this.action,
                "url": _url
            };

            createShortcut(_subject, _extras, _this.icon_type); 
            navigator.app.exitApp();
        });
    },
    openActivity: STS_GOOGLE_CHROME.openActivity,
};


// ------------------

STS_PDF = {
    action: "file.open.pdf",
    icon_type: "pdf",
    isSendFrom: function (intent) {
        return (typeof (intent.type) === "string"
            && intent.type === "application/pdf");
    },
    createShortcut: function (intent) {
        var _this = this;
        
        var _data = intent.data;
        
        cordova.plugins.fileOpener2.getFilename(
                _data,
                {
                error : function(e){
                    alert(JSON.stringify(e));
                }, 
                success : function(_subject){ 
                    var _extras = {
                        "action": _this.action,
                        "data": _data
                    };

                    createShortcut(_subject, _extras, _this.icon_type); 
                    navigator.app.exitApp();
                } 
            });
    },
    openActivity: function (_intent) {
        var _data = _intent.extras["pgb_share_to_shortcut.pulipuli.info.data"];
        
        var _open = function (_package) {
            
            cordova.plugins.fileOpener2.open(
                _data, 
                "application/pdf",
                _package,
                {
                    error : function(e){
                        alert(JSON.stringify(e));
                        navigator.app.exitApp();
                    }, 
                    success : function(){ 
                        navigator.app.exitApp();
                    } 
                } 
            );
        };
        
        cordova.plugins.fileOpener2.appIsInstalled("com.xodo.pdf.reader", {
            success : function(res) {
                if (res.status === 0) {
                    _open("");
                } else {
                    _open("com.xodo.pdf.reader");
                }
            }
        });
    },
};

// ---------------------------

STS_APK = {
    action: "file.open.apk",
    needle_head: "https://build.phonegap.com/apps/",
    needle_foot: "/download/android",
    icon_type: "apk",
    isSendFrom: function (intent) {
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.VIEW"
            && typeof (intent.data) === "string"
            && intent.data.startsWith(this.needle_head)
            && intent.data.endsWith(this.needle_foot));
    },
    createShortcut: function (intent) {
        var _this = this;
        var _url = intent.data;
        
        // get title
        // https://build.phonegap.com/apps/3228957/download/android
        // https://build.phonegap.com/apps/3228957/builds
        var _build_url = _url.replace(this.needle_foot, "/builds");
        getURLtoHTML(_build_url, "h1", function (_subject) {
            // Share To Shortcut- Adobe PhoneGap Build
            _subject = _subject.substring(0, _subject.lastIndexOf("<small>")).trim();
            
            var _extras = {
                "action": _this.action,
                "url": _url
            };

            createShortcut(_subject, _extras, _this.icon_type); 
            navigator.app.exitApp();
        });
        
    },
    openActivity: function (_intent) {
        var _url = _intent.extras["pgb_share_to_shortcut.pulipuli.info.url"];
        //
        //_url = "file:///storage/emulated/0/Download/a.apk";
        //alert(_url);
        
        var _open = function (_local_url) {
            cordova.plugins.fileOpener2.open(
                _local_url, 
                "application/vnd.android.package-archive",
                //"com.xodo.pdf.reader",
                {
                    error : function(e){
                        alert(JSON.stringify(e));
                        navigator.app.exitApp();
                    }, 
                    success : function(){ 
                        navigator.app.exitApp();
                    } 
                } 
            );
        };

        var fileTransfer = new FileTransfer();
        var fileURL = "cdvfile://localhost/temporary/tmp.apk";
        var uri = encodeURI(_url);
        
        //$("body").append("<h1>Downloading Please wait</h1>");
        //$("body").addClass("loading");
        SpinnerDialog.show();

        fileTransfer.download(
                uri,
                fileURL,
                function (entry) {
                    var _local_url = entry.toURL();
                    _open(_local_url);
                    //alert("download complete: " + );
                },
                function (error) {
                    alert("download error: " + JSON.stringify(error));
                },
                false
        );
    },
};

// ------------------------------------

STS_QUEUE = [
    STS_PDF,
    STS_APK,
    STS_BILIBILI_BANGUMI,
    STS_BILIBILI_VIDEO,
    STS_GOOGLE_MAP,
    STS_GOOGLE_PLAY,
    STS_YOUTUBE,
    STS_BAHAANI,
    STS_GOOGLE_CHROME,
    STS_FLIPERLINK,
    STS_GREADER,
    STS_FEEDLY,
    CTS_TEST,
];
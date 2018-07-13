CTS_TEST = {
    action: "cts.test",
    isSendFrom: function () {
        return true;
    },
    createShortcut: function () {
        if (DEBUG === false) {
            navigator.app.exitApp();
            return;
        }
        
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
    needle_head: ["https://www.facebook.com/", "https://m.facebook.com/"],
    isClipboardFrom: function (_text) {
        // https://www.facebook.com/100000601780771/posts/2145127208850651/
        // https://www.facebook.com/1654388834/posts/10215594510729894/
        //alert(_text);
        for (var _i = 0; _i < this.needle_head.length; _i++) {
            if (_text.startsWith(this.needle_head[_i])) {
                return true;
            }
        }
        return false;
    },
    createShortcut: function (_text) {
        var _title_url = _text;
        var _www_needle = "https://www.facebook.com/";
        var _m_needle = "https://m.facebook.com/";
        if (_title_url.startsWith(_m_needle)) {
            _title_url = _www_needle +  _title_url.substring(_m_needle.length, _title_url.length);
        }
        // fb://facewebmodal/f?href=https://www.facebook.com/533105913/posts/10155739441090914/ 
        alert(_title_url);
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

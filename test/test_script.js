intent_handler = function (intent) {
    //alert("換了 可以嗎？");
    //alert(JSON.stringify(intent));
    
    if (typeof(intent.extras) === "object" 
            && typeof(intent.extras["pgb_share_to_shortcut.pulipuli.info.action"]) === "string" ) {
        
        $.post("http://pc.pulipuli.info/phonegap-build-projects/PhoneGapBuild-ShareToShortcut/test/post.php?filename=shortcut", {
            data: JSON.stringify(intent, null, "\t")
        });
        
        openActivity(intent);
        return;
    }
    else {
        $.post("http://pc.pulipuli.info/phonegap-build-projects/PhoneGapBuild-ShareToShortcut/test/post.php?filename=send", {
            data: JSON.stringify(intent, null, "\t")
        });
    }
    
    // ---------------------------
    
    if (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.MAIN") {
        // 沒有要檢索的東西，回家吧。
        navigator.app.exitApp();
        return;
    }
    
    // ----------------------------

    for (var _i = 0; _i < STS_QUEUE.length; _i++) {
        var _sts = STS_QUEUE[_i];
        
        if (_sts.isSendFrom(intent) ) {
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
            //window.open(_url_list[i], "_system");
            var _extras = {
                //'android.intent.extra.SUBJECT': 'Hello world!', // Built-in Android extra (string)
                //'MY_BOOLEAN': true, // Custom extras are also supported (boolean, number and string only)
                "action": 'android.intent.action.WEB_SEARCH',
                "extras.query": _url_list[i]
            };
            createShortcut("測試", _extras, "search"); 
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
    window.plugins.Shortcuts.addPinned(_shortcut);
    
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

// --------------------------------

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
        window.open(_url, "_system");
        navigator.app.exitApp();
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
        getURLtoTitle(_text, function (_subject) {
            
            var _extras = {
                "action": this.action,
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
    needle: "http://ani.gamer.com.tw/animeVideo.php?sn=",
    icon_type: "pdf",
    isSendFrom: function (intent) {
        return (typeof (intent.type) === "string"
            && intent.type === "application/pdf");
    },
    createShortcut: function (intent) {
        var _this = this;
        
        var _data = intent.data;
        
        var _subject = "PDF";

        var _extras = {
            "action": _this.action,
            "data": _data
        };

        createShortcut(_subject, _extras, _this.icon_type); 
        navigator.app.exitApp();
    },
    openActivity: function (_intent) {
        var _data = _intent.extras["pgb_share_to_shortcut.pulipuli.info.data"];
        _data = _data.replace("///", "/");
        alert(_data);
        var open = cordova.plugins.disusered.open;
        
        function success() {
            alert('Success');
            
            navigator.app.exitApp();
      }

      function error(code) {
        if (code === 1) {
          alert('No file handler found');
        } else {
          alert('Undefined error: ' + code);
        }
      }
        
        var permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, function( status ){
            if ( status.hasPermission ) {
              alert("Yes :D ");
              open(_data, success, error);
              //alert("ok");
            }
            else {
              alert("No :( ");
            }
          });
        
        
      
      permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, success, error);

        function error() {
          console.warn('Camera permission is not turned on');
        }

        function success( status ) {
          if( !status.hasPermission ) {
              error();
          }
            //alert("OK");
            //open(_data, success, error);
        }
        
        
    },
};

// ------------------------------------

STS_QUEUE = [
    STS_PDF,
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
];
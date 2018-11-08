/**
 * STS = Share to Shartcut
 */
STS_GOOGLE_CHROME = {
    action: "app.open.googlechrome",
    isSendFrom: function (intent) {
      var url = intentExtractURL(intent)
      alert(url)
      if (url.startsWith('https://docs.google.com/forms/d/')) {
        return true
      }
      
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.SUBJECT"]) === "string"
            && typeof (intent.extras["android.intent.extra.TEXT"]) === "string"
            && (intent.extras["android.intent.extra.TEXT"].startsWith("http://") || intent.extras["android.intent.extra.TEXT"].startsWith("https://"))
            && typeof (intent.extras["share_screenshot_as_stream"]) === "string");
    },
    createShortcut: function (intent) {
      var _subject = "WEB";
      if (typeof(intent.extras["android.intent.extra.SUBJECT"]) === 'string') {
        _subject = intent.extras["android.intent.extra.SUBJECT"];
      }
        
        //var _text = intent.extras["android.intent.extra.TEXT"];
        var _text = intentExtractURL(intent)
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

STS_GOOGLE_NEWS = {
    action: "window.open.google_news",
    isSendFrom: function (intent) {
        return (typeof (intent.action) === "string"
            && intent.action === "android.intent.action.SEND"
            && typeof (intent.extras) === "object"
            && typeof (intent.extras["android.intent.extra.SUBJECT"]) === "string"
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
        _subject = removeSpecialCharacters(_subject)
        
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
        
        var _v;
        
        if (_url.startsWith("https://www.youtube.com/")) {
            _v = getAllUrlParams(_url).v;
        }
        else if (_url.startsWith("https://youtu.be/")) {
            _v = _url.substring(_url.lastIndexOf("/")+1, _url.length);
        }
        //var favicon_url = "https://img.youtube.com/vi/" + _v + "/hqdefault.jpg";
        //var favicon_url = "https://process.filestackapi.com/AhTgLagciQByzXpFGRI0Az/resize=width:256,height:256,fit:crop/https://i.ytimg.com/vi/" + _v + "/hqdefault.jpg";
        var favicon_url = "https://i.ytimg.com/vi/" + _v + "/hqdefault.jpg";
        
        //alert(favicon_url)
        
        getURLtoCanvasBase64(favicon_url, function (_icon) {
            createShortcut(_subject, _extras, _icon); 
            navigator.app.exitApp();
        });
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
    getFilename: function (_data, _callback) {
        _data = _data.trim();
        if (_data.startsWith("file:///")) {
            // 取最後一個 /
            var _filename = _data.substring(_data.lastIndexOf("/")+1, _data.length);
            if (typeof(_callback) === "function") {
                _callback(_filename);
            }
        }
        else {
            cordova.plugins.permissions.requestPermission("android.permission.READ_EXTERNAL_STORAGE", function () {
                cordova.plugins.fileOpener2.getFilename(
                    _data,
                    {
                        error : function(e){
                            alert("fileOpener2 error: " + JSON.stringify(e));
                        },
                        success : function(_subject){
                            if (typeof (_callback) === "function") {
                            _callback(_subject);
                        }
                    }
                });
            });
        }
    },
    createShortcut: function (intent) {
        var _this = this;
        //alert(JSON.stringify(intent));
        var _data = intent.data;
        
        _this.getFilename(_data, function(_subject){ 
            var _extras = {
                "action": _this.action,
                "data": _data
            };

            // 如果是來自於Zotero的_subject
            // Choi 與 Lam - 2018 - A hierarchical model for developing e-textbook to .pdf
            //alert([_subject, _subject.split(" - ").length]);
            while (_subject.lastIndexOf(" - ") > -1) {
                var _pos = _subject.lastIndexOf(" - ");
                _subject = _subject.substring(_pos+3, _subject.length).trim();
            }
            //alert(JSON.stringify(_extras));

            createShortcut(_subject, _extras, _this.icon_type); 
            navigator.app.exitApp();
        });
    },
    openActivity: function (_intent) {
        var _data = _intent.extras["pgb_share_to_shortcut.pulipuli.info.data"];
        //alert(_data);
        
        var _open = function (_package) {
            cordova.plugins.permissions.requestPermission("android.permission.READ_EXTERNAL_STORAGE", function () {
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
            }, function () {
                alert("error");
            });
            
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
            cordova.plugins.permissions.requestPermission("android.permission.READ_EXTERNAL_STORAGE", function () {
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
            });
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

STS_URL = {
    action: "window.open.url",
    extractURL: function (intent) {
      return intentExtractURL(intent)
    },
    isSendFrom: function (intent) {
        //  只要extras裡面包含了url都算
        var _url = this.extractURL(intent);
        alert(_url);
        return (_url !== undefined);
    },
    createShortcut: function (intent) {
        var _url = this.extractURL(intent);
        var _this = this;
        getURLtoTitle(_url, function (_subject) {
            
            var _extras = {
                "action": _this.action,
                "url": _url
            };

            getFaviconBase64(_url, function (_base64) {
                createShortcut(_subject, _extras, _base64); 
                navigator.app.exitApp();
            });
        });
    },
    openActivity: STS_GOOGLE_CHROME.openActivity,
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
    STS_GOOGLE_NEWS,
    STS_FEEDLY,
    STS_URL,
    CTS_TEST,
];

//alert("sts: " + typeof(STS_QUEUE));
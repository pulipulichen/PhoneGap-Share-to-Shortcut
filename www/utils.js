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

getAllUrlParams = function (url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            //paramName = paramName.toLowerCase();
            //paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
};

removeSpecialCharacters = function (str) {
  str = str.split(":").join("-")
  str = str.split("/").join("-")
  str = str.split("|").join("-")
  str = str.split("ღ").join("")
  // ღ Kawaii Radio | Happy Music to Study/Relax「24/7」| Kawaii Music LiveStream ☆*:o( ≧o≦ )o:*☆ - YouTube
  str = str.split("✿").join("")
  str = str.split("◕").join("")
  str = str.split("➨").join("")
  str = str.split("♥").join("")
  str = str.split("♫").join("")
  str = str.split("△").join("")
  return str
};

intentExtractURL = function (intent) {
        if (typeof(intent.extras) === "object") {
            var _needles =  ["http://", "https://"];
            var _needles_foot =  [" ", "\n"];
            for (var _key in intent.extras) {
                var _value = intent.extras[_key];
                
                for (var _i = 0; _i < _needles.length; _i++) {
                    var _needle = _needles[_i];
                    if (_value.indexOf(_needle) > -1) {
                        var _url = _value.substring(_value.indexOf(_needle), _value.length);
                        for (var _j = 0; _j < _needles_foot.length; _j++) {
                            var _needle_foot = _needles_foot[_j];
                            if (_url.indexOf(_needle_foot) > -1) {
                                _url = _url.substr(0, _url.indexOf(_needle_foot));
                            }
                        }
                        
                        _url = _url.trim();
                        return _url;
                    }
                }
            }
        }
    }
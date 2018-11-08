/**
 * A class for finding a website’s favicon URL, if any. Requires a context, like
 * a browser extension, that allows cross-origin requests.
 * <br />
 * <br />
 * Copyright 2012, 2013 Disconnect, Inc.
 * <br />
 * <br />
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at <a
 * href="https://mozilla.org/MPL/2.0/">https://mozilla.org/MPL/2.0/</a>.
 * <br />
 * @constructor
 * @param {string} [alt] A default favicon URL, absolute or relative.
 * @author <a href="https://github.com/byoogle">Brian Kennish</a>
 */
function Favicon(alt) {
  /**
   * Fetches the default favicon URL.
   * @return {string} An absolute or relative URL.
   */
  this.getAlt = function() { return alt; };

  /**
   * Mungs the default favicon URL.
   * @param  {string}  alt An absolute or relative URL.
   * @return {Favicon}     The favicon object.
   */
  this.setAlt = function(newAlt) {
    alt = newAlt;
    return this;
  };

  /**
   * Finds a favicon URL.
   * @param  {string}           url      A website’s absolute URL or hostname.
   * @param  {function(string)} callback A continuation, to execute when the
   *                                     method completes, that takes a favicon
   *                                     URL.
   * @return {Favicon}                   The favicon object.
   */
  this.get = function(url, callback) {
    var favicon = this.getAlt();
    if (typeof favicon != undeclared) callback(favicon);

    var id = setInterval(function() {
      if (typeof jQuery != undeclared) {
        clearInterval(id);

        if (url.indexOf('/') + 1) {
          anchor.href = url;
          url = anchor.hostname;
        }

        var domain = url.slice(url.indexOf('.') + 1);
        var successful;

        for (var i = 0; i < protocolCount; i++) {
          for (var j = -1; j < subdomainCount; j++) {
            for (var k = 0; k < pathCount; k++) {
              favicon =
                  protocols[i] + (j + 1 ? subdomains[j] + domain : url) +
                      paths[k];

              jQuery.get(favicon, function(data, status, xhr) {
                var type = xhr.getResponseHeader('Content-Type');

                if (!successful && type && type.indexOf('image/') + 1 && data) {
                  successful = true;
                  callback(favicon);
                }
              }).bind(favicon);
            }
          }
        }
      }
    }, 100);

    return this;
  };

  var version = '1.3.0';
  var protocols = ['http://'];
  var subdomains = ['', 'www.'];
  var paths = ['/favicon.ico'];
  var protocolCount = protocols.length;
  var subdomainCount = subdomains.length;
  var pathCount = paths.length;
  var anchor = document.createElement('a');
  var undeclared = 'undefined';

  if (typeof jQuery == undeclared) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'vendor/jquery.js');
    script.onload = function() { jQuery.noConflict(); };
    document.head.appendChild(script);
  }

  return this;
}

getFavicon = function (_url, _callback) {
    var favicon = new Favicon;

    var _load = false;
    var _exception_timer = setTimeout(function () {
        if (_load === true) {
            return;
        }
        
        _load = true;
        _callback(null);        
    }, 3000);
    
    favicon.get(_url, function (_favicon_url) {
        if (_load === true) {
            return;
        }
        
        clearTimeout(_exception_timer);
        _load = true;
        _callback(_favicon_url);
    });
};

getURLtoBase64 = function (url, callback) {
    if (url === null) {
        callback("search");
        return;
    }
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result.replace(/^data:image\/(png|jpg|jpeg|x-icon);base64,/, ""));
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
};

getURLtoCanvasBase64 = function (url, callback) { 
      var canvasWidth = 256
      var canvasHeight = 256
      $('<canvas id="canvas" width="' + canvasWidth + '" height="' + canvasHeight + '" style="display: none"></canvas>')
              .appendTo('body')
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      
      var img = new Image();   // Create new img element
      //img.setAttribute('crossOrigin', 'anonymous');
      img.addEventListener("load", function() {
        var imgWidth = img.width
        var imgHeight = img.height
        //console.log([imgWidth, imgHeight])
        var scale = (canvasWidth / imgWidth)
        if (imgWidth < imgHeight) {
          scale = (canvasHeight / imgHeight)
        }
        var ctxWidth = imgWidth * scale
        var ctxHeight = imgHeight * scale
        var ctxTop = (canvasHeight - ctxHeight) / 2
        var ctxLeft = (canvasWidth - ctxWidth) / 2
        //console.log([ctxTop, ctxLeft, ctxWidth, ctxHeight])
        ctx.drawImage(img,ctxLeft,ctxTop, ctxWidth, ctxHeight);
        
        var canvas = document.getElementById("canvas");
        var dataURL = canvas.toDataURL('image/png');
        if (dataURL.indexOf('base64,')) {
          dataURL = dataURL.slice(dataURL.indexOf('base64,')+7)
        }
        //console.log(dataURL);
        //$('<textarea></textarea>').val(dataURL).appendTo('body')
        if (typeof(callback) === 'function') {
          callback(dataURL)
        }
      }, false);
      
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = url; // Set source path
      alert(url)
}

getFaviconBase64 = function (url, callback) {
    if (url.startsWith("https://www.youtube.com/")) {
        var _v = getAllUrlParams(url).v;
        var favicon_url = "https://process.filestackapi.com/AhTgLagciQByzXpFGRI0Az/resize=width:256,height:256,fit:crop/https://i.ytimg.com/vi/" + _v + "/hqdefault.jpg";
        getURLtoBase64(favicon_url, callback);
        return;
    }
    else if (url.startsWith("https://youtu.be/")) {
        var _v = url.substring(url.lastIndexOf("/")+1, url.length);
        var favicon_url = "https://process.filestackapi.com/AhTgLagciQByzXpFGRI0Az/resize=width:256,height:256,fit:crop/https://i.ytimg.com/vi/" + _v + "/hqdefault.jpg";
        getURLtoBase64(favicon_url, callback);
        return;
    }
    else if (url.startsWith("https://play.google.com/store/apps/details?id=")) {
        callback("googleplay");
        return;
    }
    else if (url.startsWith("https://goo.gl/maps/")) {
        callback("googlemap");
        return;
    }
    else if (url.startsWith("https://google.com/maps/")) {
        callback("googlemap");
        return;
    }
    else if (url.startsWith("https://www.facebook.com/")) {
        callback("facebook");
        return;
    }
    else if (url.startsWith("https://docs.google.com/forms/")) {
        callback("google_form");
        return;
    }
    else if (url.startsWith("https://docs.google.com/document/")) {
        callback("google_doc");
        return;
    }
    else if (url.startsWith("https://docs.google.com/spreadsheets/")) {
        callback("google_sheet");
        return;
    }
    else if (url.startsWith("https://docs.google.com/presentation/")) {
        callback("google_presentation");
        return;
    }
    else if (url.startsWith("https://drive.google.com/file/")) {
        callback("google_drive");
        return;
    }
    
    getFavicon(url, function (favicon_url) {
        getURLtoBase64(favicon_url, callback);
    });
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
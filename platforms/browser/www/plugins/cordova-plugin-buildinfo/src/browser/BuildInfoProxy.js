cordova.define("cordova-plugin-buildinfo.BuildInfoProxy", function(require, exports, module) { /*
The MIT License (MIT)

Copyright (c) 2019 Mikihiro Hayashi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

BuildInfoProxy = {
    _cache: null,

    init: function (successCallback, errorCallback, args) {
        var self = BuildInfoProxy;

        if (null !== self._cache) {
            successCallback(self._cache);
            return;
        }

        try {
            /* <EMBED_CODE> */
            const json = {"debug":true,"buildDate":"2020-12-18T18:16:28.355Z","packageName":"es.uc3m.ubicomp.kahoot","basePackageName":"es.uc3m.ubicomp.kahoot","name":"Kahoot","displayName":"Kahoot","version":"1.0.0","versionCode":"1.0.0"};
            /* </EMBED_CODE> */

            var ret = {
                packageName    : json.packageName     || null,
                basePackageName: json.basePackageName || null,
                displayName    : json.displayName     || json.name || null,
                name           : json.name            || null,
                version        : json.version         || null,
                versionCode    : json.versionCode     || null,
                debug          : json.debug           || false,
                buildDate      : json.buildDate       || null
            };

            self._cache = ret;
            successCallback(ret);
        } catch (e) {
            errorCallback(e.message);
        }
    }
};

cordova.commandProxy.add("BuildInfo", BuildInfoProxy);
});

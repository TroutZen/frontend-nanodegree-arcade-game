(function() {
    var resourceCache = {};
    var loading = [];

    // Stores callbacks to execute after done loading and isReady = true
    var readyCallbacks = []; // [note: Because of closure (returned functions retain access to their scope state when function was defined)]

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    // core method used to load images onto resourceCache {url1: {}, url2 {}}
    function _load(url) {

        // if the resource exists in the cache, return the image object at that url
        if(resourceCache[url]) {
            return resourceCache[url];
        }

        // otherwise, create a new image object, add an onload event handler, so that when the image is ready, it gets
        // added to the resource cache

        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;

                // when a new image object is added to the resourceCache, iterate over the ready callbacks array
                // and execute each function in the array. I think these functions will be our handlers for the images
                if(isReady()) {
                    
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            //[note]: this gets assigned to false initially, so that when we are checking to see if the Cache isReady(), if one img hasn't been loaded (value === false), then isReady() = false and the load callbacks won't work!
            resourceCache[url] = false;
            
            //[uncertain]: and we can set img.src after we define that on the img.onload event to assign the img to the resourceCache obj b/c we will assume that this is executed before the onload event occurs?
            img.src = url; 
        }
    }

    // return the image object using the url from the resourceCache
    function get(url) {
        return resourceCache[url];
    }

    function printResourceCache () {
        return resourceCache;
    }

    // if the resourceCache has the url, but it doesn't contain the image object return false; otherwise, return true
    function isReady() {
        var ready = true;
        for (var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) // isn't this redundant? 
                && !resourceCache[k]) {
                ready = false;
                
                // [reasoning]: added b/c as soon as we have one instance of false within resourceCache, then the Cache is not ready - memory saver
                break;
            }
        }
        return ready;
    }


    // onReady(func) will add a new function to the readyCallbacks array, to be executed when a new image is loaded into the cache

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady,
        printResourceCache: printResourceCache,
        playerChoice: ""
    };
})();

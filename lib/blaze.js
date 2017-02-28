var blaze = blaze || {};

blaze.createNS = function (namespace) {
    var nsparts = namespace.split("."),
        parent = blaze,
        partname,
        i;

    // we want to be able to include or exclude the root namespace so we strip
    // it if it's in the namespace
    if (nsparts[0] === "blaze") {
        nsparts = nsparts.slice(1);
    }

    // loop through the parts and create a nested namespace if necessary
    for (i = 0; i < nsparts.length; i++) {
        partname = nsparts[i];
        // check if the current parent already has the namespace declared
        // if it isn't, then create it
        if (typeof parent[partname] === "undefined") {
            parent[partname] = {};
        }
        // get a reference to the deepest element in the hierarchy so far
        parent = parent[partname];
    }
    // the parent is now constructed with empty namespaces and can be used.
    // we return the outermost namespace
    return parent;
};

blaze.createNS("blaze.components");

blaze.components.classes = [];

blaze.components.init = function (body) {
    var i,
        componentName,
        component;

    this.componentsel = '[data-component]';
    this.reference = body.dataset.blazeRef;

    var matches = document.querySelectorAll(this.componentsel);
    for (i = 0; i < matches.length; i++) {
        componentName = matches[i].dataset.component;
        component = new blaze.components[componentName](matches[i]);
        blaze.components.classes.push(component);
    }
};

blaze.components.getWpApiData = function (url) {
    return new Promise(function(resolve, reject) {
        var response,
            xhr = new XMLHttpRequest(),
            noCache;

        noCache = (url.indexOf('?') >= 0)? '&': '?';
        noCache += new Date().getTime();
        
        xhr.onload = function (e) {
            if (xhr.status == 200) {
                if (e.target.responseType === 'json') {
                    response = e.target.response;
                } else {
                    response = JSON.parse(e.target.responseText);
                }
                resolve(response);
            }
            else {
                // Reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function () {
            reject(Error('Network error'));
        };

        xhr.open('GET', url + noCache, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.responseType = 'json';
        xhr.send(null);
    });
};

blaze.components.loadTemplate = function (url) {
    return new Promise(function(resolve, reject) {
        var response,
            xhr = new XMLHttpRequest(),
            noCache = '?' + new Date().getTime();
        xhr.onload = function (e) {
            if (xhr.status == 200) {
                response = e.target.responseText;
                resolve(response);
            }
            else {
                // Reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(xhr.statusText));
            }
        };
        xhr.onerror = function () {
            reject(Error('Network error'));
        };

        xhr.open('GET', url + noCache, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(null);
    });
};

blaze.components.renderComplete = function () {
    var target = document.querySelector('body'),
        event = new CustomEvent("BlazeRenderComplete");

    target.dispatchEvent(event);
};
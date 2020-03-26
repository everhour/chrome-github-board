DomObserver = function(options) {
    if (options.debounce > 0) {
        this.callback = _.debounce(options.callback, options.debounce, false);
    } else {
        this.callback = options.callback;
    }

    this.selector = options.selector;
    this.removeSelector = options.removeSelector || null;
};

DomObserver.prototype = {
    start: function(extra) {

        if (this.observer) {
            console.error(this.title + "Observer is already started");
            return;
        }

        var selector = this.selector, callback = this.callback, removeSelector = this.removeSelector;
        this.observer = new MutationObserver(function(mutations) {
            var i, j, mutation, node;
            var mutationsLength = mutations.length;
            for (i = 0; i < mutationsLength; i++) {
                mutation = mutations[i];

                for (j = 0; j < mutation.addedNodes.length; j++) {
                    node = mutation.addedNodes[j];

                    if (node.nodeType === 3) {
                        node = node.parentElement;
                    }

                    if (!node || !node.querySelector) {
                        continue;
                    }

                    if (node.querySelector(selector)) {
                        callback(node);
                    }
                }

                for (j = 0; j < mutation.removedNodes.length; j++) {
                    node = mutation.removedNodes[j];

                    if (!node.querySelector) {
                        continue;
                    }

                    if (node.querySelector(selector)) {
                        callback(node);
                        continue;
                    }

                    if (removeSelector && node.querySelector(removeSelector)) {
                        callback(node);
                        continue;
                    }
                }
            }
        });

        this.observer.observe(document, Object.assign({
            childList: true,
            attributes: false,
            subtree: true
        }, extra || {}));
    }
};

window.observeChanges = function(selector, callback) {
    (new DomObserver({selector, callback})).start();
    callback();
};
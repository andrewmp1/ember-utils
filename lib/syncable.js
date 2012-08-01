//  This is a port of Backbone's sync api
//
//
//
//
//
//
//
//
//
Ember.SyncableMixin = Ember.Mixin.create({
    urlRoot: null,
    paramRoot: null,
    methodMap: {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read': 'GET'
    },

    fetch: function(options) {
//        var collection, success;
//        options = (options ? _.clone(options) : {});
//        if (options.parse === void 0) {
//            options.parse = true;
//        }
//        collection = this;
//        success = options.success;
//        options.success = function(resp, status, xhr) {
//            collection[(options.add ? "add" : "reset")](collection.parse(resp, xhr), options);
//            if (success) {
//                success(collection, resp, options);
//            }
//            return collection.trigger("sync", collection, resp, options);
//        };
//        options.error = Backbone.wrapError(options.error, collection, options);
//        return this.sync("read", this, options);
    },

    save: function(key, value, options) {
        var attrs, current, done, model, silentOptions, success, xhr;
//        attrs = void 0;
//        current = void 0;
//        done = void 0;
//        if (_.isObject(key) || !(key != null)) {
//            attrs = key;
//            options = value;
//        } else {
//            attrs = {};
//            attrs[key] = value;
//        }
//        options = (options ? _.clone(options) : {});
//        if (options.wait) {
//            if (!this._validate(attrs, options)) {
//                return false;
//            }
//            current = _.clone(this.attributes);
//        }
//        silentOptions = _.extend({}, options, {
//            silent: true
//        });
//        if (attrs && !this.set(attrs, (options.wait ? silentOptions : options))) {
//            return false;
//        }
//        if (!attrs && !this.isValid()) {
//            return false;
//        }
//        model = this;
//        success = options.success;
//        options.success = function(resp, status, xhr) {
//            var serverAttrs;
//            done = true;
//            serverAttrs = model.parse(resp, xhr);
//            if (options.wait) {
//                serverAttrs = _.extend(attrs || {}, serverAttrs);
//            }
//            if (!model.set(serverAttrs, options)) {
//                return false;
//            }
//            if (success) {
//                success(model, resp, options);
//            }
//            return model.trigger("sync", model, resp, options);
//        };
//        options.error = Backbone.wrapError(options.error, model, options);
//        xhr = this.sync((this.isNew() ? "create" : "update"), this, options);
//        if (!done && options.wait) {
//            this.clear(silentOptions);
//            this.set(current, silentOptions);
//        }
//        return xhr;
    },

    destroy: function(options) {
//        var destroy, model, success, xhr;
//        options = (options ? _.clone(options) : {});
//        model = this;
//        success = options.success;
//        destroy = function() {
//            return model.trigger("destroy", model, model.collection, options);
//        };
//        options.success = function(resp) {
//            if (options.wait || model.isNew()) {
//                destroy();
//            }
//            if (success) {
//                success(model, resp, options);
//            }
//            if (!model.isNew()) {
//                return model.trigger("sync", model, resp, options);
//            }
//        };
//        if (this.isNew()) {
//            options.success();
//            return false;
//        }
//        options.error = Backbone.wrapError(options.error, model, options);
//        xhr = this.sync("delete", this, options);
//        if (!options.wait) {
//            destroy();
//        }
//        return xhr;
    },

    // Override in model for custom parsing
    parse: function(response, xhr) {
//        return response;
    },

    // Meat of the api
    sync: function(method, model, options) {
//        var complete, data, params, type;
//        type = _methodMap[method];
//        params = _.extend({
//            type: type,
//            dataType: "json",
//            beforeSend: function(xhr) {
//                var token;
//                token = $("meta[name=\"csrf-token\"]").attr("content");
//                if (token) {
//                    xhr.setRequestHeader("X-CSRF-Token", token);
//                }
//                return model.trigger("sync:start");
//            }
//        }, options);
//        if (!params.url) {
//            params.url = getUrl(model) || urlError();
//        }
//        if (!params.data && model && (method === "create" || method === "update")) {
//            params.contentType = "application/json";
//            data = {};
//            if (model.paramRoot) {
//                data[model.paramRoot] = model.toJSON();
//            } else {
//                data = model.toJSON();
//            }
//            params.data = JSON.stringify(data);
//        }
//        if (params.type !== "GET") {
//            params.processData = false;
//        }
//        complete = options.complete;
//        params.complete = function(jqXHR, textStatus) {
//            model.trigger("sync:end");
//            if (complete) {
//                return complete(jqXHR, textStatus);
//            }
//        };
//        return $.ajax(params);
    }
});
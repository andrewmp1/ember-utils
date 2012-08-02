// This is a port of Backbone's sync api
// Override the sync function to change the manner in which models are syncd to the server. 
// You will be passed the type of request, and the model in question. 
// By default, makes a RESTful Ajax requestto the model's `url()`.
Ember.SyncableMixin = Ember.Mixin.create({
    id: null,
    urlRoot: null,
    paramRoot: null,
    methodMap: {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read': 'GET'
    },

    // Nice little utility function copied over from _underscore
    _extend: function(obj) {
      args = Array.prototype.slice.call(arguments, 1);
      args.forEach(function(source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      });
      return obj;
    },

    // Another nice little utility to return a list of all the property names on an Ember object
    propertyNames: function () {
        var key, ret, v;
        v = void 0;
        ret = [];
        for (key in this) {
            if (this.hasOwnProperty(key)) {
                v = this[key];
                if (v === "toString") {
                    continue;
                }
                if (Ember.typeOf(v) === "function") {
                    continue;
                }
                ret.push(key);
            }
        }
        return ret
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = this.get('urlRoot') || "";
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.get('id');
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, xhr) {
      return resp;
    },

    fetch: function(options) {
       var model, success;
       options = (options ? Ember.copy(options) : {});
       if (options.parse === void 0) {
           options.parse = true;
       }
       model = this;
       success = options.success;
       options.success = function(resp, status, xhr) {
         model.setProperties(model.parse(resp, xhr))
       };
       return this.sync("read", this, options);
    },

    save: function(key, value, options) {
       options = (options ? Ember.copy(options) : {});
       if (options.parse === void 0) {
           options.parse = true;
       }

      // // After a successful server-side save, the client is (optionally)
      // // updated with the server-side state.
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        var serverAttrs = model.parse(resp, xhr);
        if (success) {
          success(model, resp);
        }
      }
    },

    destroy: function(options) {
      options = (options ? Ember.copy(options) : {});
      var model = this;
      var success = options.success;

      // if (this.isNew()) {
      //   triggerDestroy();
      //   return false;
      // }

      options.success = function(resp) {
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      // options.error = Backbone.wrapError(options.error, model, options);
      var xhr = this.sync('delete', this, options);
      // if (!options.wait) triggerDestroy();
      return xhr;
    },

    // Meat of the api
    sync: function(method, model, options) {
        var type = this.methodMap[method];

        // Default options, unless specified.
        options || (options = {});

        // Default JSON-request options.
        var params = {type: type, dataType: 'json'};

        // Ensure that we have a URL.
        if (!options.url) {
          params.url = model.url()
        }

        // Ensure that we have the appropriate request data.
        if (!options.data && model && (method == 'create' || method == 'update')) {
          params.contentType = 'application/json';
          params.data = model.getProperties(model.propertyNames());
        }

        // Don't process data on a non-GET request.
        if (params.type !== 'GET') {
          params.processData = false;
        }

        // Make the request, allowing the user to override any Ajax options.
        return $.ajax(model._extend(params, options));
    }
});
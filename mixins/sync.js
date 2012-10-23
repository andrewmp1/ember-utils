 /*
   Ember-data light. (A blatant ripoff and copy and paste job from ember-data)
   This is s simple way to have ember-data like api as an object mixin.
   If you need things like transactions, multiple stores, and relationship handling use ember-data.
   After you add this mixin you need to call the method addSyncClassMethods to reopen the class and add methods.
   App.Object.create().addSyncClassMethods().  I'm sure there is a better way to do this I'm just not sure yet.
   API:
   App.Object.find()
      params: id
      id can be a string, object , or null
      if its a string it will go to the server and look for that object and return and instance.
      if its an object it will try and query the api for results and returns an array.
      if its empty it will try and query the api for results and return an array.
   object = App.Object.create();
   object.get('created');  // true/false depending on whether the object has an id.
   object.save() // Sends a post request to the api to save the object if it doesn't have an id, if it does
   it sends a put request to update it.
   object.destroy() // Sends a delete request to the api.
 */
Ember.Sync = Ember.Mixin.create({
  created: function(){
    return (this.get('id') !== null);
  }.property(),

  save: function(){
    // Could be create or update
    if (this.get('created')) {
      this.constructor._update(this);
    } else {
      this.constructor._create(this);
    }
    
  },

  destroy: function(){
    this.constructor.destroy(this, data);
  },

  getJSON: function () {
    return this.getProperties(this.propertyNames());
  },

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
        return ret;
  },

  addSyncClassMethods: function() {
    this.constructor.reopenClass({
      _url: "",
      _results: null,
      _plurals: {},

      find: function (id) {
        // Just grab all records
        if (id === undefined) {
          return this.findAll();
        }

        // We are passed a query instead of an id.
        if (Ember.typeOf(id) === 'object') {
          return this.findQuery(id);
        }

        // Else looks like we just want to find a record w/ id.
        var results = this._results;
        results = this.create();
        this.ajax(this._buildURL(this._root(), id), "GET", {
          context: this,
          success: function(json) {
            this._loadValue(this, json[this._root()], results);
          }
        });
        return results;
      },

      findAll: function() {
        var root = this._root();
        var _results = this._results;
        results = Ember.A([]);
        this.ajax(this._buildURL(root), "GET", {
          success: function(json) {
            this._loadValue(this, json[this._rootPlural()], results);
          }
        });
        return results;
      },

      findQuery: function(query) {
        var root = this._root();
        var results = this._results;
        results = Ember.A([]);
        this.ajax(this._buildURL(root), "GET", {
          data: query,
          success: function(json) {
            this._loadValue(this, json[this._rootPlural()], results);
          }
        });
        return results;
      },

      ajax: function(url, type, hash) {
        // 
        hash.contentType = 'application/json; charset=utf-8';
        if (type === 'GET' || type === 'HEAD' || type === 'OPTIONS' || type === 'DELETE') {
            hash.contentType = 'application/x-www-form-urlencoded';
        }
        hash.url = url;
        hash.type = type;
        hash.dataType = 'json';
        hash.context = this;
        //hash.xhrFields = { withCredentials: true };  Uncomment for CORS
        if (hash.data && type !== 'GET') {
          hash.data = JSON.stringify(hash.data);
        }
        console.log("sending request type: " + hash.type +" with content: " + hash.contentType + " for url:  " + hash.url);
        jQuery.ajax(hash);
      },

      // Private methods

      // define a plurals hash in your subclass to define
      // special-case pluralization
      _pluralize: function(name) {
        return this._plurals[name] || name + "s";
      },

      _rootPlural: function() {
        return this._pluralize(this._root());
      },

      _root: function() {
        var parts = this.toString().split(".");
        var name = parts[parts.length - 1];
        return name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1);
      },

      _rootForType: function(type) {
        if (type._url) { return type._url; }

        // use the last part of the name as the URL
        this.root();
      },

      _buildURL: function(record, suffix) {
        var url = [this._url];

        if (this._namespace !== undefined) {
          url.push(this._namespace);
        }

        if (this._endpoint !== undefined) {
          url.push(this._endpoint);
        } else {
          url.push(this._pluralize(record)); 
        }
        
        if (suffix !== undefined) {
          url.push(suffix);
        }

        return url.join("/");
      },

      _create: function(record) {
        var data = {};
        data[this._root()] = record.getJSON();
        this.ajax(this._buildURL(this._root()), "POST", {
          context: this,
          data: data,
          success: function(json) {
            record.setProperties(json[this._root()]);
          }
        });

      },

      _update: function(record) {
        var data = {};
        data[this._root()] = record.getJSON();
        this.ajax(this._buildURL(this._root(), record.get('id')), "PUT", {
          context: this,
          data: data,
          success: function(json) {
            record.setProperties(json[this._root()]);
          }
        });
      },

      _loadValue: function(type, value, records) {
        if (value instanceof Array) {
          this._loadMany(type, value, records);
        } else {
          this._load(value, records);
        }
      },

      _loadMany: function(type, value, records) {
        value.forEach(function(item) {
            records.push(type.create(item));
        });
      },

      _load: function(value, record) {
        record.setProperties(value);
      }

    });
  }
});
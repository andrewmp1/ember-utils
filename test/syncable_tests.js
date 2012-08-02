module("Ember.SyncableMixin", {
  setup: function (){
    App.Syncer = Ember.Object.extend(Ember.SyncableMixin, {
      id: null,
      attr1: null,
      attr2: null
    });
    syncObject = App.Syncer.create({id:"1"});
  },
  teardown: function (){
    var syncObject = null;
  }
});

test('Mixin adds paramRoot & urlRoot to Ember object', function (){
  notEqual(typeof syncObject.get('paramRoot'), 'undefined', "paramRoot exists and is not undefined");
  notEqual(typeof syncObject.get('urlRoot'), 'undefined', "urlRoot exists and is not undefined");
});

test('can combine two objects properties via _extend', function () {
  var options = {some: "thing"};
  var middle = {toes: "scrunchy"};
  var params = {another: "one"};

  deepEqual(syncObject._extend(options, middle, params), {"some":"thing", "toes":"scrunchy", "another":"one"}, "combines objects properties into one hash of properties");
});

asyncTest('sync', 1, function() {
  $.mockjax({
    url: "/amazing/1",
    responseTime: 0,
    contentType: 'text/json',
    responseText: {
      'id':'1',
      'attr1':'yes',
      'attr2':'awesome'
    }
  });
  syncObject.set('urlRoot', '/amazing');
  options = {};
  options.parse = true;
  success = options.success;
  options.success = function(resp, status, xhr) {
     equal(status, 'success', "response of get request is success");
  };
  syncObject.sync('read', syncObject, options);
  setTimeout(start, 500);

});

asyncTest('fetch', 1, function() {
  $.mockjax({
    url: "/amazing/1",
    responseTime: 0,
    contentType: 'text/json',
    responseText: {
      'id':'1',
      'attr1':'yes',
      'attr2':'awesome'
    }
  });
  syncObject.set('urlRoot', "/amazing");
  syncObject.fetch();
  setTimeout(function() {
    start();
    Ember.run.sync();
    equal(syncObject.get('attr1'), 'yes', 'sets attributes returned from ajax call to model');
  }, 500);
});


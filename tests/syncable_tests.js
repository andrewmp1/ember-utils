App.Syncer = Ember.Object.extend(Ember.SyncableMixin, {
    testAttr1: null,
    testAttr2: null
});
App.syncer = App.Syncer.create();

test('Mixin adds paramRoot & urlRoot to Ember object', function (){
   ok(App.syncer.get('paramRoot'), "paramRoot exists and is not undefined");
   ok(App.syncer.get('urlRoot'), "urlRoot exists and is not undefined");
});
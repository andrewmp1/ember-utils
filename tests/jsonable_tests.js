App = Ember.Application.create();
App.test = Ember.Object.create(Ember.JsonableMixin, {
    testAttr1: "yes",
    testAttr2: "no"
});

test('returns a hash of attributes of an ember object', function() {
    jsonObject = App.test.getJson();
    equal(jsonObject.testAttr1, "yes", "hash object includes attributes")
});
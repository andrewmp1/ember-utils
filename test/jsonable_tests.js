App = Ember.Application.create();
var testObject = Ember.Object.create(Ember.JsonableMixin, {
    testAttr1: "yes",
    testAttr2: "no",
    funky: function(){
      return "this is a function";
    }.property
});

test('returns a hash of attributes of an ember object', function() {
    jsonObject = testObject.getJson();
    equal(jsonObject.testAttr1, "yes", "hash object includes attributes")
});
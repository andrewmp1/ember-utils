var App = window.App;
App = (App) ? App : Ember.Application.create();

App.Book = Ember.Object.extend(Ember.SyncMixin, {
  id: null,
  attr1: null,
  attr2: null
});
Ember.SyncClassMixin.apply(App.Book);

test('Mixin adds instance methods', function (){
  var book = App.Book.create();
  equal(book.get('created'), false);
  ok(book.getJSON());
});

test('Mixin adds class methods', function() {
  var book = App.Book.create();
  equal(App.Book._root(), "book");
  equal(App.Book._rootPlural(), "books");
});

asyncTest('save object via post', 1, function() {
  $.mockjax({
    url: "/books",
    type: "POST",
    responseTime: 0,
    contentType: 'text/json',
    responseText: {
      'book':{
        'id':'3',
        'attr1':'some',
        'attr2':'times' 
      }
    }
  });
  var book2 = App.Book.create({attr1: "some", attr2:"times"});
  book2.save();
  setTimeout(function(){
    equal(book2.get('id'), "3");
    start();
  }, 50);
});


asyncTest('save object via put', 1, function() {
  $.mockjax({
    url: "/books/4",
    type: "PUT",
    responseTime: 0,
    contentType: 'text/json',
    responseText: {
      'book':{
        'id':'4',
        'attr1':'always',
        'dateUpdated':'today' 
      }
    }
  });
  var book3 = App.Book.create({id: "4", attr1: "always"});
  book3.save();
  setTimeout(function(){
    equal(book3.get('dateUpdated'), "today");
    start();
  }, 50);
});

asyncTest('Find by id: find("id")', 1, function() {
  $.mockjax({
    url: "/books/1",
    responseTime: 0,
    contentType: 'text/json',
    responseText: {
      'book':{
        'id':'1',
        'attr1':'yes',
        'attr2':'awesome' 
      }
    }
  });
  var book1 = App.Book.find("1");
  setTimeout(function(){
    equal(book1.get('id'), "1");
    start();
  }, 50);
});

asyncTest('Find All: find()', 1, function() {
  $.mockjax({
    url: "/books",
    responseTime: 0,
    contentType: 'text/json',
    responseText: {
      'books': [
        {
          'id':'1',
          'attr1':'yes',
          'attr2':'awesome' 
        }
      ]
    }
  });
  var books = App.Book.find();
  setTimeout(function(){
    equal(books.get('length'), 1);
    start();
  }, 50);
});

asyncTest('Find query: find({attr1: "yes"})', 1, function() {
  $.mockjax({
    url: "/books?attr1=yes",
    responseTime: 0,
    contentType: 'text/json',
    responseText: {
      'books': [
        {
          'id':'1',
          'attr1':'yes',
          'attr2':'awesome' 
        }
      ]
    }
  });
  var booksQuery = App.Book.find({attr1: "yes"});
  setTimeout(function(){
    equal(booksQuery.get('length'), 1);
    start();
  }, 50);
});

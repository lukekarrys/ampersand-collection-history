// IGNORE
/* globals console */
// ENDIGNORE
var CollectionHistory = require('./collection-history');
var Collection = require('ampersand-collection').extend({
    model: require('ampersand-state').extend({
        props: {
            id: 'number',
            date: 'string'
        }
    }),
    initialize: function () {
        this.history = new CollectionHistory({
            collection: this,
            key: 'date'
        });
    }
});

var collection = new Collection([
    {id: 1, date: '2014-11-10'},
    {id: 2, date: '2014-11-11'},
    {id: 3, date: '2014-11-12'}
]);

collection.get(1).date = '2014-11-05';
collection.get(2).date = '2014-11-06';
collection.get(3).date = '2014-11-07';

// IGNORE
var log = console.log;
console.log = function (action) { log(action.obj.id, action.value); };
// ENDIGNORE
console.log(collection.history.undo()); // {obj: child {id: 3, ...}, value: '2014-11-12'}
console.log(collection.history.undo()); // {obj: child {id: 2, ...}, value: '2014-11-11'}
console.log(collection.history.undo()); // {obj: child {id: 1, ...}, value: '2014-11-10'}

console.log(collection.history.redo()); // {obj: child {id: 1, ...}, value: '2014-11-05'}
console.log(collection.history.redo()); // {obj: child {id: 2, ...}, value: '2014-11-05'}
console.log(collection.history.redo()); // {obj: child {id: 3, ...}, value: '2014-11-07'}

// IGNORE
/* globals console */
// ENDIGNORE
var CollectionHistory = require('../collection-history');
// IGNORE
var undo = CollectionHistory.prototype.undo;
var redo = CollectionHistory.prototype.redo;
CollectionHistory.prototype.undo = function () {
    var res = undo.apply(this, arguments);
    console.log(res.obj.id, res.value);
    return res;
};
CollectionHistory.prototype.redo = function () {
    var res = redo.apply(this, arguments);
    console.log(res.obj.id, res.value);
    return res;
};
// ENDIGNORE
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

collection.history.undo(); // {obj: child {id: 3, ...}, value: '2014-11-12'}
collection.history.undo(); // {obj: child {id: 2, ...}, value: '2014-11-11'}
collection.history.undo(); // {obj: child {id: 1, ...}, value: '2014-11-10'}

collection.history.redo(); // {obj: child {id: 1, ...}, value: '2014-11-05'}
collection.history.redo(); // {obj: child {id: 2, ...}, value: '2014-11-06'}
collection.history.redo(); // {obj: child {id: 3, ...}, value: '2014-11-07'}

var test = require('tape');
var range = require('lodash.range');
var CollectionHistory = require('../collection-history');
var Collection = require('ampersand-collection');
var State = require('ampersand-state');


var DateCollection = Collection.extend({
    model: State.extend({
        props: {
            id: 'number',
            date: 'string'
        }
    })
});


test('should work for models with previous/current values', function (t) {
    var action;
    var collection = new DateCollection([{
        id: 1,
        date: '2014-08-13'
    }, {
        id: 2,
        date: '2014-08-14'
    }]);
    var h = new CollectionHistory({
        autoListen: true,
        collection: collection,
        key: 'date'
    });

    t.equal(h.length, 0);
    t.equal(h.index, -1);
    t.equal(h.hasUndo, false);
    t.equal(h.hasRedo, false);

    // Change one date
    collection.get(1).set('date', '2014-08-12');
    t.equal(h.hasUndo, true);
    t.equal(h.hasRedo, false);

    // Change another date
    collection.get(2).set('date', '2014-08-15');
    t.equal(h.hasUndo, true);
    t.equal(h.hasRedo, false);

    function undo() {
        action = h.undo();
        t.equal(action.obj.id, 2);
        t.equal(action.value, '2014-08-14');
        t.equal(h.hasUndo, true);
        t.equal(h.hasRedo, true);
    }

    function undo2() {
        action = h.undo();
        t.equal(action.obj.id, 1);
        t.equal(action.value, '2014-08-13');
        t.equal(h.hasUndo, false);
        t.equal(h.hasRedo, true);
    }

    function redo() {
        action = h.redo();
        t.equal(action.obj.id, 1);
        t.equal(action.value, '2014-08-12');
        t.equal(h.hasUndo, true);
        t.equal(h.hasRedo, true);
    }

    function redo2() {
        action = h.redo();
        t.equal(action.obj.id, 2);
        t.equal(action.value, '2014-08-15');
        t.equal(h.hasUndo, true);
        t.equal(h.hasRedo, false);
    }

    for (var i = 0; i < 5; i++) {
        undo();
        undo2();
        redo();
        redo2();
    }

    t.end();
});


test('should reset when adding in the middle of items', function (t) {
    var action;
    var collection = new DateCollection(range(1, 15).map(function (index) {
        return {
            // 1, 2014-11-01
            // 2, 2014-11-02
            // etc
            id: index,
            date: '2014-11-' + (index < 10 ? '0' : '') + index
        };
    }));
    var h = new CollectionHistory({
        autoListen: true,
        collection: collection,
        key: 'date'
    });

    collection.each(function (model) {
        // +1 to every date in collection
        model.set('date', model.get('date').replace(/-(\d\d)$/, function (match, day) {
            day = parseInt(day, 10) + 1;
            return '-' + (day < 10 ? '0' : '') + day;
        }));
    });

    t.equal(collection.length, 14);
    t.equal(h.length, 14);

    h.undo();
    h.undo();
    h.undo();
    h.undo();
    action = h.undo();
    t.equal(h.length, 14);
    t.equal(action.obj, collection.at(9));
    t.equal(action.value, '2014-11-10');

    action.obj.set('date', '2014-11-30');
    t.equal(h.length, 11);

    action = h.undo();
    t.equal(action.obj, collection.at(9));
    t.equal(action.value, '2014-11-11');

    action = h.undo();
    t.equal(action.obj, collection.at(9));
    t.equal(action.value, '2014-11-10');

    action = h.redo();
    t.equal(action.obj, collection.at(9));
    t.equal(action.value, '2014-11-11');

    action = h.redo();
    t.equal(action.obj, collection.at(9));
    t.equal(action.value, '2014-11-30');

    t.end();
});

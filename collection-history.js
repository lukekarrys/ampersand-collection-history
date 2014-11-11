var Events = require('backbone-events-standalone');
var extend = require('lodash.assign');


function CollectionHistory (options) {
    options || (options = {});

    this.reset();

    if (options.collection && options.key) {
        this.listenToKey(options.collection, options.key);
    }
}

CollectionHistory.prototype.reset = function () {
    this._history = [];
    this.index = -1;
    this.hasUndo = false;
    this.hasRedo = false;
    delete this._lastAction;
    this.trigger('reset', this);
    this._sendTriggers();
};

CollectionHistory.prototype.listenToKey = function (collection, key) {
    collection.on('change:' + key, function (model, value, options) {
        if (options && options.ignoreHistory) return;
        this.add(model, key, model.previous(key), model.get(key));
    }, this);
};

CollectionHistory.prototype.add = function (obj, key, prevVal, newVal) {
    var add = {
        obj: obj,
        key: key,
        previousVal: prevVal,
        newVal: newVal
    };

    this._history.splice.apply(this._history, [
        // Remove everything after current index
        Math.max(this.index, 0) + 1,
        Number.MAX_VALUE,
        // Add our object
        add
    ]);

    this.index = this.length;
    this.hasUndo = true;
    this.hasRedo = false;
    this.trigger('add', this, add);
    this._sendTriggers();
};

CollectionHistory.prototype.undo = function (apply) {
    var changeAction = this._lastAction === 'redo';
    this._lastAction = 'undo';

    if (!changeAction) {
        this.index = Math.max(-1, this.index - 1);
        this.hasUndo = this.index > 0;
    }

    this.hasRedo = true;
    this._sendTriggers();

    if (this.current) {
        this.trigger('undo', this, this.current);
        if (apply) {
            this.current.obj.set(this.current.key, this.current.previousVal, {ignoreHistory: true});
        }
        return {
            obj: this.current.obj,
            value: this.current.previousVal,
            key: this.current.key
        };
    }
};

CollectionHistory.prototype.redo = function (apply) {
    var changeAction = this._lastAction === 'undo';
    this._lastAction = 'redo';

    if (!changeAction) {
        this.index = Math.min(this.length, this.index + 1);
        this.hasRedo = this.index < this.length - 1;
    }

    this.hasUndo = true;
    this._sendTriggers();
    
    if (this.current) {
        this.trigger('redo', this, this.current);
        if (apply) {
            this.current.obj.set(this.current.key, this.current.newVal, {ignoreHistory: true});
        }
        return {
            obj: this.current.obj,
            value: this.current.newVal,
            key: this.current.key
        };
    }
};

CollectionHistory.prototype._sendTriggers = function () {
    this.trigger('collectionHistory:hasUndo', this, this.hasUndo);
    this.trigger('collectionHistory:hasRedo', this, this.hasRedo);
};

Object.defineProperties(CollectionHistory.prototype, {
    length: {
        get: function () {
            return this._history.length;
        }
    },
    items: {
        get: function () {
            return this._history;
        }
    },
    current: {
        get: function () {
            return this.items[this.index];
        }
    }
});


extend(CollectionHistory.prototype, Events);


module.exports = CollectionHistory;

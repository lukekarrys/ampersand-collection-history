ampersand-collection-history
===========

[![NPM](https://nodei.co/npm/ampersand-collection-history.png)](https://nodei.co/npm/ampersand-collection-history/)

[![Build Status](https://travis-ci.org/lukekarrys/ampersand-collection-history.png?branch=master)](https://travis-ci.org/lukekarrys/ampersand-collection-history)

## Install

`npm install ampersand-collection-history --save`

**Note: this will also work with Backbone models and collections or can even be used manually.**


## What?

Provides a way to track changes for specified keys of models within a collection and undo and redo those changes.


## Example

```js
{{example.js}}
```


## API

### constructor/initialize `new CollectionHistory([options])`
#### `options.collection` (optional)
#### `options.key` (optional)

When creating an `ampersand-collection-history` instance, you can pass in a `collection`
and a `key`. This will automatically call `listenToKey`.


### Methods

#### `listenToKey(collection, key)`

Creates a change listener on the `collection` for the specified `key`. On each change event, an entry
will be added to the history stack. If later on you want to a change to **not** get added to the history,
you can pass `{ignoreHistory: true}` as an option on the change.

#### `undo([apply Boolean])`

If there are previous items in the history, this moves the index of the stack back, gets the previous change and returns it.
If `apply` is `true` then the change will also be `set` on the model.

#### `redo([apply Boolean])`

If there are next items in the history, this moves the index of the stack forward, gets the next change and returns it.
If `apply` is `true` then the change will also be `set` on the model.

#### `add(model, key, previousValue, newValue)`

If you want to manually add an entry to the history, use this method. Pass in the
model instance, the key of the values, the previous value and the new value.


### Properties

#### `hasUndo`

Check whether the history has items to undo.
This will also be triggered on the history instance as `collectionHistory:hasUndo`.

#### `hasRedo`

Check whether the history has items to redo.
This will also be triggered on the history instance as `collectionHistory:hasRedo`.

#### `current`

Returns the current item in the history stack. Keep in mind that if the history
is at the beginning or end, this will return `undefined`.

#### `items`

Returns all the items in the history stack.

#### `length`

Returns the length of the history stack.

#### `index`

Returns the current index of the history stack.


## Tests

`npm test`


## License

MIT

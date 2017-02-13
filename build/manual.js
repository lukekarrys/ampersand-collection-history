// IGNORE
/* globals console */
// ENDIGNORE
var CollectionHistory = require('../collection-history')
// IGNORE
var undo = CollectionHistory.prototype.undo
var redo = CollectionHistory.prototype.redo
CollectionHistory.prototype.undo = function () {
  var res = undo.apply(this, arguments)
  console.log(res.obj.id, res.value)
  return res
}
CollectionHistory.prototype.redo = function () {
  var res = redo.apply(this, arguments)
  console.log(res.obj.id, res.value)
  return res
}
// ENDIGNORE
var collHistory = new CollectionHistory()

// IGNORE
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
    })
  }
})

var collection = new Collection([
    {id: 1, date: '2014-11-10'},
    {id: 2, date: '2014-11-11'},
    {id: 3, date: '2014-11-12'}
])

var yourModel1 = collection.at(0)
var yourModel2 = collection.at(1)
var yourModel3 = collection.at(2)
// ENDIGNORE
collHistory.add(yourModel1, 'date', '2014-11-10', '2014-11-05')
collHistory.add(yourModel2, 'date', '2014-11-11', '2014-11-06')
collHistory.add(yourModel3, 'date', '2014-11-12', '2014-11-07')

// IGNORE

// ENDIGNORE
collHistory.undo() // {obj: YourModel {...}, value: '2014-11-12'}
collHistory.undo() // {obj: YourModel {...}, value: '2014-11-11'}
collHistory.undo() // {obj: YourModel {...}, value: '2014-11-10'}

collHistory.redo() // {obj: YourModel {...}, value: '2014-11-05'}
collHistory.redo() // {obj: YourModel {...}, value: '2014-11-06'}
collHistory.redo() // {obj: YourModel {...}, value: '2014-11-07'}

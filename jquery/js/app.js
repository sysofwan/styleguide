/*global $ */
(function () {
  'use strict';

  var ENTER_KEY = 13;
  var ESCAPE_KEY = 27;

  // this are some utility functions. In larger apps, this may be a global variable
  // in this case, util is only used inside this function, so it should not be global
  var util = {
    // uuid generation. Each todo item has its own unique id
    uuid: function () {
      /*jshint bitwise:false */
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
      }

      return uuid;
    },

    pluralize: function (count, word) {
      return count === 1 ? word : word + 's';
    },

    // stores data inside localstorage with namespace as key
    // if data is null, retuns data in namespace
    store: function (namespace, data) {
      if (arguments.length > 1) {
        return localStorage.setItem(namespace, JSON.stringify(data));
      } else {
        var store = localStorage.getItem(namespace);
        return (store && JSON.parse(store)) || [];
      }
    }
  };


  // creates a todoItem view. 
  // the view accepts a todo model, which has a title, completed, and id property
  var todoItemView = function(todo) {
    // lodash templates, see https://lodash.com/docs#template
    var template = _.template($('#todo-item-template').html());
    
    var elt = $(template(todo));
    var id = todo.id;
    var onUpdate = _.noop; // _.noop is a function that literally does nothing
    var onDelete = _.noop;
    var self = {}; // the public interface


    var listeners = (function() {
      var aborted = false;

      return {
        edit: function() {
          aborted = false;
          elt.addClass('editing').find('.edit').focus();
        },

        editKeyup: function(e) {
          if (e.which === ENTER_KEY) {
            e.target.blur();
          }

          if (e.which === ESCAPE_KEY) {
            aborted = true;
            e.target.blur();
          }
        },

        update: function(e) {
          if (aborted) {
            elt.removeClass('editing');
            return;
          }

          var el = $(e.target);
          var val = el.val().trim();
          
          if (!val) {
            elt.remove();
            onDelete(self);
          }

          else {
            todo.title = val;
            elt.find('label').text(val);
            onUpdate(self);
            elt.removeClass('editing');
          }
        },

        toggleComplete: function(e) {
          todo.completed = !todo.completed;
          elt.toggleClass('completed');
          onUpdate(self);
        },

        delete: function(e) {
          elt.remove();
          onDelete(self);
        }
      };

    }());

    var attachHandlers = function() {
      elt
        .on('change', '.toggle', listeners.toggleComplete)
        .on('dblclick', 'label', listeners.edit)
        .on('keyup', '.edit', listeners.editKeyup)
        .on('focusout', '.edit', listeners.update)
        .on('click', '.destroy', listeners.delete);
    };

    attachHandlers();

    var render = function(newTodo) {
      todo = newTodo || todo;
      newHtml = $(template(todo));
      elt.replaceWith(newHtml);
      elt = newHtml;
      attachHandlers();
    };

    // expose public interface
    self.getElt = function() {
      return elt;
    };

    self.getTodo = function() {
      return todo;
    };

    self.render = render;

    self.remove = function() {
      elt.remove();
    };

    self.onUpdate = function(updateCallback) {
      onUpdate = updateCallback;
    };

    self.onDelete = function(deleteCallback) {
      onDelete = deleteCallback;
    };

    return self;
  };


  // View for the list of todo items
  var todoListView = (function() {
    var listElt = $('.todo-list');
    var todoItemViews = [];

    var onUpdate = _.noop;
    var onDelete = _.noop;

    var getItemIndexByView = function(todoItemView) {
      return todoItemViews.findIndex(function(view) {
        return todoItemView === view;
      });
    };

    var getItemIndexById = function(id) {
       return todoItemViews.findIndex(function(view) {
        return view.getTodo().id === id;
      });
    };

    var onItemUpdate = function(todoItemView) {
      onUpdate(todoItemView.getTodo());
    };

    var onItemDelete = function(todoItemView) {
      var itemIdx = getItemIndexByView(todoItemView);
      if (itemIdx !== -1) {
        todoItemViews.splice(itemIdx, 1);
        onDelete(todoItemView.getTodo());
      }
    };
    
    // appends item at the end of the list
    var addItem = function(todo) {
      var item = todoItemView(todo);
      item.onUpdate(onItemUpdate);
      item.onDelete(onItemDelete);
      listElt.append(item.getElt());
      todoItemViews.push(item);
    };

    // removes itemView with corresponding todo
    var removeItem = function(todo) {
      var itemIdx = getItemIndexById(todo.id);
      if (itemIdx !== -1) {
        var itemView = todoItemViews[itemIdx];
        itemView.remove();
        todoItemView.splice(itemIdx, 1);
      }
    };


    // rerender the list view 
    var render = function(todos) {
      // if there is a new todo list, render everyting again
      if (todos) {
        _.each(todoItemViews, function(view) {
          view.remove();
        });
        todoItemViews = [];
        _.each(todos, addItem);
      }
      else {
        _.each(todoItemViews, function(view) {
          view.render();
        });
      }
    };


    return {
      addItem: addItem,
      removeItem: removeItem,
      render: render,
      onUpdate: function(cb) {onUpdate = cb;},
      onDelete: function(cb) {onDelete = cb;}
    };

  }());

  var todoInput = (function() {
    var elt = $('.new-todo');
    var onCreate = _.noop;

    elt.on('keyup', function(e) {
      var val = elt.val().trim();
      if (e.which !== ENTER_KEY || !val) {
        return;
      }
      onCreate({
        id: util.uuid(),
        title: val,
        completed: false
      });
      elt.val('');
    });

    return {
      onCreate: function(cb) {onCreate = cb; }
    };
  }());

  var todoFooter = (function() {
    var footer = $('.footer');
    var count = footer.find('.todo-count');
    var clearLink = footer.find('.clear-completed');

    var onClear = _.noop;

    var todos = [];

    clearLink.on('click', function() {
      onClear();
    });

    // gets # todos left
    var getLeftCount = function() {
      return _.reduce(todos, function(sum, todoItem) {
        return todoItem.completed ? sum : sum + 1;
      }, 0);
    };

    var setCount = function() {
      var leftCount = getLeftCount();
      if (leftCount == 1) {
        count.html(leftCount + ' item left');
      }
      else {
        count.html(leftCount + ' items left');
      }
    }

    return {
      render: function(todos_) {
        todos = todos_ || todos;
        setCount();
        
        if (!_.some(todos, 'completed')) {
          clearLink.hide();
        }
        else {
          clearLink.show();
        }
        
        if (todos.length === 0) {
          footer.hide();
        }
        else {
          footer.show();
        }
      },
      onClear: function(cb) {onClear = cb;},
      hide: function() {footer.hide();},
      show: function() {footer.show();}
    };
  }());


  // controller function
  (function() {
    var NAMESPACE = 'todo-jquery-mvc';

    var todos = util.store(NAMESPACE);

    var saveTodos = function() {
      util.store(NAMESPACE, todos);
    };

    todoListView.render(todos);
    todoFooter.render(todos);

    todoListView.onUpdate(function() {
      saveTodos();
      todoFooter.render();
    });

    todoListView.onDelete(function(todo) {
      var idx = todos.findIndex(function(t) { return t === todo;});
      if (idx != -1) {
        todos.splice(idx, 1);
        saveTodos();
      }
      todoFooter.render();
    });

    todoInput.onCreate(function(todo) {
      todos.push(todo);
      saveTodos();
      todoListView.addItem(todo);
      todoFooter.render();
    });

    todoFooter.onClear(function() {
      todos = _.filter(todos, function(todo) {
        return !todo.completed;
      });
      saveTodos();
      todoListView.render(todos);
      todoFooter.render(todos);
    });
  }());

})();

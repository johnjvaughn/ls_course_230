/*
  TodoList
*/

var TodoList = function(todosData) {
  if (!(this instanceof TodoList)) {
    return new TodoList(todosData);
  }

  var Todo = function(todoData, id) {
    if (!(this instanceof Todo)) {
      return new Todo(todoData, id);
    }
    var today = new Date();

    this.id = id;
    this.title = String(todoData.title);
    this.month = +todoData.month || today.getMonth() + 1;
    this.year = +todoData.year || today.getFullYear();
    this.description = String(todoData.description);
    this.completed = todoData.hasOwnProperty('completed') ? todoData.completed : false;

    this.isWithinMonthYear = function(month, year) {
      return (this.month === +month && this.year === +year);
    };
  };

  var todos = []; // keep private

  todosData.forEach(function (todoData, index) {
    todos.push(new Todo(todoData, index + 1));
  });

  this.lastId = todosData.length;

  this.indexOfId = function(todoId) {
    for (var i = 0; i < todos.length; i += 1) {
      if (todos[i].id === todoId) return(i);
    }
  };

  this.cloneTodo = function(todoId) {
    var index = this.indexOfId(todoId);

    if (index === undefined) return;
    return new Todo(todos[index], todoId);
  };

  this.add = function(todoData) {
    if (todoData.id && (this.indexOfId(todoData.id) !== undefined)) {
      throw new Error('Attempt to add new todo with an ID that already exists.');
    }
    var id = todoData.id ? todoData.id : this.nextIdNum();
    var todo = new Todo(todoData, id);

    todos.push(todo);
    return todo.id;
  };

  this.delete = function(todoId) {
    var todoIndex = this.indexOfId(todoId);

    return (todoIndex === undefined) ? undefined : todos.splice(todoIndex, 1)[0];
  };

  this.searchFor = function(searchObj) {
    var todoCopies = [];

    todos.forEach(function (todo) {
      if (Object.keys(searchObj).every(function (prop) {
        return searchObj[prop] === todo[prop];
      })) {
        todoCopies.push(this.cloneTodo(todo.id));
      }
    }, this);

    return todoCopies;
  }
}

TodoList.prototype.nextIdNum = function() {
  return (this.lastId += 1);
};

TodoList.prototype.update = function(todoId, todoData) {
  var index = this.indexOfId(todoId);
  var todo;

  if (index === undefined) return;
  todo = this.delete(todoId);
  Object.keys(todoData).forEach(function (prop) {
    todo[prop] = todoData[prop];
  });

  this.add(todo);
  return index;
};

TodoList.prototype.complete = function(todoId) {
  return this.update(todoId, { completed: true });
}

/*
 todoManager
*/

var todoManager = {
  todoList: {},

  listAll: function() {
    return this.todoList.searchFor({});
  },

  listCompleted: function() {
    return this.todoList.searchFor({
      'completed': true,
    });
  },

  listAllDate: function(month, year) {
    return this.todoList.searchFor({
      'month': +month,
      'year': +year,
    });
  },

  listCompletedDate: function(month, year) {
    return this.todoList.searchFor({
      'completed': true,
      'month': +month,
      'year': +year,
    });
  },

  init: function(todoSet) {
    this.todoList = new TodoList(todoSet);
    return this;
  },
};


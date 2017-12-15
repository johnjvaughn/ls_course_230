/*
  Todo
*/

var Todo = function(todoData, id) {
  if (!(this instanceof Todo)) {
    return new Todo(todoData, id);
  }

  this.id = +id;
  this.title = String(todoData.title);
  this.day = +todoData.day || null;
  this.month = +todoData.month || null;
  this.year = +todoData.year || null;
  if (this.month && this.year) {
    var monthString = ((this.month < 10) ? "0" : "") + String(this.month); 
    this.dueDate = monthString + "/" + String(this.year).slice(-2);
  } else {
    this.dueDate = "No Due Date";
  }
  this.description = String(todoData.description);
  this.completed = todoData.hasOwnProperty('completed') ? !!todoData.completed : false;
};

Todo.prototype.isWithinMonthYear = function(month, year) {
  return (this.month === +month && this.year === +year);
};

/*
  TodoList
*/

var TodoList = function(todosData) {
  if (!(this instanceof TodoList)) {
    return new TodoList(todosData);
  }

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

  this.getTodoNavList = function(completedOnly) {
    var todoNavObj = {};
    todos.forEach(function (todo) {
      if (completedOnly && !todo.completed) return;
      if (Object.keys(todoNavObj).includes(todo.dueDate)) {
        todoNavObj[todo.dueDate] += 1;
      } else {
        todoNavObj[todo.dueDate] = 1;
      }
    });
    return Object.keys(todoNavObj).map(function (key) {
      return { dueDate: key, number: todoNavObj[key] };
    });
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
    console.log(searchObj);

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
  utilities
*/

function ajaxError(xhr, status, errorThrown) {
  alert( "AJAX: Sorry, there was a problem!");
  console.log("Error: " + errorThrown);
  console.log("Status: " + status);
  console.dir(xhr);
}

/*
 todoManager
*/

var todoManager = {
  todoList: {},
  $elements: [],
  templates: {},
  searchParam: {},
  root: "/api/",
  routes: Object.freeze({
    index: { type: "get", action: "todos" },
    show: { type: "get", action: "todos/{id}" },
    new: { type: "post", action: "todos" },
    update: { type: "put", action: "todos/{id}" },
    delete: { type: "delete", action: "todos/{id}" },
    toggle: { type: "post", action: "todos/{id}/toggle_completed" },
  }),


  collectHandlebarTemplates: function () {
    var todoMgr = this;
    $('script[type="text/x-handlebars"]').each(function() {
      var $template = $(this);
      var template_name = $template.attr("id");
      todoMgr.templates[template_name] = Handlebars.compile($template.html());
      if ($template.attr("data-type") === "partial") {
        Handlebars.registerPartial(template_name, todoMgr.templates[template_name]);
      }
      $template.remove();
    });
  },

  collectJQElements: function () {
    this.$elements.todo_list = $('ul.todo_list');
    this.$elements.todo_nav_all = $('ul.todos_all');
    this.$elements.todo_nav_comp = $('ul.todos_completed');
    this.$elements.todo_table = $('nav.todo_table');
  },

  populateTodoList: function () {
    this.$elements.todo_list.children().not(':first-child').remove();
    this.$elements.todo_list.append(this.templates.todos({ todos: this.listCurrent() }));
  },

  populateTodoNavs: function () {
    this.$elements.todo_nav_all.append(this.templates.todo_nav({ todos: this.todoList.getTodoNavList(false) }));
    this.$elements.todo_nav_comp.append(this.templates.todo_nav({ todos: this.todoList.getTodoNavList(true) }));
  },

  listCurrent: function() {
    return this.todoList.searchFor(this.searchParam);
  },

  getTodos: function () {
    $.ajax({
      url: this.root + this.routes.index.action,
      type: this.routes.index.type,
      dataType: "json",
    }).done(function(json) {
      this.todoList = new TodoList(json);
      this.populateTodoList();
      this.populateTodoNavs();
    }.bind(this)).fail(ajaxError);
  },

  selectTodos: function(e) {
    // e.preventDefault();
    this.searchParam.completed = $(e.target).parent().hasClass('todos_all');
    this.searchParam.dueDate = $(e.target).find('.todo_date').text();
    console.log(this.searchParam);
    $(e.target).addClass('active_todo');
    $(e.target).siblings().removeClass('active_todo');
    this.populateTodoList();
  },

  bindEvents: function() {
    this.$elements.todo_table.on('click', 'li', this.selectTodos.bind(this));
  },

  init: function() {
    this.collectJQElements();
    this.collectHandlebarTemplates();
    this.getTodos();
    this.bindEvents();
    return this;
  },
};

$(function () {
  todoManager.init();
});
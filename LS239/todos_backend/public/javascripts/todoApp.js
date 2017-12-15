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
    console.log(this.templates);
  },

  collectJQElements: function () {
    this.$elements.todoList = $('table.todo_list');
    this.$elements.todoNavAll = $('ul.todos_all');
    this.$elements.todoNavComp = $('ul.todos_completed');
    this.$elements.todoTable = $('nav.todo_table');
    this.$elements.addItem = $('.add_item');
    // this.$elements.modal = $('form.modal');
    // this.$elements.modalBG = $('.modal_background');
    this.$elements.mainHeading = $('main > h2');
    this.$elements.mainHeadingNum = $('main > .todo_num');
  },

  populateTodoList: function () {
    var listCurrent = this.listCurrent();
    this.$elements.todoList.children().not(':first-child').remove();
    this.$elements.todoList.append(this.templates.todos({ todos: listCurrent }));
    var title = this.searchParam.dueDate || 
        (this.searchParam.completed ? "Completed" : "All Todos");
    this.$elements.mainHeading.html(title);
    this.$elements.mainHeadingNum.html(String(listCurrent.length));
  },

  populateTodoNavs: function () {
    var allNavList = this.todoList.getTodoNavList(false);
    var compNavList = this.todoList.getTodoNavList(true);
    this.$elements.todoNavAll.append(this.templates.todo_nav({ nav: allNavList }));
    this.$elements.todoNavComp.append(this.templates.todo_nav({ nav: compNavList }));
    var allNum = allNavList.reduce(function (sum, nav) {
      return sum + nav.number;
    }, 0);
    var compNum = compNavList.reduce(function (sum, nav) {
      return sum + nav.number;
    }, 0);
    this.$elements.todoTable.find('div.all_todos span.todo_num').html(String(allNum));
    this.$elements.todoTable.find('div.completed_todos span.todo_num').html(String(compNum));
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
    e.preventDefault();
    var $navItem = $(e.currentTarget);
    this.searchParam = {};
    this.$elements.todoTable.find('.active_todo').removeClass('active_todo');
    if (e.currentTarget.tagName === 'LI') {
      this.searchParam.dueDate = $navItem.find('.todo_date').text();
      if ($navItem.parent().hasClass('todos_completed')) {
        this.searchParam.completed = true;
      }
      $navItem.children('a').addClass('active_todo');
    } else if (e.currentTarget.tagName === 'DIV') {
      if ($navItem.hasClass('completed_todos')) {
        this.searchParam.completed = true;
      }
      $navItem.addClass('active_todo');
    }
    this.populateTodoList();
  },

  startModal: function () {
    modalManager.init.call(modalManager, this.todoList, id);
  },
  bindEvents: function() {
    this.$elements.todoTable.on('click', 'li, div', this.selectTodos.bind(this));
    this.$elements.addItem.on('click', this.startModal.bind(this));
  },

  init: function() {
    this.collectJQElements();
    this.collectHandlebarTemplates();
    this.getTodos();
    this.bindEvents();
    return this;
  },
};

var modalManager = {
  collectJQElements: function () {
    this.$elements.modal = $('form.modal');
    this.$elements.modalBG = $('.modal_background');
  },
  hideModal: function () {
    this.$elements.modalBG.fadeOut();
    this.$elements.modal.fadeOut();
  },
  showModal: function (e) {
    e.preventDefault();
    this.$elements.modalBG.fadeIn();
    this.$elements.modal.fadeIn();
    this.$elements.modalBG.one('click', this.hideModal.bind(this));
  },
  init: function(todos, todo_id) {
    this.collectJQElements();
    this.showModal();
  },
};

$(function () {
  todoManager.init();
});
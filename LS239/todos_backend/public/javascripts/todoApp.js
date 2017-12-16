/*
  Todo
*/

var Todo = function(todoData, id) {
  if (!(this instanceof Todo)) {
    return new Todo(todoData, id);
  }

  Object.assign(this, todoData);
  if (!this.id) this.id = +id;
  // this.title = String(todoData.title);
  // this.day = todoData.day || null;
  // this.month = todoData.month || null;
  // this.year = todoData.year || null;
  if (this.month && this.year) {
    // var monthString = ((this.month < 10) ? "0" : "") + String(this.month); 
    // this.dueDate = monthString + "/" + String(this.year).slice(-2);
    this.dueDate = this.month + "/" + this.year.slice(-2);
  } else {
    this.dueDate = "No Due Date";
  }
  // this.description = todoData.description ? String(todoData.description) : "";
  //this.completed = todoData.hasOwnProperty('completed') ? !!todoData.completed : false;
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

  // this.lastId = todosData.length;

  this.indexOfId = function(todoId) {
    for (var i = 0; i < todos.length; i += 1) {
      if (todos[i].id === +todoId) return(i);
    }
  };

  this.getTodoNavList = function (completedOnly) {
    var todoNavObj = {};

    todos.forEach(function (todo) {
      if (completedOnly && !todo.completed) return;
      if (Object.keys(todoNavObj).includes(todo.dueDate)) {
        todoNavObj[todo.dueDate] += 1;
      } else {
        todoNavObj[todo.dueDate] = 1;
      }
    });
    var todoNavList = Object.keys(todoNavObj).map(function (key) {
      return { dueDate: key, number: todoNavObj[key] };
    });
    return todoNavList.sort(function (a, b) {
      if (a.dueDate === b.dueDate) return 0;
      if (a.dueDate === "No Due Date") return -1;
      if (b.dueDate === "No Due Date") return 1;
      a.date = a.dueDate.split("/");
      b.date = b.dueDate.split("/");
      if (a.date[1] != b.date[1]) {
        return a.date[1] - b.date[1];
      }
      return a.date[0] - b.date[0];
    });
  };

  this.cloneTodo = function (todoId) {
    var index = this.indexOfId(todoId);
    if (index === undefined) return;
    return new Todo(todos[index], todoId);
  };

  this.add = function (todo) {
    todos.push(todo);
  };

  // this.add = function(todoData) {
  //   if (todoData.id && (this.indexOfId(todoData.id) !== undefined)) {
  //     throw new Error('Attempt to add new todo with an ID that already exists.');
  //   }
  //   var id = todoData.id ? todoData.id : this.nextIdNum();
  //   var todo = new Todo(todoData, id);

  //   todos.push(todo);
  //   return todo.id;
  // };

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

    todoCopies.sort(function (a, b) {
      if (a.completed && !b.completed) {
        return 1;
      } else if (!a.completed && b.completed) {
        return -1;
      }
      return 0;
    });

    return todoCopies;
  }
}

// TodoList.prototype.nextIdNum = function() {
//   return (this.lastId += 1);
// };

TodoList.prototype.update = function(todoData, todoId) {
  // var index = this.indexOfId(todoId);
  // var todo;

  // if (index === undefined) return;
  // todo = this.delete(todoId);
  var todo = this.cloneTodo(todoId);
  this.delete(todoId);
  Object.assign(todo, todoData);

  // Object.keys(todoData).forEach(function (prop) {
    // todo[prop] = todoData[prop];
  // });

  this.add(todo);
};

TodoList.prototype.complete = function(todoId) {
  return this.update({ completed: true }, todoId);
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

routes = Object.freeze({
  index: { type: "get", action: "/api/todos" },
  show: { type: "get", action: "/api/todos/{id}" },
  new: { type: "post", action: "/api/todos" },
  update: { type: "put", action: "/api/todos/{id}" },
  delete: { type: "delete", action: "/api/todos/{id}" },
  toggle: { type: "post", action: "/api/todos/{id}/toggle_completed" },
});

/*
 todoManager
*/

var todoManager = {
  todoList: {},
  $elements: [],
  templates: {},
  searchParam: {},
 


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
    this.$elements.todoMainList = $('table.todo_list tbody');
    this.$elements.todoNavAll = $('ul.todos_all');
    this.$elements.todoNavComp = $('ul.todos_completed');
    this.$elements.todoNav = $('nav.todo_table');
    this.$elements.addItem = $('.add_item');
    this.$elements.mainHeading = $('main > h2');
    this.$elements.mainHeadingNum = $('main > .todo_num');
  },

  populateTodoList: function () {
    var listCurrent = this.listCurrent();
    this.$elements.todoMainList.children().remove();
    this.$elements.todoMainList.append(this.templates.todos({ todos: listCurrent }));
    var title = this.searchParam.dueDate || 
        (this.searchParam.completed ? "Completed" : "All Todos");
    this.$elements.mainHeading.html(title);
    this.$elements.mainHeadingNum.html(String(listCurrent.length));
  },

  populateTodoNavs: function () {
    var allNavList = this.todoList.getTodoNavList(false);
    var compNavList = this.todoList.getTodoNavList(true);
    this.$elements.todoNavAll.html(this.templates.todo_nav({ nav: allNavList }));
    this.$elements.todoNavComp.html(this.templates.todo_nav({ nav: compNavList }));
    var allNum = allNavList.reduce(function (sum, nav) {
      return sum + nav.number;
    }, 0);
    var compNum = compNavList.reduce(function (sum, nav) {
      return sum + nav.number;
    }, 0);
    this.$elements.todoNav.find('div.all_todos span.todo_num').html(String(allNum));
    this.$elements.todoNav.find('div.completed_todos span.todo_num').html(String(compNum));
  },

  listCurrent: function() {
    return this.todoList.searchFor(this.searchParam);
  },

  getTodos: function () {
    var request = {
      url: routes.index.action,
      type: routes.index.type,
      dataType: "json",
    };
    $.ajax(request).done(function(json) {
      this.todoList = new TodoList(json);
      this.populateTodoList();
      this.populateTodoNavs();
    }.bind(this)).fail(ajaxError);
  },

  selectTodos: function(e) {
    e.preventDefault();
    var $navItem = $(e.currentTarget);
    this.searchParam = {};
    this.$elements.todoNav.find('.active_todo').removeClass('active_todo');
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

  startModal: function (e) {
    e.preventDefault();
    e.stopPropagation();
    var id = null;
    var todo;

    if ($(e.currentTarget).hasClass("todo_link")) {
      id = $(e.currentTarget).prev("input[type=checkbox]").attr("id");
      id = id.replace(/[^\d]+/, "");
      todo = this.todoList.cloneTodo(+id);
    } else {
      var today = new Date();
      todo = { 
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
      }
    }
    modalManager.init.call(modalManager, todo);
  },

  toggleCompleted: function (e) {
    e.preventDefault();
    var id = $(e.currentTarget).find("input[type=checkbox]").attr("id");
    id = id.replace(/[^\d]+/, "");
    var request = {
      url: routes.toggle.action.replace('{id}', id),
      type: routes.toggle.type,
      dataType: "json",
    }
    $.ajax(request).done(function(json) {
      this.todoList.update(json, id);
      this.populateTodoList();
      this.populateTodoNavs();
    }.bind(this)).fail(ajaxError);
  },

  deleteTodo: function (e) {
    e.preventDefault();
    var id = $(e.currentTarget).children(".delete_item").attr("id");
    id = id.replace(/[^\d]+/, "");
    var request = {
      url: routes.delete.action.replace('{id}', id),
      type: routes.delete.type,
      dataType: "json",
    }
    $.ajax(request).done(function() {
      this.todoList.delete(id);
      this.populateTodoList();
      this.populateTodoNavs();
    }.bind(this)).fail(ajaxError);
  },

  updateTodo: function (data, id) {
    var request = {
      url: routes.update.action.replace('{id}', id),
      type: routes.update.type,
      data: data,
      dataType: "json",
    }
    $.ajax(request).done(function(json) {
      this.todoList.update(json, id);
      this.populateTodoList();
      this.populateTodoNavs();
    }.bind(this)).fail(ajaxError);
  },
  

  bindEvents: function() {
    this.$elements.todoNav.on('click', 'li, div', this.selectTodos.bind(this));
    this.$elements.todoMainList.on('click', '.todo_link, .add_item', this.startModal.bind(this));
    this.$elements.todoMainList.on('click', 'td:first-of-type', this.toggleCompleted.bind(this));
    this.$elements.todoMainList.on('click', 'td:last-of-type', this.deleteTodo.bind(this));
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
  $elements: {},
  populateModal: function(todo) {
      console.log(todo);
    console.log(this.$elements.title);
    this.$elements.title.val(todo.title);
    this.$elements.id.val(String(todo.id));
    if (todo.day) {
      this.$elements.dueDay.val(todo.day);
    }
    if (todo.month) {
      this.$elements.dueMonth.val(todo.month);
    }
    if (todo.year) {
      this.$elements.dueYear.val(todo.year);
    }
    this.$elements.description.html(todo.description);
  },
  collectJQElements: function () {
    this.$elements = {
      modal: $('form.modal'),
      modalBG: $('.modal_background'),
      id: $('#todo_id'),
      title: $('#title'),
      dueDay: $('#due_day'),
      dueMonth: $('#due_month'),
      dueYear: $('#due_year'),
      description: $('#description'),
    }
  },
  saveTodo: function(e) {
    e.preventDefault();
    var id = this.$elements.id.val();
    if (id) {
      todoManager.updateTodo.call(todoManager, $(e.target).serialize(), id);
    } else {
      // todoManager.newTodo(data);
    }
    this.hideModal();
  },
  hideModal: function () {
    this.$elements.modalBG.fadeOut();
    this.$elements.modal.fadeOut(function() {
      this.get(0).reset();
    }.bind(this.$elements.modal));
  },
  showModal: function (todo) {
    this.populateModal(todo);
    this.$elements.modalBG.fadeIn();
    this.$elements.modalBG.one('click', this.hideModal.bind(this));
    this.$elements.modal.fadeIn();
    this.$elements.modal.one('submit', this.saveTodo.bind(this));
  },
  init: function(todo) {
    this.collectJQElements();
    this.showModal(todo);
  },
};

$(function () {
  todoManager.init();
});
$(function () {
  /*
    Todo
  */

  var Todo = function(todoData) {
    if (!(this instanceof Todo)) {
      return new Todo(todoData);
    }

    Object.assign(this, todoData);
    if (this.month && this.year) {
      this.dueDate = this.month + "/" + this.year.slice(-2);
    } else {
      this.dueDate = "No Due Date";
    }
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
      todos.push(new Todo(todoData));
    });

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
      return new Todo(todos[index]);
    };

    this.add = function (todoData) {
      todos.push(new Todo(todoData));
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

      todoCopies.sort(function (a, b) {
        var aScore = a.completed ? 1 : 0;
        var bScore = b.completed ? 1 : 0;
        return aScore - bScore;
      });

      return todoCopies;
    };

    this.update = function(todoData, todoId) {
      var todo = this.delete(todoId);
      Object.assign(todo, todoData);
      this.add(todo);
    };
  }

  /*
    utilities
  */

  function ajaxError(xhr, status, errorThrown) {
    alert( "AJAX Error: " + xhr.responseText);
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
      this.$elements = {
        todoMainList: $("table.todo_list tbody"),
        todoTable: $("table.todo_list"),
        todoNavAll: $("ul.todos_all"),
        todoNavComp: $("ul.todos_completed"),
        todoNav: $("nav.todo_table"),
        addItem: $(".add_item"),
        mainHeading: $("main > h2"),
        mainHeadingNum: $("main > .todo_num"),
      };
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

    resetTodoNavSelected: function () {
      var $activeNav = this.$elements.todoNav.find(".active_todo");
      if ($activeNav.length > 0) return;
      var $nav;
      if (this.searchParam) {
        if (this.searchParam.dueDate) {
          var selector = ".todo_date:contains('" + this.searchParam.dueDate + "')";
          if (this.searchParam.completed) {
            $nav = this.$elements.todoNavComp.find(selector);
          } else {
            $nav = this.$elements.todoNavAll.find(selector);
          }
          if ($nav && $nav.length > 0) {
            $nav.closest("li").trigger("click");
          }
        } else if (this.searchParam.completed) {
          $("div.completed_todos").trigger("click");
        } else {
          $("div.all_todos").trigger("click");
        }
      }
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
      this.$elements.todoNav.find("div.all_todos span.todo_num").html(String(allNum));
      this.$elements.todoNav.find("div.completed_todos span.todo_num").html(String(compNum));
      this.resetTodoNavSelected();
    },

    listCurrent: function () {
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

    selectTodos: function (e) {
      e.preventDefault();
      var $navItem = $(e.currentTarget);
      this.searchParam = {};
      this.$elements.todoNav.find(".active_todo").removeClass("active_todo");
      if (e.currentTarget.tagName === "LI") {
        this.searchParam.dueDate = $navItem.find(".todo_date").text();
        if ($navItem.parent().hasClass("todos_completed")) {
          this.searchParam.completed = true;
        }
        $navItem.children("a").addClass("active_todo");
      } else if (e.currentTarget.tagName === "DIV") {
        if ($navItem.hasClass("completed_todos")) {
          this.searchParam.completed = true;
        }
        $navItem.addClass("active_todo");
      }
      this.populateTodoList();
    },

    startModal: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var todo;

      if ($(e.currentTarget).hasClass("todo_link")) {
        var id = $(e.currentTarget).prevAll("input[type=checkbox]").attr("id");
        id = id.replace(/[^\d]+/, "");
        todo = this.todoList.cloneTodo(+id);
      } else {
        todo = {
          id: "",
          title: "",
          description: "",
        }
      }
      modalManager.init.call(modalManager, todo);
    },

    toggleTodo: function (id) {
      var request = {
        url: routes.toggle.action.replace("{id}", id),
        type: routes.toggle.type,
        dataType: "json",
      }
      $.ajax(request).done(function(json) {
        this.todoList.update(json, id);
        this.populateTodoList();
        this.populateTodoNavs();
      }.bind(this)).fail(ajaxError);
    },

    toggleCompleted: function (e) {
      e.preventDefault();
      var id = $(e.currentTarget).find("input[type=checkbox]").attr("id");
      id = id.replace(/[^\d]+/, "");
      this.toggleTodo(id);
    },

    deleteTodo: function (e) {
      e.preventDefault();
      var id = $(e.currentTarget).children(".delete_item").attr("id");
      id = id.replace(/[^\d]+/, "");
      var request = {
        url: routes.delete.action.replace("{id}", id),
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
        url: routes.update.action.replace("{id}", id),
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

    newTodo: function (data) {
      var request = {
        url: routes.new.action,
        type: routes.new.type,
        data: data,
        dataType: "json",
      }
      $.ajax(request).done(function(json) {
        this.todoList.add(json);
        this.populateTodoList();
        this.populateTodoNavs();
      }.bind(this)).fail(ajaxError);
    },
    
    bindEvents: function () {
      this.$elements.todoNav.on("click", "li, div", this.selectTodos.bind(this));
      this.$elements.todoTable.on("click", ".todo_link, .add_item", this.startModal.bind(this));
      this.$elements.todoTable.on("click", "td:first-of-type", this.toggleCompleted.bind(this));
      this.$elements.todoTable.on("click", "td:last-of-type", this.deleteTodo.bind(this));
    },

    init: function () {
      this.collectJQElements();
      this.collectHandlebarTemplates();
      this.getTodos();
      this.bindEvents();
      return this;
    },
  };

  var modalManager = {
    $elements: {},
    resetModal: function () {
      this.$elements.modal.find("input").val("");
      this.$elements.modal.find("select").get().forEach(function(element) {
        element.selectedIndex = 0;
      });
      this.$elements.description.html("").val("");
    },
    populateModal: function (todo) {
      this.resetModal();
      this.$elements.title.val(todo.title);
      if (todo.id) this.$elements.id.val(String(todo.id));
      if (todo.day) this.$elements.dueDay.val(todo.day);
      if (todo.month) this.$elements.dueMonth.val(todo.month);
      if (todo.year) this.$elements.dueYear.val(todo.year);
      this.$elements.description.html(todo.description).val(todo.description);
      this.$elements.completed.val(todo.completed ? "true" : "false"); 
    },
    collectJQElements: function () {
      this.$elements = {
        modal: $("form.modal"),
        modalBG: $(".modal_background"),
        id: $("#todo_id"),
        title: $("#title"),
        dueDay: $("#due_day"),
        dueMonth: $("#due_month"),
        dueYear: $("#due_year"),
        description: $("#description"),
        completed: $("#completed"),
        markComplete: $("#mark_as_complete"),
      }
    },
    saveTodo: function (e) {
      e.preventDefault();
      var id = this.$elements.id.val();
      var title = this.$elements.title.val();
      if (title.length < 3) {
        alert("Title must be at least three characters.");
        return;
      }
      var data = $(e.target).serialize();
      if (id) {
        todoManager.updateTodo.call(todoManager, data, id);
      } else {
        todoManager.newTodo.call(todoManager, data);
      }
      this.hideModal();
    },
    markComplete: function (e) {
      e.preventDefault();
      var id = this.$elements.id.val();
      if (!id) {
        alert("Cannot mark as complete as item has not been created yet!");
        return;
      }
      if (this.$elements.completed.val() !== "true") {
        todoManager.toggleTodo.call(todoManager, id);
      }
      this.hideModal();
    },
    hideModal: function () {
      this.$elements.markComplete.off();
      this.$elements.modalBG.fadeOut();
      this.$elements.modal.fadeOut().off();
    },
    showModal: function (todo) {
      this.populateModal(todo);
      this.$elements.modalBG.fadeIn();
      this.$elements.modalBG.one("click", this.hideModal.bind(this));
      this.$elements.modal.fadeIn();
      this.$elements.modal.on("submit", this.saveTodo.bind(this));
      this.$elements.markComplete.on("click", this.markComplete.bind(this));
    },
    init: function (todo) {
      this.collectJQElements();
      this.showModal(todo);
    },
  };

  todoManager.init();
});
/*
 Examples and Tests
*/

var todoData1 = {
  title: 'Buy Milk',
  month: '1',
  year: '2017',
  description: 'Milk for baby',
};

var todoData2 = {
  title: 'Buy Apples',
  month: '',
  year: '2017',
  description: 'An apple a day keeps the doctor away',
};

var todoData3 = {
  title: 'Buy chocolate',
  month: '1',
  year: '',
  description: 'For the cheat day',
};

var todoData4 = {
  title: 'Buy Veggies',
  month: '',
  year: '',
  description: 'For the daily fiber needs',
};

var todoData5 = {
  title: 'Buy Bread',
  month: '4',
  year: '',
  description: 'Whole wheat sandwich bread',
}

var todoData6 = {
  title: 'Buy Veggies', //intentionally set same as another todo title
  //month intentionally left out
  year: 2016, //intentionally entered as number
  description: ['Gotta have more ', 'vegetables'], //intentionally entered as array
}

var todoSet = [todoData1, todoData2, todoData3, todoData4];

/*
 p => console.log wrapper for nice output
*/
function p(item, description) {
  if (description) console.log(description);
  if (Array.isArray(item)) {
    console.log('---Array---');
    item.forEach(function(value) {
      console.log(value);
    });
    console.log("----end----");
  } else {
    console.log(item);
  }
  console.log('\n');
}

/*
 Tests
*/

// Test todoManager Init
todoManager.init(todoSet);

p(todoManager.todoList, 'todoManager.todoList');
p(todoManager.listAll(), 'todoManager.listAll()'); // array of todos 1 thru 4
// {id: 1, title: "Buy Milk", year: 2017, month: 1, description: "Milk for baby"}
// {id: 2, title: "Buy Apples", year: 2017, month: 11, description: "An apple a day keeps the doctor away"}
// {id: 3, title: "Buy chocolate", year: 2017, month: 1, description: "For the cheat day"}
// {id: 4, title: "Buy Veggies", year: 2017, month: 11, description: "For the daily fiber needs"}

// Test Add
todoManager.todoList.add(todoData5);
try {
  todoManager.todoList.add({id: 3, title: 'duplicate ID'}); //try to add an item with an id that already exists
} catch (err) {
  p(err.name + ': ' + err.message, 'error thrown intentionally');
  //Error: Attempt to add new todo with an ID that already exists.
}
p(todoManager.listAll(), 'todoManager.listAll() after adding a todo'); // todos 1 thru 5
// {id: 1, title: "Buy Milk", year: 2017, month: 1, description: "Milk for baby"}
// {id: 2, title: "Buy Apples", year: 2017, month: 11, description: "An apple a day keeps the doctor away"}
// {id: 3, title: "Buy chocolate", year: 2017, month: 1, description: "For the cheat day"}
// {id: 4, title: "Buy Veggies", year: 2017, month: 11, description: "For the daily fiber needs"}
// {id: 5, title: "Buy Bread", year: 2017, month: 4, description: "Whole wheat sandwich bread"}

// Test Update & Clone
todoManager.todoList.update(4, {title: 'No! buy more chocolate', year: '2000', completed: true});
var todo4 = todoManager.todoList.cloneTodo(4);
p(todo4, 'todoManager.todoList.cloneTodo(4) clone of todo with id 4'); //{id: 4, title: "No! buy more chocolate", year: 2000, month: 11, completed: true, description: "For the daily fiber needs"}
todo4.title = '***messed up title***';
delete todo4.month;
p(todo4, 'edited clone\'s title and deleted month'); //{id: 4, title: "", year: 2000, completed: true, description: "For the daily fiber needs"}
// test that the original is untouched:
p(todoManager.todoList.cloneTodo(4), 'todoManager.todoList.cloneTodo(4) new clone should be unchanged'); 
// {id: 4, title: "No! buy more chocolate", year: 2000, month: 11, completed: true, description: "For the daily fiber needs"}

// Test Delete
var deletedTodo = todoManager.todoList.delete(2);
p(todoManager.listAll(), 'todoManager.listAll() after deleting todo ID 2'); // array of todos 1 and 3 thru 5
// {id: 1, title: "Buy Milk", year: 2017, month: 1, description: "Milk for baby", completed: false}
// {id: 3, title: "Buy chocolate", year: 2017, month: 1, description: "For the cheat day", completed: false}
// {id: 5, title: "Buy Bread", year: 2017, month: 4, description: "Whole wheat sandwich bread", completed: false}
// {id: 4, title: "No! buy more chocolate", year: 2000, month: 11, description: "For the daily fiber needs", completed: true}
p(deletedTodo, 'the deleted todo with ID 2');
// {id: 2, title: "Buy Apples", year: 2017, month: 11, description: "An apple a day keeps the doctor away"}

// Test Add again
todoManager.todoList.add(todoData6); 
p(todoManager.todoList.cloneTodo(6), 'todoManager.todoList.cloneTodo(6) after adding it'); 
// {id: 6, title: "Buy Veggies", year: 2016, month: 11, description: "Gotta have more ,vegetables", completed: false}

// Test todoManager list functions:

todoManager.todoList.complete(3);
p(todoManager.listCompleted(), 'todoManager.listCompleted() after completing ID 3');
// {id: 3, title: "Buy chocolate", year: 2017, month: 1, description: "For the cheat day", completed: true}
// {id: 4, title: "No! buy more chocolate", year: 2000, month: 11, description: "For the daily fiber needs", completed: true}

p(todoManager.listAllDate(1, 2017), 'todoManager.listAllDate(1, 2017)');
// {id: 1, title: "Buy Milk", year: 2017, month: 1, description: "Milk for baby", completed: false}

p(todoManager.listCompletedDate(1, 2017), 'todoManager.listCompletedDate(1, 2017)');
// {id: 3, title: "Buy chocolate", year: 2017, month: 1, description: "For the cheat day", completed: true}

p(todoManager.listCompletedDate(1, 2015), 'todoManager.listCompletedDate(1, 2015) -- no results');
// []

//make sure we are getting copies, not originals
var compJan17 = todoManager.listCompletedDate(1, 2017)[0];
p(compJan17, 'object returned from todoManager.listCompletedDate(1, 2017)[0]');
// {id: 4, title: "No! buy more chocolate", year: 2017, month: 1, description: "For the daily fiber needs", completed: true}

compJan17.title = '';
compJan17.description = '';
p(compJan17, 'same object with title and description blanked');
// {id: 4, title: "", year: 2017, month: 1, description: "", completed: true}

compJan17 = todoManager.listCompletedDate(1, 2017)[0];
p(compJan17, 'todoManager.listCompletedDate(1, 2017)[0] (original should be unchanged)');
// {id: 4, title: "No! buy more chocolate", year: 2017, month: 1, description: "For the daily fiber needs", completed: true}


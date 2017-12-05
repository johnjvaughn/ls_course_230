(function() {
  var _ = function(element) {
    u = {
      first: function() {
        return element[0];
      },
      last: function() {
        return element[element.length - 1];
      },
      without: function() {
        var blackList = Array.prototype.slice.call(arguments);

        return element.filter(function(item) {
          return (!blackList.includes(item));
        });
      },
      lastIndexOf: function(value) {
        return element.length - element.reverse().indexOf(value) - 1;
      },
      sample: function(quantity) {
        var index;
        var copyArr;
        var returnArr;

        if (Number.isInteger(quantity)) {
          copyArr = element.slice();
          returnArr = [];
          while (quantity > 0 && copyArr.length > 0) {
            index = Math.floor(Math.random() * copyArr.length);
            returnArr = returnArr.concat(copyArr.splice(index, 1));
          }
          return returnArr;
        } else {
          index = Math.floor(Math.random() * element.length);
          return element[index];
        }
      },
      findWhere: function(obj) {
        var keys = Object.keys(obj);
        var e;

        for (var i = 0; i < element.length; i += 1) {
          e = element[i];
          if (keys.every(function(key) {
            return e[key] === obj[key];
          })) {
            return e;
          }
        }

        return;
      },
      where: function(obj) {
        var keys = Object.keys(obj);
        
        return element.filter(function(e) {
          return (keys.every(function(key) {
            return e[key] === obj[key];
          }));
        });
      },
      pluck: function(key) {
        var returnArr = [];

        element.forEach(function(e) {
          if (e.hasOwnProperty(key)) returnArr.push(e[key]);
        });

        return returnArr;
      },
      keys: function() {
        var keys = [];

        for (var prop in element) {
          keys.push(prop);
        }

        return keys;
      },
      values: function() {
        return this.keys().map(function(key) {
          return element[key];
        });
      },
      filterObj: function(callback, answer) {
        var returnObj = {};

        this.keys().forEach(function(key) {
          if (callback(key) === answer) returnObj[key] = element[key];
        });

        return returnObj;
      },
      pick: function(str) {
        var strs = [].slice.call(arguments);
        return this.filterObj(strs.includes.bind(strs), true);
      },
      omit: function(str) {
        var strs = [].slice.call(arguments);
        return this.filterObj(strs.includes.bind(strs), false);
      },
      has: function(str) {
        return this.keys().includes(str);
      },

    };

    (["Element", "Array", "Object", "Function", 
        "Boolean", "String", "Number"]).forEach(function(method) {
      u["is" + method] = function() {_["is" + method].call(u, element)};
    });

    return u;
  };

  _.range = function(num1, num2) {
    var arr = [];

    if (num2 === undefined) {
      if (num1 === undefined) return;
      num2 = +num1;
      num1 = 0;
    } else if (num2 < num1) {
      [num1, num2] = [num2, num1];
    }
    for (var i = num1; i < num2; i += 1) {
      arr.push(i);
    }
    return arr;
  };

  _.extend = function(obj) {
    if (arguments.length <= 1) return obj;
    var args = [].slice.call(arguments);
    var argLast = args.pop();
    var argExtend = args[args.length - 1];

    for (var prop in argLast) {
      argExtend[prop] = argLast[prop];
    }

    return _.extend.apply(this, args);
  }

  _.isElement = function(obj) {
    return obj && obj.nodeType === 1
  };

  _.isArray = Array.isArray || function(obj) {
    return toString.call(obj) === "[object Array]";
  };

  _.isObject = function(obj) {
    var type = typeof obj;
    return type === "function" || type === "object" && !!obj;
  };

  _.isFunction = function(obj) {
    var type = typeof obj;
    return type === "function";
  };

  (["Boolean", "String", "Number"]).forEach(function(method) {
    _["is" + method] = function(obj) {
      return toString.call(obj) === "[object " + method + "]";
    };
  });

  window._ = _;
})();
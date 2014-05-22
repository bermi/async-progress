var asyncProgess = require("./")({
  async: require("async"),
  multimeter: require("multimeter")
}),
  tasks,
  emptyFn = function () {};


tasks = {
  one: function one(callback) {
    setTimeout(callback, 1000);
  },
  two: ["one", function two(callback) {
    setTimeout(callback, 1000);
  }],
  three: ["two", function three(callback) {
    setTimeout(callback, 2000);
  }],
  two_and_a_half: ["one", function two_and_a_half(callback) {
    setTimeout(callback, 1300);
  }]
};

asyncProgess.auto(tasks, emptyFn).multimeter("Test A", process);

setTimeout(function () {
  asyncProgess.auto(tasks, emptyFn).multimeter("Test B", process);
}, 1000);


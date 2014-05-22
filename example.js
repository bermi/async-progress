
var
  asyncProgess = require("async-progress")({
    async: require("async"),
    multimeter: require("multimeter")
  });

asyncProgess.auto({
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
}, function () {
  console.log("done");
})

.on("progress", function (progress) {
  // implement your own progress bar
})

// Or use multimeter
.multimeter("Test A", process);

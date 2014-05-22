# async-progress

[![Build Status](https://secure.travis-ci.org/bermi/async-progress.png?branch=master)](http://travis-ci.org/bermi/async-progress)

This small module with zero dependencies wraps a [async](https://github.com/caolan/async) methods
with progress tracking events.

So far supported [async](https://github.com/caolan/async) events are:

- [async.auto](https://github.com/caolan/async#auto)

Additionally it supports CLI progress bars by passing the
the [multimeter](https://github.com/substack/node-multimeter) module
via dependency injection.

## Installation

    npm install async-progress --save

## Usage

    var
      asyncProgess = require("async-progress")({
        async: require("async"),
        multimeter: require("multimeter") // optional for CLI progress bars
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


## License

MIT

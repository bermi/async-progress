var events = require("events"),
  multi,
  multimeterCount = 0,
  pendingProgess = 0;

function loadMultimeter(multimeter, target) {
  target = target || process;
  if (multi) {
    return multi;
  }
  multi = multimeter(target);
  multi.on("^C", process.exit);
  multi.charm.reset();
  return multi;
}

function progress(options) {
  var originalAuto = options.async.auto;

  options.async.auto = function () {
    var steps = arguments[0],
      callback = arguments[1],
      step, name,
      wrapCallback,
      callbackCount = 0,
      wrappedSteps = {},
      eventEmitter = new events.EventEmitter();

    wrapCallback = function (originalCallback) {

      callbackCount += 1;

      return function _processWrappedCallback() {
        eventEmitter.emit("progress", Math.round(100 / callbackCount));
        callbackCount -= 1;
        var args = Array.prototype.slice.call(arguments);
        originalCallback.apply(originalCallback, args);
      };
    };

    for (name in steps) {
      if (steps.hasOwnProperty(name)) {
        step = steps[name];
        if (Array.isArray(step)) {
          wrappedSteps[name] = step.slice(0, step.length - 1)
            .concat(wrapCallback(step[step.length - 1]));
        } else {
          wrappedSteps[name] = wrapCallback(step);
        }
      }
    }

    eventEmitter.result = originalAuto.apply(null, [wrappedSteps, wrapCallback(callback)]);

    eventEmitter.multimeter = function (name, target, barOptions) {

      if (!options.multimeter) {
        throw new Error("Missing multimeter module");
      }
      loadMultimeter(options.multimeter, target);
      multimeterCount += 1;

      var
      label = name + ": \n",
        bar;

      multi.write(label);

      bar = multi.rel(label.length + 1, multimeterCount, barOptions || {
        width: 50,
        solid: {
          text: "\u2588",
          foreground: 'blue',
        },
        empty: {
          text: ' '
        }
      });


      bar.percent(0);
      pendingProgess += 1;

      eventEmitter.on("progress", function (progress) {
        bar.percent(progress);
        if (progress === 100) {
          pendingProgess -= 1;
          if (pendingProgess === 0) {
            multi.destroy();
            multi.write("\nAll done.\n");
          }
        }
      });

      return multi;
    };

    return eventEmitter;
  };

  return options.async;
}

module.exports = progress;
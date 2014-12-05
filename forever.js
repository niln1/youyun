  var forever = require('forever-monitor');

  var child = new (forever.Monitor)('dot.js', {});

  child.on('exit', function () {
    console.log('Dot has exited after 10 restarts');
  });

  child.start();
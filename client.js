/**
 * Created by Jussi on 29.11.2014.
 */
var net = require("net");
var readline = require("readline");

var clientName = "jussi";

var client = net.connect(15000, "future.etjump.com", function () {
  rl.on("line", function (line) {
    var tokens = line.split(" ");
    if (tokens[0] && tokens[0] === "/name") {
      clientName = line.substr(line.indexOf(tokens[0]) + tokens[0].length + 1);
    } else {
      client.write(clientName + "^7: ^2" + line);
    }
  });
});

client.on("data", function (data) {
  console.log(data.toString());
});

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


/**
 * Created by Jussi on 29.11.2014.
 */

var logParser = require("et-log-parser");
var net = require("net");
var _ = require("lodash");
var dgram = require("dgram");
var fs = require("fs");
var util = require("./util")
var async = require("async");
var irc = require("irc");

var config = JSON.parse(fs.readFileSync("config.json"));
var getStatusPacket = new Buffer("\xff\xff\xff\xffgetstatus", "binary");
var servers;

var nextId = 0;

/**
 * Get the server names / other information
 */
async.map(config.servers, function (server, callback) {
    addRequiredProperties(server);
    var client = dgram.createSocket("udp4");
    client.on("message", function (message, rinfo) {
      callback(null, _.extend(server,
        {
          status: message.toString()
        }));
    });
    client.send(getStatusPacket, 0, getStatusPacket.length, server.port, server.address);

  },
  function (err, results) {
    if (err) {
      throw err;
    }

    servers = results;
    parseStatuses(servers);
    createLogWatchers(servers);
    setInterval(function () {
      _.each(servers, function (server) {

        if (server.udpPacketQueue.length > 0) {
          var packet = server.udpPacketQueue.shift();
          server.client.send(packet, 0, packet.length, server.port, server.address);
        }
      });
    }, 510);
  });

/**
 * Adds necessary properties to the server.
 * Properties:
 * id,
 * udpPacketQueue,
 *
 * @param server
 */
function addRequiredProperties(server) {
  server.id = nextId;
  nextId += 1;
  server.udpPacketQueue = [];
  server.client = dgram.createSocket("udp4");
}

/**
 * Parses server statuses and gets the server name.
 * @param servers
 */
function parseStatuses(servers) {
  _.each(servers, function (server) {
    var rows = server.status.split("\n");
    var keys = rows[1].split("\\");
    server.name = keys[keys.indexOf("sv_hostname") + 1];
  });
}

/**
 * Creates log watchers for each server
 */
function createLogWatchers(servers) {
  _.each(servers, function (server) {
    server.parser = logParser.LogWatcher({
      file: server.logFile,
      parseChat: true
    });

    server.parser.on("message", function (message) {
      var buf = util.escapeString(message.name + "^7@" + server.name + "^7:^2 " + message.message);
      var packet = new Buffer("\xff\xff\xff\xffrcon " + server.rconPassword + " qsay \"" + buf + "\"", "binary");
      _.each(servers, function (otherServer) {
        if (server.id !== otherServer.id) {
          otherServer.udpPacketQueue.push(packet);
        }
      });
    });
  });
}
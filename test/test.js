/**
 * Created by Jussi on 29.11.2014.
 */
var util = require("../util");
var expect = require("expect.js");

describe("Util", function () {
  describe("Escape", function () {
    it("should return an empty string if no string is passed", function () {
      var escaped = util.escapeString();
      expect(escaped).to.not.be(undefined);
      expect(escaped).to.contain("");
      expect(escaped.length).to.be(0);
    });

    it("should return an empty string if an empty string is passed", function () {
      var escaped = util.escapeString("");
      expect(escaped).to.not.be(undefined);
      expect(escaped).to.contain("");
      expect(escaped.length).to.be(0);
    });

    it("should return an empty string if all characters need to be escaped", function () {
      var escaped = util.escapeString(";;\"\"");
      expect(escaped).to.not.be(undefined);
      expect(escaped).to.contain("");
      expect(escaped.length).to.be(0);
    });

    it("should escape the string", function () {
      var escaped = util.escapeString("\";quit");
      expect(escaped).to.not.be(undefined);
      expect(escaped).to.contain("quit");
    });
  });
});
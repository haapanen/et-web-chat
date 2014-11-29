/**
 * Created by Jussi on 29.11.2014.
 */

var notAllowedCharacters = [
  34,
  59,
  92
];

function escapeString(str) {
  if (!str) {
    return "";
  }

  var i, len, escaped = "", char;
  for (i = 0, len = str.length; i < len; i++) {
    char = str[i].charCodeAt(0);
    if (char >= 32 && char < 127 && notAllowedCharacters.indexOf(char) === -1) {
      escaped += str[i];
    }
  }

  return escaped;
}

exports.escapeString = escapeString;
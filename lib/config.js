var path = require('path'),
    extend = require('xtend')

var HOME = process.env.HOME || process.env.USERPROFILE,
    CWD = process.cwd()

var file = '.npmm.json'

module.exports = load_config

function load_config(_home, _cwd) {
  var home = _home || HOME,
      cwd = _cwd || CWD,
      global_config,
      local_config

  try {
    local_config = require(path.resolve(cwd, file))
  } catch(e) {
    local_config = {}
  }

  try {
    global_config = require(path.resolve(home, file))
  } catch(e) {
    global_config = {}
  }

  return extend(local_config, global_config)
}

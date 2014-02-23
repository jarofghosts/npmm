var fs = require('fs'),
    path = require('path'),
    FILE = path.join(process.cwd(), 'package.json')

module.exports.update = write_package
module.exports.get = get_package
module.exports.setup = setup_package

function get_package() {
  try {
    return require(FILE)
  } catch(err) {
    return {}
  }
}

function write_package(registry, packages, cb) {
  var package = get_package()

  var registry_packages = package['dependencies@' + registry] || {},
      dependencies = package.dependencies,
      package_name

  for (var i = 0, l = packages.length; i < l; ++i) {
    package_name = packages[i]

    registry_packages[package_name] = dependencies[package_name]
    delete dependencies[package_name]
  }

  if (!package['dependencies@' + registry]) {
    package['dependencies@' + registry] = registry_packages
  }

  do_write(package, cb)
}

function setup_package() {
  var SETUP_STRING = 'npmm i --skipdefaults',
      PRE_STRING = 'npm i npmm && '

  var package = get_package(),
      scripts = package.scripts,
      postinstall


  if (!scripts) scripts = {}
  postinstall = scripts.postinstall || ''
  postinstall = postinstall.replace(PRE_STRING, '').replace(SETUP_STRING, '')

  if (!package.dependencies.npmm) SETUP_STRING = PRE_STRING + SETUP_STRING
  postinstall = SETUP_STRING + (postinstall.length ? ' && ' + postinstall : '')

  scripts.postinstall = postinstall

  do_write(package)
}

function do_write(package, _cb) {
  var cb = _cb || noop

  fs.writeFile(FILE, JSON.stringify(package, null, 2) + '\n', cb)
}

function noop() {}
var fs = require('fs'),
    path = require('path'),
    FILE = path.join(process.cwd(), 'package.json')

module.exports = write_package

function write_package(registry, packages, _cb) {
  var package = require(FILE),
      registry_packages = package['dependencies@' + registry] || {},
      cb = _cb || noop,
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

  fs.writeFile(FILE, JSON.stringify(package, null, 2) + '\n', cb)
}

function noop() {}

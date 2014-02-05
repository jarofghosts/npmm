var spawn = require('child_process').spawn,
    color = require('bash-color'),
    path = require('path')

var write_package = require('./lib/write-package')

module.exports = npmm

function npmm(_args, _dir, _exec_npm) {
  var exec_npm = _exec_npm || default_exec_npm,
      is_npmm_save = /(--save|-S)@(.*?)$/,
      args = (_args || []).slice(2),
      dir = _dir || process.cwd(),
      to_registry = null,
      packages = [],
      skip_defaults

  if (args.indexOf('install') === -1 && args.indexOf('i') === -1 &&
      args.indexOf('isntall') === -1) {
    return exec_npm(args)
  }

  skip_defaults = args.indexOf('--skipdefaults')

  if (skip_defaults > -1) {
    args.splice(skip_defaults, 1)
  }

  skip_defaults = !!++skip_defaults

  if (args.length === 1) return filter_package()

  for (var i = 0, l = args.length; i < l; ++i) {
    to_registry = args[i].match(is_npmm_save)
    if (to_registry) {
      to_registry = to_registry[2]
      break
    }
  }

  if (!to_registry) return exec_npm(args)

  args.splice(i, 1)
  packages = args.slice()

  args = args.concat(['--save', '--registry', to_registry])
  exec_npm(args, update_package)

  function update_package() {
    write_package(to_registry, packages)
  }

  function filter_package() {
    var package = require(path.join(dir, 'package.json')),
        keys = Object.keys(package),
        is_npmm = /^dependencies@/,
        has_standard = false,
        registries = [],
        key

    for (var i = 0, l = keys.length; i < l; ++i) {
      key = keys[i]

      if (key === 'dependencies') has_standard = true
      if (is_npmm.test(key)) {
        registries.push(key.slice(13)) // === 'dependencies@'.length
      }
    }

    if (!registries.length) {
      return exec_npm(args)
    }

    if (has_standard && !skip_defaults) {
      process.stdout.write('npmm ' +
          color.yellow('grabbing standard dependencies') + '\n\n')
      return exec_npm(args, get_from_registry)
    }

    get_from_registry()

    function get_from_registry() {
      var registry = registries.shift(),
          packages = package['dependencies@' + registry],
          to_install = Object.keys(packages).map(to_installable)

      process.stdout.write('\n\nnpmm ' +
          color.yellow('grabbing dependencies from ') + color.cyan(registry) +
          '\n\n')
      exec_npm(
          args.concat(to_install).concat(['--registry', registry]),
          registries.length ? get_from_registry : noop
      )

      function to_installable(value) {
        return value + '@' + packages[value]
      }
    }
  }

  function default_exec_npm(npm_args, _cb) {
    var cb = _cb || noop,
        npm

    npm = spawn('npm', npm_args, { stdio: 'inherit' })
    npm.on('close', cb)

    return npm
  }
}

function noop() {}

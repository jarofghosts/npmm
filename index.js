var spawn = require('child_process').spawn,
    color = require('bash-color'),
    split = require('split'),
    write_package = require('./lib/write-package'),
    path = require('path')

module.exports = npmm

function npmm(_args) {
  var args = (_args || []).slice(2),
      is_npmm_save = /(--save|-S)@(.*?)$/,
      packages = [],
      save_command = 0,
      to_registry = null

  if (args.indexOf('install') === -1 && args.indexOf('i') === -1 &&
      args.indexOf('isntall') === -1) {
    return exec_npm(args)
  }

  if (args.length === 1) return filter_package()

  for (var i = 0, l = args.length; i < l; ++i) {
    to_registry = args[i].match(is_npmm_save)
    if (to_registry) {
      save_command = i
      to_registry = to_registry[2]
      break
    }
  }

  if (!to_registry) return exec_npm(args)
  args.splice(i, 1)
  packages = args.slice(0)

  args = args.concat(['--save', '--registry', to_registry])
  exec_npm(args, do_write)

  function do_write() {
    write_package(to_registry, packages)
  }

  function filter_package() {
    var package = require(path.join(process.cwd(), 'package.json')),
        is_npmm = /^dependencies@/,
        keys = Object.keys(package),
        has_standard = false,
        registries = []

    for (var i = 0, l = keys.length; i < l; ++i) {
      var key = keys[i],
          registry

      if (key === 'dependencies') has_standard = true
      if (is_npmm.test(key)) {
        registry = key.replace(is_npmm, '')
        registries.push(registry)
      }
    }

    if (!registries.length) {
      return exec_npm(args)
    }

    if (has_standard) {
      process.stdout.write('npmm ' +
          color.yellow('grabbing standard dependencies...') + '\n\n')
      return exec_npm(args, get_from_registry)
    }

    get_from_registry()

    function get_from_registry() {
      if (!registries.length) return

      var registry = registries.shift(),
          packages = package['dependencies@' + registry],
          to_install = Object.keys(packages).map(to_installable)

      process.stdout.write('\n\nnpmm ' +
          color.yellow('grabbing dependencies from ') + color.cyan(registry) +
          '\n\n')
      exec_npm(
          args.concat(to_install).concat(['--registry', registry]),
          get_from_registry
      )

      function to_installable(value) {
        return value + '@' + packages[value]
      }
    }
  }

  function exec_npm(npm_args, _cb) {
    var cb = _cb || noop,
        npm

    npm = spawn('npm', npm_args, { stdio: 'inherit' })
    npm.on('close', cb)

    return npm
  }
}

function noop() {}

var spawn = require('child_process').spawn
  , color = require('bash-color')
  , path = require('path')

var package_json = require('./lib/package-json')

var write_package = package_json.update
  , setup_package = package_json.setup
  , load_config = require('./lib/config')

module.exports = npmm

function npmm(_args, _dir, _exec_npm) {
  var exec_npm = _exec_npm || default_exec_npm
    , is_npmm_save = /(--save|-S)@(.*?)$/
    , args = (_args || []).slice(2)
    , dir = _dir || process.cwd()

  var config = load_config(null, dir)
    , to_registry = null
    , packages = []

  var registry_location
    , skip_defaults

  if (args.indexOf('--dosetup') > -1 || args.indexOf('-!') > -1) {
    return setup_package()
  }

  if (args.indexOf('install') === -1 && args.indexOf('i') === -1 &&
      args.indexOf('isntall') === -1) {
    return exec_npm(args)
  }

  skip_defaults = args.indexOf('--skipdefaults')

  if (skip_defaults > -1) args.splice(skip_defaults, 1)

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
  registry_location = to_registry

  if (config.registries && config.registries[to_registry]) {
    registry_location = config.registries[to_registry]
  }

  args = args.concat(['--save', '--registry', registry_location])

  exec_npm(args, update_package)

  function update_package() {
    write_package(to_registry, packages)
  }

  function filter_package() {
    var package = require(path.join(dir, 'package.json'))
      , keys = Object.keys(package)
      , is_npmm = /^dependencies@/
      , has_standard = false
      , registries = []
      , key

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
      if (!config.quiet) {
        process.stdout.write(
            'npmm ' + color.yellow('grabbing standard dependencies') + '\n\n'
        )
      }

      return exec_npm(args, get_from_registry)
    }

    get_from_registry()

    function get_from_registry() {
      var registry = registries.shift()
        , packages = package['dependencies@' + registry]
        , to_install = Object.keys(packages).map(to_installable)

      if (config.registries && config.registries[registry]) {
        registry = config.registries[registry]
      }

      if (!config.quiet) {
        process.stdout.write(
            '\n\nnpmm ' + color.yellow('grabbing dependencies from ') +
            color.cyan(registry) + '\n\n'
        )
      }

      exec_npm(
          args.concat(to_install).concat(['--registry', registry])
        , registries.length ? get_from_registry : noop
      )

      function to_installable(package_name) {
        return package_name + '@' + packages[package_name]
      }
    }
  }

  function default_exec_npm(npm_args, _cb) {
    var cb = _cb || noop
      , npm

    npm = spawn(config.npm || 'npm', npm_args, {stdio: 'inherit'})
    npm.on('close', cb)

    return npm
  }
}

function noop() {}

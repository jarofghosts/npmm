var assert = require('assert'),
    npmm = require('../'),
    load_config = require('../lib/config')

// tests of npmm base package

npmm([null, null, 'my', 'little', 'pony'], null, check_no_change)

function check_no_change(args) {
  assert.deepEqual(args, ['my', 'little', 'pony'])
}

var package_run = 0

npmm([null, null, 'install'], __dirname, check_package_read)

function check_package_read(args, next) {
  package_run++
  if (package_run === 1) {
    assert.deepEqual(
        ['install', 'fake-module@~1.2.3', '--registry', 'fake-place'],
        args
    )
    return next()
  }
  assert.deepEqual(
      ['install', 'faker-module@6.6.6', '--registry', 'location'],
      args
  )
}

npmm([null, null, 'install', 'fake-module', '--save@fake-place'], null,
    check_save_at)

function check_save_at(args) {
  assert.deepEqual(
      ['install', 'fake-module', '--save', '--registry', 'fake-place'],
      args
  )
}

var called = 0

npmm([null, null, 'install', '--skipdefaults'], __dirname, check_skip_defaults)

function check_skip_defaults() {
  called++
  assert.ok(called < 2)
}

npmm([null, null, 'install', 'fake-module', '--save@named'], __dirname,
    check_named_config)

function check_named_config(args) {
  assert.deepEqual(
      ['install', 'fake-module', '--save', '--registry', 'location'],
      args
  )
}

// tests of lib/config.js

var config_test

config_test = load_config(__dirname + '/nope', __dirname + '/nope')

assert.deepEqual(config_test, {})

config_test = load_config(__dirname, __dirname + '/nope')

assert.deepEqual(config_test,
  { npm: 'lol',
    quiet: true,
    registries: { 'named': 'location' }
  })

config_test = load_config(__dirname + '/fake_home', __dirname)

assert.deepEqual(config_test,
  { npm: 'hardyhar', npmm: 'lol', quiet: true,
    registries: { 'named': 'location' }
  })

config_test = load_config(__dirname, __dirname + '/fake_home')

assert.deepEqual(config_test,
  { npm: 'lol', npmm: 'lol', quiet: true,
    registries: { 'named': 'location' }
  })

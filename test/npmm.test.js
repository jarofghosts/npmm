var npmm = require('../')

var test = require('tape')

test('does not affect non-install commands', function(t) {

  npmm([null, null, 'my', 'little', 'pony'], null, check_no_change)

  function check_no_change(args) {
    t.deepEqual(args, ['my', 'little', 'pony'])
    t.end()
  }
})

test('installs modules from specified registries', function(t) {
  var package_run = 0

  npmm([null, null, 'install'], __dirname, check_package_read)

  function check_package_read(args, next) {
    package_run++
    if (package_run === 1) {
      t.deepEqual(
          ['install', 'fake-module@~1.2.3', '--registry', 'fake-place']
        , args
      )
      return next()
    }
    t.deepEqual(
        ['install', 'faker-module@6.6.6', '--registry', 'location']
      , args
    )
    t.end()
  }
})

test('supports saving to package.json', function(t) {
  npmm(
      [null, null, 'install', 'fake-module', '--save@fake-place']
    , null
    , check_save_at
  )

  function check_save_at(args) {
    t.deepEqual(
        ['install', 'fake-module', '--save', '--registry', 'fake-place']
      , args
    )

    t.end()
  }
})

test('skips default installation with --skipdefaults', function(t) {
  var called = 0

  npmm(
      [null, null, 'install', '--skipdefaults']
    , __dirname
    , check_skip_defaults
  )

  function check_skip_defaults() {
    called++
    t.ok(called < 2)

    t.end()
  }
})

test('named registries work', function(t) {
  npmm(
      [null, null, 'install', 'fake-module', '--save@named']
    , __dirname
    , check_named_config
  )

  function check_named_config(args) {
    t.deepEqual(
        ['install', 'fake-module', '--save', '--registry', 'location'],
        args
    )
    t.end()
  }
})

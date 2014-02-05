var assert = require('assert'),
    npmm = require('../')

npmm([null, null, 'my', 'little', 'pony'], null, check_no_change)

function check_no_change(args) {
  assert.deepEqual(args, ['my', 'little', 'pony'])
}

npmm([null, null, 'install'], __dirname, check_package_read)

function check_package_read(args) {
  assert.deepEqual(
      ['install', 'fake-module@~1.2.3', '--registry', 'fake-place'],
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

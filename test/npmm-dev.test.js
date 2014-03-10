var npmm = require('../')

var test = require('tape')

test('installs modules from specified registries', function(t) {
  var package_run = 0

  npmm([null, null, 'install'], __dirname, check_package_read)

  function check_package_read(args, next) {
    package_run++
    if (package_run === 1) {
      t.deepEqual(
          [
              'install'
            , 'fake-module@~1.2.3'
            , '--registry'
            , 'fake-place'
          ]
        , args
      )
      return next()
    }

    if (package_run === 2) {
      t.deepEqual(
          [
              'install'
            , 'faker-module@6.6.6'
            , '--registry'
            , 'location'
          ]
        , args
      )
      return next()
    }

    t.deepEqual(
        [
            'install'
          , 'dumb-thing@^4.4.4'
          , '--registry'
          , 'super-fake'
        ]
      , args
    )

    t.end()
  }
})

/*test('supports saving to package.json', function(t) {
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
})*/

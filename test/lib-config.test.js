var load_config = require('../lib/config')
  , test = require('tape')

test('works with no config files', function(t) {
  var config_test

  config_test = load_config(__dirname + '/nope', __dirname + '/nope')

  t.deepEqual(config_test, {})
  t.end()
})

test('loads local config with no global', function(t) {
  config_test = load_config(__dirname, __dirname + '/nope')

  t.deepEqual(
      config_test
    , {
          npm: 'lol'
        , quiet: true
        , registries: {'named': 'location'}
      }
  )

  t.end()
})

test('properly prioritizes local and global configs', function(t) {
  config_test = load_config(__dirname + '/fake_home', __dirname)

  t.deepEqual(
      config_test
    , {
          npm: 'hardyhar'
        , npmm: 'lol'
        , quiet: true
        , registries: {'named': 'location'}
      }
  )

  config_test = load_config(__dirname, __dirname + '/fake_home')

  t.deepEqual(
      config_test
    , {
          npm: 'lol'
        , npmm: 'lol'
        , quiet: true
        , registries: {'named': 'location'}
      }
  )
  t.end()
})

var package_json = require('../lib/package-json')
  , test = require('tape')

test('get returns blank object if file not found', function(t) {
  t.deepEqual(package_json.get('not-a-file'), {})
  t.end()
})

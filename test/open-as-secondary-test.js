'use strict'

const test = require('tape')
const leveldown = require('..')
const fs = require('fs')
const path = require('path')

// const tempy = require('tempy')
// tempy.directory()
const location = '/tmp/4fd554fd30a31ef8500768e9ffccbddd'
// const secondaryLocation = '/tmp/4fd554fd30a31ef8500768e9ffccbddd_secondary'

// This is used because it's not sufficient on windows to set a parent folder as readonly
function chmodRecursive (mode) {
  fs.readdirSync(location).forEach(function (file) {
    fs.chmodSync(path.join(location, file), mode)
  })
  fs.chmodSync(location, mode)
}

function factory (mode) {
  if (mode != null) chmodRecursive(mode)
  return leveldown(location)
}

test.only('openAsSecondary: test write to read/write database', function (t) {
  const db2 = factory()
  db2.openAsSecondary(function (err) {
    t.ifErr(err, 'no error from openAsSecondary()')
    db2.get('my key', function (err, value) {
      t.ifError(err, 'no error from get()')
      t.equal(value.toString(), 'my value', 'correct value')
      db2.close(t.end.bind(t))
    })
  })
})

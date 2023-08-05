'use strict'

const test = require('tape')
const leveldown = require('..')
const tempy = require('tempy')
const fs = require('fs')
const path = require('path')

const location = tempy.directory()
const secondaryLocation = tempy.directory()

// This is used because it's not sufficient on windows to set a parent folder as readonly
function chmodRecursive (mode) {
  fs.readdirSync(location).forEach(function (file) {
    fs.chmodSync(path.join(location, file), mode)
  })
  fs.chmodSync(location, mode)
}

function factory (mode) {
  if (mode != null) chmodRecursive(mode)
  return leveldown(location, secondaryLocation)
}

test('openAsSecondary: test write to read/write database', function (t) {
  const db = factory()

  db.open(function (err) {
    t.ifError(err, 'no error from open()')

    db.put('my key', 'my value', function (err) {
      t.ifError(err, 'no error from put()')
      db.get('my key', function (err, value) {
        t.ifError(err, 'no error from get()')
        t.equal(value.toString(), 'my value', 'correct value')
        db.close(t.end.bind(t))
      })
    })
  })
  db.openAsSecondary(function (err) {
    t.ifErr(err, 'no error from openAsSecondary()')
    db.get('my key', function (err, value) {
      t.ifError(err, 'no error from get()')
      t.equal(value.toString(), 'my value', 'correct value')
      db.close(t.end.bind(t))
    })
  })
})

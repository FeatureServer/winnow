const test = require('tape')
const normalizeDateFields = require('../../lib/normalize-query-options/date-fields')

test('normalize-query-options, date-fields: undefined metadata', t => {
  t.plan(1)

  const normalized = normalizeDateFields()
  t.deepEquals(normalized, [])
})

test('normalize-query-options, date-fields: undefined metadata.fields', t => {
  t.plan(1)

  const normalized = normalizeDateFields({})
  t.deepEquals(normalized, [])
})

test('normalize-query-options, date-fields: metadata.fields are empty array', t => {
  t.plan(1)

  const normalized = normalizeDateFields({ fields: [] })
  t.deepEquals(normalized, [])
})

test('normalize-query-options, date-fields: requestedFields undefined', t => {
  t.plan(1)

  const normalized = normalizeDateFields({
    metadata: {
      fields: [
        { name: 'hello', type: 'Date' },
        { name: 'world', type: 'String' }
      ]
    }
  })
  t.deepEquals(normalized, ['hello'])
})

test('normalize-query-options, date-fields: requestedFields defined', t => {
  t.plan(1)

  const normalized = normalizeDateFields({
    metadata: {
      fields: [
        { name: 'hello', type: 'Date' },
        { name: 'world', type: 'String' },
        { name: 'foo', type: 'String' }
      ]
    }
  }, ['hello', 'foo'])
  t.deepEquals(normalized, ['hello'])
})

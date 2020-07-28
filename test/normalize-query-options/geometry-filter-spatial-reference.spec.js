const test = require('tape')
const normalizeGeometryFilterSpatialReference = require('../../lib/normalize-query-options/geometry-filter-spatial-reference')

test('normalize-query-options, geometry-filter-spatial-reference: undefined input', t => {
  t.plan(1)
  const spatialRef = normalizeGeometryFilterSpatialReference()
  t.equal(spatialRef, 'EPSG:4326')
})

test('normalize-query-options, geometry-filter-spatial-reference: undefined options', t => {
  t.plan(1)
  const spatialRef = normalizeGeometryFilterSpatialReference({})
  t.equal(spatialRef, 'EPSG:4326')
})

test('normalize-query-options, geometry-filter-spatial-reference: defer to geometry filter', t => {
  t.plan(1)
  const options = {
    geometry: {
      spatialReference: {
        wkid: 4326
      }
    },
    inSR: '4269'
  }
  const spatialRef = normalizeGeometryFilterSpatialReference(options)
  t.equal(spatialRef, 'EPSG:4326')
})

test('normalize-query-options, geometry-filter-spatial-reference: inSR string', t => {
  t.plan(1)
  const options = { inSR: '4269' }
  const spatialRef = normalizeGeometryFilterSpatialReference(options)
  t.equal(spatialRef, 'EPSG:4269')
})

test('normalize-query-options, geometry-filter-spatial-reference: inSR spatialReference object', t => {
  t.plan(1)
  const options = { inSR: { wkid: 4269 } }
  const spatialRef = normalizeGeometryFilterSpatialReference(options)
  t.equal(spatialRef, 'EPSG:4269')
})

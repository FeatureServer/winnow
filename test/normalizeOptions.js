const test = require('tape')
const { normalizeInSR } = require('../src/options/normalizeOptions')

test('normalize input SR with geometry.wkt string', t => {
  t.plan(1)
  const options = {
    geometry: {
      xmin: 0,
      ymin: 0,
      xmax: 1,
      ymax: 1,
      spatialReference: {
        wkt: 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-6.828007551173374],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]'
      }
    }
  }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:3857')
})

test('normalize input SR with geometry.latestWkid', t => {
  t.plan(1)
  const options = { geometry: { xmin: 0, ymin: 0, xmax: 1, ymax: 1, spatialReference: { latestWkid: 4269 } } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4269')
})

test('normalize input SR with geometry.wkid', t => {
  t.plan(1)
  const options = { geometry: { xmin: 0, ymin: 0, xmax: 1, ymax: 1, spatialReference: { wkid: 4269 } } }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4269')
})

test('normalize input SR with inSR EPSG string', t => {
  t.plan(1)
  const options = { inSR: 'EPSG:4269' }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4269')
})

test('normalize input SR with inSR string', t => {
  t.plan(1)
  const options = { inSR: '4269' }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4269')
})

test('normalize input SR with inSR integer', t => {
  t.plan(1)
  const options = { inSR: 4269 }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4269')
})

test('normalize input SR with undefined inSR', t => {
  t.plan(1)
  const options = { }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:4326')
})

test('normalize input SR with inSR=102100', t => {
  t.plan(1)
  const options = { inSR: 102100 }
  const inSR = normalizeInSR(options)
  t.equal(inSR, 'EPSG:3857')
})

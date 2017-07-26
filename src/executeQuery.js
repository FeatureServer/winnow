'use strict'
const sql = require('./sql')
const Query = require('./query')
const { calculateClassBreaks, calculateUniqueValues } = require('./generateBreaks/breaks')
const _ = require('lodash')

function breaksQuery (features, query, options) {
  const queriedData = standardQuery(features, query, options)
  if (queriedData === undefined || queriedData.features === undefined) throw new Error('query resposne undefined')
  if (queriedData.features.length === 0) throw new Error('need features in order to classify')

  try {
    const classification = options.classificationDef
    if (classification.type === 'classBreaksDef') {
      return calculateClassBreaks(queriedData.features, classification)
    } else if (classification.type === 'uniqueValueDef') {
      const { options, query } = calculateUniqueValues(queriedData.features, classification)
      return aggregateQuery(features, query, options)
    } else throw new Error('unacceptable classification type: ', classification.type)
  } catch (e) { console.log(e) }
}

function aggregateQuery (features, query, options) {
  const params = Query.params(features, options)
  const filtered = sql(query, params)
  return finishQuery(filtered, options)
}

function limitQuery (features, query, options) {
  const filtered = []
  features.some((feature, i) => {
    const result = processQuery(feature, query, options, i)
    if (result) filtered.push(result)
    return filtered.length === options.limit
  })
  return finishQuery(filtered, options)
}

function standardQuery (features, query, options) {
  const filtered = features.reduce((filteredFeatures, feature, i) => {
    const result = processQuery(feature, query, options, i)
    if (result) filteredFeatures.push(result)
    return filteredFeatures
  }, [])
  return finishQuery(filtered, options)
}

function processQuery (feature, query, options, i) {
  const params = Query.params([feature], options)
  const result = sql(query, params)[0]

  if (result && options.toEsri) return esriFy(result, options, i)
  else return result
}

function esriFy (result, options, i) {
  if (options.dateFields.length) {
    // mutating dates has down stream consequences if the data is reused
    result.attributes = _.cloneDeep(result.attributes)
    options.dateFields.forEach(field => {
      result.attributes[field] = new Date(result.attributes[field]).getTime()
    })
  }

  const metadata = (options.collection && options.collection.metadata) || {}
  if (!metadata.idField) {
    result.attributes.OBJECTID = i
  }
  return result
}

function finishQuery (features, options) {
  if (options.groupBy) {
    return features
  } else if (options.aggregates) {
    return features[0]
  } else if (options.collection) {
    const collection = options.collection
    collection.features = features
    return collection
  } else {
    return features
  }
}

module.exports = { breaksQuery, aggregateQuery, limitQuery, standardQuery, finishQuery }
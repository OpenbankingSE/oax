const schemaBundler = require('json-schema-bundler')
const yaml = require('yaml-js')
const axios = require('axios')
const circularJson = require('circular-json')
const compactJson = require('json-stringify-pretty-compact')
const fs = require('fs')
const { URL } = require('url');
global.URL = URL

const url = 'https://raw.githubusercontent.com/OpenbankingSE/openapi-directory-lite/master/specs/developer.berlin-group.com/psd2-api%201.2%20Update%202018-08-17.yaml'
const schema = new schemaBundler.Schema(url, null, yaml.load, axios.get)

schema.load().then(() => {
  schema.bundle()
  schema.deref(true, true)
  delete schema.bundled.definitions['http:']
  fs.writeFileSync('assets/data/swagger-schema.json', compactJson(JSON.parse(circularJson.stringify(schema.bundled)), {maxLength: 120}))
}).catch(err => console.log(err))

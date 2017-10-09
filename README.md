# fastify-static [![Build Status](https://travis-ci.org/fastify/fastify-static.svg?branch=master)](https://travis-ci.org/fastify/fastify-static) [![Greenkeeper badge](https://badges.greenkeeper.io/fastify/fastify-static.svg)](https://greenkeeper.io/) [![Known Vulnerabilities](https://snyk.io/test/github/fastify/fastify-static/badge.svg)](https://snyk.io/test/github/fastify/fastify-static)

Plugin for serving static file

## What does this forked version changed
- scan the folder and register each file separately. (Instead of `{prefix}/*`)
- let system 404 handler handle the ** NOT FOUND ** situation

## Install

`npm install --save fastify-static-xh`

## Usage

```js
const fastify = require('fastify')
const path = require('path')

fastify.register(require('fastify-static-xh'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/' // optional: default '/'
})

fastify.get('/another/path', function (req, reply) {
  reply.sendFile('myHtml.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
})

```

## License

Licensed under [MIT](./LICENSE)

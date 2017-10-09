'use strict'

const glob = require('glob')
const statSync = require('fs').statSync
const send = require('send')
const fp = require('fastify-plugin')

function getDirFiles (src) {
  return new Promise(function (resolve, reject) {
    glob(`**/*`, {nodir: true, cwd: src}, (err, files) => {
      if (err) {
        return reject(err)
      }
      resolve(files)
    })
  })
}

async function plugin (fastify, opts, next) {
  const error = checkOptions(opts)
  if (error instanceof Error) {
    return next(error)
  }
  const {root, prefix = ''} = opts
  try {
    const files = await getDirFiles(root)
    files.forEach(filePath => {
      const route = `${prefix}/${filePath}`.replace(/\/\//g, '/')
      fastify.get(route, function (req, reply) {
        pumpSendToReply(req, reply, filePath)
      })
      if (filePath.match(/index\.html$/)) {
        fastify.get(route.replace(/index\.html$/, ''), function (req, reply) {
          pumpSendToReply(req, reply, filePath)
        })
      }
    })
  } catch (err) {
    return next(err)
  }

  fastify.decorateReply('sendFile', function (filePath) {
    pumpSendToReply(this._req, this, filePath)
  })

  function pumpSendToReply (req, reply, pathname) {
    const sendStream = send(req, pathname, {root})

    sendStream.on('error', err => { throw err })

    sendStream.pipe(reply.res)
  }
  next()
}

function checkOptions (opts) {
  if (typeof opts.root !== 'string') {
    return new Error('"root" option is required')
  }
  let rootStat
  try {
    rootStat = statSync(opts.root)
  } catch (e) {
    return e
  }
  if (!rootStat.isDirectory()) {
    return new Error('"root" option must be an absolute path')
  }
}

module.exports = fp(plugin)

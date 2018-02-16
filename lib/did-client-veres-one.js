/*
 * Copyright (c) 2018 Veres One Project. All rights reserved.
 */
(function(global) {

'use strict';

const Injector = require('./Injector');
const util = require('./util');

// determine if using node.js or browser
const _nodejs = (
  typeof process !== 'undefined' && process.versions && process.versions.node);
const _browser = !_nodejs &&
  (typeof window !== 'undefined' || typeof self !== 'undefined');

/**
 * Attaches the API to the given object.
 *
 * @param api the object to attach the API to.
 */
function wrap(api) {

const injector = new Injector();

const _env = {
  dev: {hostname: 'genesis.veres.one.localhost:42443'},
  test: {hostname: 'testnet.veres.one'},
  live: {hostname: 'veres.one'}
};

/* Core API */

/**
 * Send an operation to a Veres One ledger node.
 */
api.send = util.callbackify(async function({
  operation,
  hostname = env in _env ? _env[env].hostname : null,
  env = 'dev'
}) {
  if(!(env in _env)) {
    throw new Error('"env" must be "dev", "test", or "live".');
  }

  if(!hostname) {
    throw new Error('"hostname" must be a non-empty string.');
  }

  const https = require('https');
  const agent = new https.Agent({rejectUnauthorized: false});
  const ledgerAgentsUrl = `https://${hostname}/ledger-agents`;

  const r2 = injector.use('r2');
  const ledgerAgentRes = await r2({
    url: ledgerAgentsUrl,
    method: 'GET',
    agent: (env === 'dev') ? agent : undefined,
    headers: {
      'accept': 'application/ld+json, application/json'
    }
  }).json;
  const ledgerAgent = ledgerAgentRes.ledgerAgent[0];
  const createDdocRes = await r2({
    url: ledgerAgent.service.ledgerOperationService,
    method: 'POST',
    agent: (env === 'dev') ? agent : undefined,
    json: operation,
    headers: {
      'accept': 'application/ld+json, application/json'
    }
  }).response;

  return createDdocRes;
});

// expose injector API
api.use = injector.use.bind(injector);

} // end wrap

// used to generate a new API instance
const factory = function() {
  return wrap(function() {return factory();});
};
wrap(factory);

if(_nodejs) {
  // export nodejs API
  module.exports = factory;
} else if(typeof define === 'function' && define.amd) {
  // export AMD API
  define([], function() {
    return factory;
  });
} else if(_browser) {
  // export simple browser API
  if(typeof global.didcv1 === 'undefined') {
    global.didcv1 = {};
  }
  wrap(global.didcv1);
}

})(typeof window !== 'undefined' ? window : this);

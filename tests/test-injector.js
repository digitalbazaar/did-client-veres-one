'use strict';

const contexts = {
  'https://w3id.org/veres-one/v1': require('veres-one-context')
};
const Injector = require('../lib/Injector');
const injector = new Injector();

// FIXME: determine how to simplify/move this code out of test
const jsonld = injector.use('jsonld');
const documentLoader = jsonld.documentLoader;

jsonld.documentLoader = async url => {
  if(url in contexts) {
    return {
      contextUrl: null,
      documentUrl: url,
      document: contexts[url]
    };
  }
  return documentLoader(url);
};
injector.use('jsonld', jsonld);

injector.env = {nodejs: true};

module.exports = injector;

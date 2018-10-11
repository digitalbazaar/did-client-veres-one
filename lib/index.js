/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const tls = require('tls');
tls.DEFAULT_ECDH_CURVE = 'auto';

// const Injector = require('./Injector');
// const injector = new Injector();

// injector.env = {nodejs: true};

// const VeresOneClient = require('./client.js');

// module.exports = {
//   injector,
//   use: (name, injectable) => injector.use(name, injectable),
//   client: (options) => {
//     return new VeresOneClient({injector, ...options});
//   }
// };

module.exports = require('./client.js');

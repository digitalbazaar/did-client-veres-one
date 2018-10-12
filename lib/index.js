/*!
 * Copyright (c) 2018 Veres One Project. All rights reserved.
 */
'use strict';

const tls = require('tls');
tls.DEFAULT_ECDH_CURVE = 'auto';

module.exports = require('./client.js');

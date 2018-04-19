'use strict';

// Config
const { config, utils } = require('serverless-authentication');

// Providers
const facebook = require('serverless-authentication-facebook');
const google = require('serverless-authentication-google');
const microsoft = require('serverless-authentication-microsoft');
const customGoogle = require('../custom-google');

// Common
const cache = require('../storage/cacheStorage');

const { redirectProxyCallback } = require('../helpers');

/**
 * Sign In Handler
 * @param proxyEvent
 * @param context
 */
async function signinHandler(proxyEvent, context) {
  const event = {
    provider: proxyEvent.pathParameters.provider,
    stage: proxyEvent.requestContext.stage,
    host: proxyEvent.headers.Host
  };

  const providerConfig = config(event);

  try {
    const state = await cache.createState();
    switch (event.provider) {
      case 'facebook':
        return facebook.signinHandler(
          providerConfig, { scope: 'email', state },
          (err, data) => redirectProxyCallback(context, data)
        );
      case 'google':
        return google.signinHandler(
          providerConfig, { scope: 'profile email', state },
          (err, data) => redirectProxyCallback(context, data)
        );
      case 'microsoft':
        return microsoft.signinHandler(
          providerConfig, { scope: 'wl.basic wl.emails', state },
          (err, data) => redirectProxyCallback(context, data)
        );
      case 'custom-google':
        // See ./customGoogle.js
        return customGoogle.signinHandler(
          providerConfig, { state },
          (err, data) => redirectProxyCallback(context, data)
        );
      default:
        return utils.errorResponse(
          { error: `Invalid provider: ${event.provider}` },
          providerConfig,
          (err, data) => redirectProxyCallback(context, data)
        );
    }
  } catch (exception) {
    return utils.errorResponse(
      { exception },
      providerConfig,
      (err, data) => redirectProxyCallback(context, data)
    );
  }
}

exports = module.exports = signinHandler;

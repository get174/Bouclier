const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Metro config
const config = getDefaultConfig(__dirname);

// Configure the server to use all available network interfaces
config.server = {
  ...config.server,
  port: 8081,
  enhanceMiddleware: (middleware, server) => {
    return (req, res, next) => {
      // Allow connections from any IP
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return middleware(req, res, next);
    };
  },
};

// Configure the transformer
config.transformer = {
  ...config.transformer,
  minifierPath: 'metro-minify-terser',
};

// Configure the resolver
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
};

module.exports = config;

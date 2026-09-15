// Expo's default Metro config already understands npm workspaces (it watches
// the repo root and resolves hoisted node_modules). Kept as a file so it is
// obvious where to add resolver tweaks later.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;

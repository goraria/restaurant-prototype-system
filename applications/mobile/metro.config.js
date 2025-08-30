const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });

// const path = require('path');
// const { getDefaultConfig } = require('expo/metro-config');
//
// const projectRoot = __dirname;
// const repoRoot = path.resolve(projectRoot, '..', '..');
// const packagesFolder = path.join(repoRoot, 'packages');
//
// const config = getDefaultConfig(projectRoot);
//
// config.watchFolders = [
//     repoRoot,
//     packagesFolder
// ];
//
// config.resolver = {
//     ...config.resolver,
//     extraNodeModules: new Proxy({}, {
//         get: (target, name) => path.join(repoRoot, `node_modules/${name}`)
//     }),
//     sourceExts: [...(config.resolver.sourceExts || []), 'cjs', 'ts', 'tsx']
// };
//
// module.exports = config;

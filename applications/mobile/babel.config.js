module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
// module.exports = {
//     presets: ['babel-preset-expo'],
//     babelrcRoots: [
//         '.',                       // mobile app itself
//         '../..',                   // monorepo root (nếu bạn có babel config shared)
//         '../../packages/*'         // tất cả packages để transpile nếu chứa source ES/TS
//     ],
// };
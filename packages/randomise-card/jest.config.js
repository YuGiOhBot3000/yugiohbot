const { compilerOptions } = require("./tsconfig");
const { pathsToModuleNameMapper } = require("ts-jest");

module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: __dirname,
  }),
};

const plugin = require('postcss').plugin;

const exportRegexp = /^:export$/;

module.exports = plugin('postcss-modules-extract-exports', function postcssModulesExtractExports() {
  /**
   * @param {object} tree Root node
   */
  return function extractExports(tree) {
    const tokens = {};

    tree.walkRules(exportRegexp, rule => {
      rule.walkDecls(decl => tokens[decl.prop] = decl.value);
      tree.removeChild(rule);
    });

    tree.tokens = tokens;
  };
});

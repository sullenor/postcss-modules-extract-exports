const basename = require('path').basename;
const postcss = require('postcss');
const readdirSync = require('fs').readdirSync;
const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;

const postcssExtractImports = require('../index');
const runner = postcss(postcssExtractImports);

/**
 * @param {string} testCase
 */
function describeTest(testCase) {
  const source = readfile(testCase, 'source.css');
  const expected = readfile(testCase, 'expected.css');
  if (expected === null) {
    return;
  }

  const expectedTokens = JSON.parse(readfile(testCase, 'expected.json'));

  // @todo add a small shortcut to choose certain tests
  test(basename(testCase), () => {
    const root = runner.process(source).root;
    const css = root.toResult().css;

    assert.deepEqual(root.tokens, expectedTokens);
    assert.equal(css, expected);
  });
}

/**
 * @param  {string} dir
 * @return {string[]}
 */
function readdir(dir) {
  return readdirSync(resolve(__dirname, dir))
    .map(nesteddir => resolve(__dirname, dir, nesteddir));
}

/**
 * @param  {...string} file
 * @return {string|null}
 */
function readfile(file) {
  try {
    return readFileSync(resolve.apply(null, arguments), 'utf8');
  } catch(e) {
    return null;
  }
}

suite('postcss-modules-extract-exports', () => {
  readdir('./cases').forEach(describeTest);
});

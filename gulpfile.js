const { task, series, src, dest } = require('gulp');
const install = require('gulp-install');
const zip = require('gulp-zip');
const del = require('del');
const path = require('path');
const minimist = require('minimist');
const aws = require('aws-sdk');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const buildDir = path.resolve('build');
const distDir = path.resolve('dist');

const arguments = minimist(process.argv.slice(2), { string: 'fn' });
if (!arguments.fn) {
  console.error('Missing a required parameter: --fn <name>');
  return;
}
const functionName = arguments.fn;

task('clean', () => {
  const artifacts = [ `build/${functionName}`, `dist/${functionName}.zip` ];
  return del(artifacts);
});

task('build', () => {
  const options = { base: '.' };
  const functionBuildDir = `${buildDir}/${functionName}`;
  const files = ['package.json', `src/${functionName}.js`];
  return src(files, options)
    .pipe(dest(functionBuildDir))
    .pipe(install({ production: true }));
});

task('dist', () => {
  const input = `${buildDir}/${functionName}/**/*`;
  const output = `${functionName}.zip`;
  return src(input)
    .pipe(zip(output))
    .pipe(dest(distDir));
});

task('default', series('clean', 'build', 'dist'));

task('upload', async () => {
  const filename = path.resolve(distDir, `${functionName}.zip`);
  const parameters = {
    FunctionName: functionName,
    ZipFile: await readFile(filename)
  };

  const lambda = new aws.Lambda({ region: 'us-west-2' });
  const result = await lambda.updateFunctionCode(parameters).promise();

  console.info(result);
});

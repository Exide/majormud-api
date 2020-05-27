const { task, series, src, dest } = require('gulp');
const typescript = require('gulp-typescript');
const rename = require('gulp-rename');
const install = require('gulp-install');
const zip = require('gulp-zip');
const del = require('del');
const path = require('path');
const minimist = require('minimist');
const aws = require('aws-sdk');
const mergeStream = require('merge-stream');
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
const tsProject = typescript.createProject('tsconfig.json');

task('clean', () => {
  const artifacts = [ `build/${functionName}`, `dist/${functionName}.zip` ];
  return del(artifacts);
});

task('tsc', () => {
  const functionBuildDir = `${buildDir}/${functionName}`;
  const functionFile = path.resolve('src', `${functionName}.ts`);
  const functionCode = src(functionFile)
    .pipe(rename('index.ts'));

  const sharedCode = src([
    'src/response.ts',
    'src/majormud-object.ts',
    'src/item.ts'
  ]);

  return mergeStream(functionCode, sharedCode)
    .pipe(tsProject())
    .js
    .pipe(dest(functionBuildDir));
});

task('npm', () => {
  const functionBuildDir = `${buildDir}/${functionName}`;
  return src('package.json')
    .pipe(dest(functionBuildDir))
    .pipe(install({ production: true }));
});

task('zip', () => {
  const input = `${buildDir}/${functionName}/**/*`;
  const output = `${functionName}.zip`;
  return src(input)
    .pipe(zip(output))
    .pipe(dest(distDir));
});

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

task('default', series('clean', 'tsc', 'npm', 'zip', 'upload'));

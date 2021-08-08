const { task, series, parallel, src, dest } = require('gulp');
const typescript = require('gulp-typescript');
const rename = require('gulp-rename');
const install = require('gulp-install');
const zip = require('gulp-zip');
const del = require('del');
const path = require('path');
const aws = require('aws-sdk');
const mergeStream = require('merge-stream');
const fs = require('fs').promises;

const buildDir = path.resolve('build');
const distDir = path.resolve('dist');

const tsProject = typescript.createProject('tsconfig.json');

async function cleanByFunctionName(functionName) {
  const artifacts = [ `build/${functionName}`, `dist/${functionName}.zip` ];
  return del(artifacts);
}

async function compileByFunctionName(functionName) {
  return new Promise((resolve, reject) => {
    const functionBuildDir = `${buildDir}/${functionName}`;
    const functionFile = path.resolve('src', `${functionName}.ts`);
    const functionCode = src(functionFile)
      .pipe(rename('index.ts'));

    const sharedCode = src('src/helpers/**/*.ts');

    mergeStream(functionCode, sharedCode)
      .pipe(tsProject())
      .js
      .pipe(dest(functionBuildDir))
      .on('end', resolve)
      .on('error', reject)
  });
}

async function getDependenciesByFunctionName(functionName) {
  return new Promise((resolve, reject) => {
    const functionBuildDir = `${buildDir}/${functionName}`;
    src('package.json')
      .pipe(dest(functionBuildDir))
      .pipe(install({ production: true }))
      .on('end', resolve)
      .on('error', reject)
      .resume();
  });
}

function compressByFunctionName(functionName) {
  return new Promise((resolve, reject) => {
    const input = `${buildDir}/${functionName}/**/*`;
    const output = `${functionName}.zip`;
    return src(input)
      .pipe(zip(output))
      .pipe(dest(distDir))
      .on('end', resolve)
      .on('error', reject)
      .resume();
  });
}

async function uploadByFunctionName(functionName) {
  const filename = path.resolve(distDir, `${functionName}.zip`);
  const parameters = {
    FunctionName: functionName,
    ZipFile: await fs.readFile(filename)
  };

  const lambda = new aws.Lambda({ region: 'us-west-2' });
  const result = await lambda.updateFunctionCode(parameters).promise();

  console.info(result);
}

//
//  Public Tasks
//

task('get-index', series(
  async function clean() { return cleanByFunctionName('index') },
  async function compile() { return compileByFunctionName('index') },
  async function getDependencies() { return getDependenciesByFunctionName('index') },
  async function compress() { return compressByFunctionName('index') },
  async function upload() { return uploadByFunctionName('index') }
));

task('get-versions', series(
  async function clean() { return cleanByFunctionName('get-versions') },
  async function compile() { return compileByFunctionName('get-versions') },
  async function getDependencies() { return getDependenciesByFunctionName('get-versions') },
  async function compress() { return compressByFunctionName('get-versions') },
  async function upload() { return uploadByFunctionName('get-versions') }
));

task('get-version-by-name', series(
  async function clean() { return cleanByFunctionName('get-version-by-name') },
  async function compile() { return compileByFunctionName('get-version-by-name') },
  async function getDependencies() { return getDependenciesByFunctionName('get-version-by-name') },
  async function compress() { return compressByFunctionName('get-version-by-name') },
  async function upload() { return uploadByFunctionName('get-version-by-name') }
));

task('get-items', series(
  async function clean() { return cleanByFunctionName('get-items') },
  async function compile() { return compileByFunctionName('get-items') },
  async function getDependencies() { return getDependenciesByFunctionName('get-items') },
  async function compress() { return compressByFunctionName('get-items') },
  async function upload() { return uploadByFunctionName('get-items') }
));

task('get-item-by-id', series(
  async function clean() { return cleanByFunctionName('get-item-by-id') },
  async function compile() { return compileByFunctionName('get-item-by-id') },
  async function getDependencies() { return getDependenciesByFunctionName('get-item-by-id') },
  async function compress() { return compressByFunctionName('get-item-by-id') },
  async function upload() { return uploadByFunctionName('get-item-by-id') }
));

// clean, build, package, and upload everything
task('default', parallel(
  'get-index',
  'get-versions',
  'get-version-by-name',
  'get-items',
  'get-item-by-id'
));

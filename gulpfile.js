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
const tsConfig = require('./tsconfig.json');

const buildDir = path.resolve('build');
const distDir = path.resolve('dist');

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

    const sharedCode = src('src/helpers/**/*.ts', { base: 'src/' });

    mergeStream(functionCode, sharedCode)
      .pipe(typescript(tsConfig.compilerOptions))
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
    FunctionName: `majormud-api-${functionName}`,
    ZipFile: await fs.readFile(filename)
  };

  const lambda = new aws.Lambda({ region: 'us-west-2' });
  const result = await lambda.updateFunctionCode(parameters).promise();

  console.info(result);
}

// ****************************************************************************
//  Public Tasks
// ****************************************************************************

// ****************************************************************************
//  get-index
// ****************************************************************************

task('clean-get-index', series(
  async function clean() { return cleanByFunctionName('get-index') }
));
task('build-get-index', series(
  async function clean() { return cleanByFunctionName('get-index') },
  async function compile() { return compileByFunctionName('get-index') },
  async function getDependencies() { return getDependenciesByFunctionName('get-index') }
));
task('package-get-index', series(
  async function compress() { return compressByFunctionName('get-index') }
));
task('upload-get-index', series(
  async function upload() { return uploadByFunctionName('get-index') }
));
task('get-index', series(
  'build-get-index',
  'package-get-index',
  'upload-get-index'
));

// ****************************************************************************
//  get-versions
// ****************************************************************************

task('clean-get-versions', series(
  async function clean() { return cleanByFunctionName('get-versions') }
));
task('build-get-versions', series(
  async function clean() { return cleanByFunctionName('get-versions') },
  async function compile() { return compileByFunctionName('get-versions') },
  async function getDependencies() { return getDependenciesByFunctionName('get-versions') }

));
task('package-get-versions', series(
  async function compress() { return compressByFunctionName('get-versions') }
));
task('upload-get-versions', series(
  async function upload() { return uploadByFunctionName('get-versions') }
));
task('get-versions', series(
  'build-get-versions',
  'package-get-versions',
  'upload-get-versions'
));

// ****************************************************************************
//  get-version-by-name
// ****************************************************************************

task('clean-get-version-by-name', series(
  async function clean() { return cleanByFunctionName('get-version-by-name') }
));
task('build-get-version-by-name', series(
  async function clean() { return cleanByFunctionName('get-version-by-name') },
  async function compile() { return compileByFunctionName('get-version-by-name') },
  async function getDependencies() { return getDependenciesByFunctionName('get-version-by-name') }
));
task('package-get-version-by-name', series(
  async function compress() { return compressByFunctionName('get-version-by-name') }
));
task('upload-get-version-by-name', series(
  async function upload() { return uploadByFunctionName('get-version-by-name') }
));
task('get-version-by-name', series(
  'build-get-version-by-name',
  'package-get-version-by-name',
  'upload-get-version-by-name'
));

// ****************************************************************************
//  get-items
// ****************************************************************************

task('clean-get-items', series(
  async function clean() { return cleanByFunctionName('get-items') }
));
task('build-get-items', series(
  async function clean() { return cleanByFunctionName('get-items') },
  async function compile() { return compileByFunctionName('get-items') },
  async function getDependencies() { return getDependenciesByFunctionName('get-items') }
));
task('package-get-items', series(
  async function compress() { return compressByFunctionName('get-items') }
));
task('upload-get-items', series(
  async function upload() { return uploadByFunctionName('get-items') }
));
task('get-items', series(
  'build-get-items',
  'package-get-items',
  'upload-get-items'
));

// ****************************************************************************
//  get-item-by-id
// ****************************************************************************

task('clean-get-item-by-id', series(
  async function clean() { return cleanByFunctionName('get-item-by-id') }
));
task('build-get-item-by-id', series(
  async function clean() { return cleanByFunctionName('get-item-by-id') },
  async function compile() { return compileByFunctionName('get-item-by-id') },
  async function getDependencies() { return getDependenciesByFunctionName('get-item-by-id') }
));
task('package-get-item-by-id', series(
  async function compress() { return compressByFunctionName('get-item-by-id') }
));
task('upload-get-item-by-id', series(
    async function upload() { return uploadByFunctionName('get-item-by-id') }
));
task('get-item-by-id', series(
  'build-get-item-by-id',
  'package-get-item-by-id',
  'upload-get-item-by-id'
));

// ****************************************************************************
//  Aggregate Tasks
// ****************************************************************************

task('clean', parallel(
  'clean-get-index',
  'clean-get-versions',
  'clean-get-version-by-name',
  'clean-get-items',
  'clean-get-item-by-id'
));

task('build', parallel(
  'build-get-index',
  'build-get-versions',
  'build-get-version-by-name',
  'build-get-items',
  'build-get-item-by-id'
));

task('package', parallel(
  'package-get-index',
  'package-get-versions',
  'package-get-version-by-name',
  'package-get-items',
  'package-get-item-by-id'
));

task('upload', parallel(
  'upload-get-index',
  'upload-get-versions',
  'upload-get-version-by-name',
  'upload-get-items',
  'upload-get-item-by-id'
));

task('default', series(
  'build',
  'package',
  'upload'
));

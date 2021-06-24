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

    const sharedCode = src([
      'src/response.ts',
      'src/majormud.ts',
      'src/item.ts'
    ]);

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

task('static', async() => {
  const s3 = new aws.S3();
  const filenames = await fs.readdir('static');

  for (let filename of filenames) {
    const parameters = {
      Bucket: 'majormud-api',
      Key: filename,
      Body: await fs.readFile(`static/${filename}`)
    }

    const result = await s3.putObject(parameters).promise();
    console.info(result);
  }
});

task('get-item-by-id', series(
  async function clean() { return cleanByFunctionName('get-item-by-id') },
  async function compile() { return compileByFunctionName('get-item-by-id') },
  async function getDependencies() { return getDependenciesByFunctionName('get-item-by-id') },
  async function compress() { return compressByFunctionName('get-item-by-id') },
  async function upload() { return uploadByFunctionName('get-item-by-id') }
));

task('get-items-by-name', series(
  async function clean() { return cleanByFunctionName('get-items-by-name') },
  async function compile() { return compileByFunctionName('get-items-by-name') },
  async function getDependencies() { return getDependenciesByFunctionName('get-items-by-name') },
  async function compress() { return compressByFunctionName('get-items-by-name') },
  async function upload() { return uploadByFunctionName('get-items-by-name') }
));

// cleanByFunctionName, build, package, and upload everything
task('default', parallel(
  'get-item-by-id',
  'get-items-by-name',
  'static'
));

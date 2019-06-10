const pkg = require('./package');
const { task, src, dest } = require('gulp');
const install = require('gulp-install');
const zip = require('gulp-zip');
const aws = require('aws-sdk');
const path = require('path');

const buildDirRoot = path.resolve('build');
const distDir = path.resolve('dist');

task('build:get-item-by-name', async () => await buildFunction('get-item-by-name'));

async function buildFunction(name) {
  await copyFilesToBuildDir(name);
  await installDependencies(name);
  await compressFunction(name);
}

async function copyFilesToBuildDir(functionName) {
  const options = { base: '.' };
  const buildDir = getFunctionBuildDir(functionName);
  const files = [`src/${functionName}.js`];
  return src(files, options).pipe(dest(buildDir));
}

async function installDependencies(functionName) {
  const buildDir = getFunctionBuildDir(functionName);
  return src('package.json').pipe(dest(buildDir)).pipe(install({ production: true }));
}

function getFunctionBuildDir(functionName) {
  return path.resolve(buildDirRoot, functionName);
}

async function compressFunction(functionName) {
  const buildDir = getFunctionBuildDir(functionName);
  const input = `${buildDir}/**/*`;
  const output = `${functionName}.zip`;
  return src(input).pipe(zip(output)).pipe(dest(distDir));
}

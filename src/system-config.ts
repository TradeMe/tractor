// SystemJS configuration file, see links for more information
// https://github.com/systemjs/systemjs
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

/***********************************************************************************************
 * User Configuration.
 **********************************************************************************************/
/** Map relative paths to URLs. */
const map: any = {
    'angular-2-local-storage': 'vendor/angular-2-local-storage/dist',
    'assert': 'vendor/assert/assert.js',
    'base64-js': 'vendor/base64-js/lib/b64.js',
    'buffer': 'vendor/buffer/index.js',
    'buffer-shims': 'vendor/buffer-shims/index.js',
    'camel-case': 'vendor/camel-case/camel-case.js',
    'dedent': 'vendor/dedent/dist/dedent.js',
    'escodegen': 'vendor/escodegen/escodegen.js',
    'esprima': 'vendor/esprima/esprima.js',
    'estemplate': 'vendor/estemplate/lib/estemplate.js',
    'estraverse': 'vendor/estraverse/estraverse.js',
    'esutils': 'vendor/esutils/lib/utils.js',
    'ieee754': 'vendor/ieee754/index.js',
    'inherits': 'vendor/inherits/inherits_browser.js',
    'isarray': 'vendor/isarray/index.js',
    'json': 'vendor/systemjs-plugin-json/json.js',
    'lodash.isregexp': 'vendor/lodash.isregexp/index.js',
    'lower-case': 'vendor/lower-case/lower-case.js',
    'pascal-case': 'vendor/pascal-case/pascal-case.js',
    'path': 'vendor/path-browserify/index.js',
    'sentence-case': 'vendor/sentence-case/sentence-case.js',
    'socket.io-client': 'vendor/socket.io-client/socket.io.js',
    'source-map': 'vendor/source-map/lib/source-map.js',
    'title-case': 'vendor/title-case/title-case.js',
    'upper-case': 'vendor/upper-case/upper-case.js',
    'upper-case-first': 'vendor/upper-case-first/upper-case-first.js',
    'util': 'vendor/util/util.js'
};

/** User packages configuration. */
const packages: any = {
    'vendor/angular-2-local-storage': { defaultExtension: 'js' },
    'vendor/esutils': { defaultExtension: 'js' },
    'vendor/sentence-case': { defaultExtension: 'js' },
    'vendor/source-map': { defaultExtension: 'js', format: 'commonjs' },
    'vendor/util': { defaultExtension: 'js' },
    'vendor/escodegen': { modules: { '*.json': { loader: 'json' } } }
};

////////////////////////////////////////////////////////////////////////////////////////////////
/***********************************************************************************************
 * Everything underneath this line is managed by the CLI.
 **********************************************************************************************/
const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/forms',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/shared',
  'app/+components',
  'app/+features',
  'app/+step-definitions',
  'app/+mock-data',
  'app/control-panel',
  'app/nav',
  'app/shared/file-tree',
  'app/shared/select',
  'app/shared/submit',
  /** @cli-barrel */
];

const cliSystemConfigPackages: any = {};
barrels.forEach((barrelName: string) => {
  cliSystemConfigPackages[barrelName] = { main: 'index' };
});

/** Type declaration for ambient System. */
declare var System: any;

// Apply the CLI SystemJS configuration.
System.config({
  map: {
    '@angular': 'vendor/@angular',
    'rxjs': 'vendor/rxjs',
    'main': 'main.js'
  },
  packages: cliSystemConfigPackages
});

// Apply the user's configuration.
System.config({ map, packages });

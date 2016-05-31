// Karma configuration
// Generated on Tue Apr 26 2016 21:30:02 GMT-0300 (ART)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha','chai','sinon'],


    // list of files / patterns to load in the browser

     // ojo aca, tienen que ir las mismas dependencias que en nuestro html  angular, etc
    files: [
    'public/javascripts/jquery-2.2.3.min.js',
    'public/stylesheets/bootstrap/dist/js/bootstrap.min.js',
    'public/javascripts/angular13.js',
    'node_modules/angular-mocks/angular-mocks.js',
    'public/javascripts/ui-router.js',
    'public/javascripts/moment.js',
    'public/javascripts/angular-moment.js',
    'public/javascripts/ng-tags-input.min.js',
    'public/javascripts/app_core.js',
    'public/javascripts/services/*.js',
    'public/javascripts/controllers/*.js',
    'tests/frontend/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

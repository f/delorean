module.exports = function (config) {
  config.set({
    basePath: '..',
    singleRun: true,
    autoWatch: true,
    frameworks: ['jasmine'],
    files: [
      'test/spec/common.js',
      'test/vendor/react-0.11.1.js',
      'src/delorean.js',
      'dist/.tmp/delorean-requires.js',
      'test/spec/**/*Spec.js'
    ],
    browsers: ['PhantomJS'],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'src/**/*.js': ['coverage']
    },
    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'coverage/'},
        {type: 'text'}
      ]
    }
  });
};

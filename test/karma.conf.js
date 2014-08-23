module.exports = function(config) {
  config.set({
    basePath: '..',
    singleRun: true,
    autoWatch: true,
    frameworks: ['jasmine'],
    files: [
      'src/**/*.js',
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

module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine', 'commonjs'],
    files: [
      'src/**/*.js',
      'test/spec/**/*Spec.js'
    ],
    browsers: ['PhantomJS'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'src/**/*.js': ['coverage', 'commonjs']
    },
    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'coverage/'}
      ]
    }
  });
};

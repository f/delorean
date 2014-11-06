'use strict';

module.exports = function(grunt) {
  grunt.config('jshint', {
    options: {
      laxbreak: true,
      node: true,
      eqnull: true
    },
    all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!test/vendor/**/*.js']
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};

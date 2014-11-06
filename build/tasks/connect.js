'use strict';

module.exports = function(grunt) {
  grunt.config('connect', {
    server: {
      options: {
        livereload: true,
        port: 9001,
        base: 'coverage/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
};

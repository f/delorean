'use strict';

module.exports = function(grunt) {
  grunt.config('watch', {
    development: {
      files: ['!src/index.js', 'src/**/*.js', 'test/**/*.js'],
      tasks: ['default'],
      options: {
        livereload: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};

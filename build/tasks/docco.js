'use strict';

module.exports = function(grunt) {
  grunt.config('docco', {
    dist: {
      src: ['src/*.js'],
      options: {
        output: 'docs/api/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-docco');
};

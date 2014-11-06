'use strict';

module.exports = function(grunt) {
  grunt.config('browserify', {
    dist: {
      files: {
        'dist/.tmp/delorean-requirements.js': 'src/requirements.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
};

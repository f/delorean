'use strict';

module.exports = function(grunt) {
  grunt.config('release', {
    options: {
      files: ['package.json', 'bower.json']
    }
  });

  grunt.loadNpmTasks('grunt-release');
};

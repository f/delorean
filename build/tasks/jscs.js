'use strict';

module.exports = function(grunt) {
  grunt.config('jscs', {
    src: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!test/vendor/**/*.js'],
    options: {
      config: '.jscsrc',
      validateIndentation: 2,
      disallowDanglingUnderscores: null,
      disallowMultipleVarDecl: null,
      requireMultipleVarDecl: null
    }
  });

  grunt.loadNpmTasks('grunt-jscs-checker');
};

'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadTasks('build/tasks');

  grunt.registerTask('default', ['jscs', 'jshint', 'browserify', 'concat', 'uglify']);
  grunt.registerTask('test', ['karma', 'docco']);
  grunt.registerTask('dev', ['connect', 'watch']);
};

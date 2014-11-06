'use strict';

module.exports = function(grunt) {
  grunt.config('concat', {
    options: {
      separator: ';',
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    build: {
      src: ['src/delorean.js', 'dist/.tmp/delorean-requirements.js'],
      dest: 'dist/delorean.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};

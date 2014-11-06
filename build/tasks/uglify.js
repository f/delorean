'use strict';

module.exports = function(grunt) {
  grunt.config('uglify', {
    options: {
      sourceMap: true,
      mangle: {
        except: ['DeLorean', 'Store', 'Dispatcher', 'Flux']
      }
    },
    build: {
      files: {
        'dist/delorean.min.js': ['dist/delorean.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};

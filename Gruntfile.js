module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-release');

  grunt.initConfig({
    uglify: {
      build: {
        files: {
          'dist/delorean.min.js': ['dist/delorean.js']
        }
      }
    },
    browserify: {
      build: {
        options: {
          bundleOptions: {
            standalone: 'DeLorean'
          },
        },
        files: {
          'dist/delorean.js': ['src/delorean.js']
        }
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
      },
    },
    release: {
      options: {
        files: ['package.json', 'bower.json']
      }
    }
  });

  grunt.registerTask('default', ['karma', 'browserify', 'uglify']);

};

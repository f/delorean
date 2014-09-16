module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs-checker');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-release');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        laxbreak: true
      },
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!test/vendor/**/*.js']
    },
    jscs: {
      src: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!test/vendor/**/*.js'],
      options: {
        config: '.jscsrc',
        validateIndentation: 2,
        disallowDanglingUnderscores: null,
        disallowMultipleVarDecl: null,
        requireMultipleVarDecl: null
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/.tmp/delorean-requires.js': 'src/requires.js'
        }
      }
    },
    concat: {
      options: {
        separator: ';',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: ['src/delorean.js', 'dist/.tmp/delorean-requires.js'],
        dest: 'dist/delorean.js'
      }
    },
    uglify: {
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
    },
    connect: {
      server: {
        options: {
          livereload: true,
          port: 9001,
          base: 'coverage/'
        }
      }
    },
    watch: {
      development: {
        files: ['!src/index.js', 'src/**/*.js', 'test/**/*.js'],
        tasks: ['default'],
        options: {
          livereload: true
        }
      }
    },
    release: {
      options: {
        files: ['package.json', 'bower.json']
      }
    }
  });

  grunt.registerTask('default', ['jscs', 'jshint', 'browserify', 'concat', 'uglify']);
  grunt.registerTask('dev', ['connect', 'watch']);

};

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var concatFiles = ['src/core/bootstrap.js',
               'src/core/dispatcher.js',
               'src/core/store.js',
               'src/core/flux.js'];

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
      },
    },
    concat: {
      options: {
        separator: ';',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: concatFiles,
        dest: 'dist/delorean.js',
      },
      react: {
        src: concatFiles.concat('src/plugins/react.js'),
        dest: 'dist/extras/delorean-react.js',
      },
      flght: {
        src: concatFiles.concat('src/plugins/flight.js'),
        dest: 'dist/extras/delorean-flight.js',
      },
      backbone: {
        src: concatFiles.concat('src/plugins/backbone.js'),
        dest: 'dist/extras/delorean-backbone.js',
      },
    },
    uglify: {
      options: {
        sourceMap: true
      },
      build: {
        files: {
          'dist/delorean.min.js': ['dist/delorean.js'],
          'dist/extras/delorean-react.min.js': ['dist/extras/delorean-react.js'],
          'dist/extras/delorean-flight.min.js': ['dist/extras/delorean-flight.js'],
          'dist/extras/delorean-backbone.min.js': ['dist/extras/delorean-backbone.js']
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
        files: ['src/**/*.js', 'test/**/*.js'],
        tasks: ['default'],
        options: {
          livereload: true
        },
      },
    },
    release: {
      options: {
        files: ['package.json', 'bower.json']
      }
    }
  });

  grunt.registerTask('default', ['karma', 'concat', 'uglify']);
  grunt.registerTask('dev', ['connect', 'watch']);

};

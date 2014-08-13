module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-release'

  grunt.initConfig

    # Uglification
    uglify:
      build:
        files:
          'dist/delorean.min.js': ['dist/delorean.js']

    browserify:
      coffeeify:
        options:
          bundleOptions:
            standalone: 'DeLorean'
          transform: ['coffeeify']

        files:
          'dist/delorean.js': ['src/delorean.coffee']

    release:
      options:
        files: ['package.json', 'bower.json']

  grunt.registerTask 'default', ['browserify:coffeeify', 'uglify']

module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-contrib-coffeeify'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-react'
  grunt.loadNpmTasks 'grunt-browserify'

  grunt.initConfig

    # Uglification
    uglify:
      build:
        files:
          'dist/delorean.min.js': ['dist/delorean.js']

    # Examples
    react:
      example:
        files:
          'example/index.js': 'example/index.jsx'

    browserify:
      coffeeify:
        options:
          bundleOptions:
            standalone: 'DeLorean'
          transform: ['coffeeify']

        files:
          'dist/delorean.js': ['src/delorean.coffee']

      example:
        files:
          'example/index.bundle.js': ['example/index.js']

  grunt.registerTask 'default', ['browserify:coffeeify', 'uglify']
  grunt.registerTask 'example', ['react:example', 'browserify:example']

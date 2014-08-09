module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-contrib-coffeeify'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-react'
  grunt.loadNpmTasks 'grunt-browserify'

  grunt.initConfig

    # Coffee to JavaScript with Browserify
    coffeeify:
      build:
        cwd: 'src'
        src: ['delorean.coffee']
        dest: 'dist'

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
      example:
        files:
          'example/index.bundle.js': ['example/index.js']

  grunt.registerTask 'default', ['coffeeify', 'uglify']
  grunt.registerTask 'example', ['react:example', 'browserify:example']

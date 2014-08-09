module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-contrib-coffeeify'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

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

  grunt.registerTask 'default', ['coffeeify', 'uglify']

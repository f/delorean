module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-react'
  grunt.loadNpmTasks 'grunt-browserify'

  grunt.initConfig

    react:
      example:
        files:
          'asset/js/index.js': 'asset/jsx/index.jsx'

    browserify:
      example:
        files:
          'asset/js/app.js': ['asset/js/index.js']

  grunt.registerTask 'default', ['react:example', 'browserify:example']

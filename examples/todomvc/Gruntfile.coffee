module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-react'
  grunt.loadNpmTasks 'grunt-browserify'

  grunt.initConfig

    react:
      example:
        files:
          'asset/index.js': 'asset/index.jsx'

    browserify:
      example:
        files:
          'asset/index.bundle.js': ['asset/index.js']

  grunt.registerTask 'default', ['react:example', 'browserify:example']

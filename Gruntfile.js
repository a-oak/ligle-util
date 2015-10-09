module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['lib/**/*.js','test/**/*.js'],
      options: {
        jshintrc: '.jshintrc',
        ignores: ['test/coverage/**/*.js'],
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
    },

    jscs: {
      src: '<%= jshint.files %>',
      options: {
        config: '.jscsrc',
      },
    },

    watch: {
      lint: {
        files: '<%= jshint.files %>',
        tasks: ['jshint','jscs'],
      },
      test: {
        files: ['test/unit/*.js'],
        tasks: ['jshint', 'jscs', 'mochaTest:unit'],
      },
    },

    mochaTest: {
      unit: {
        options: {
          reporter: 'spec',
        },
        src: ['test/unit/*.js'],
      },
      api: {
        options: {
          reporter: 'spec',
        },
        src: ['test/api/*.js'],
      },
    },


    // start - code coverage settings
    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../test/coverage/instrument/lib/',
      },
    },


    clean: {
      coverage: {
        src: ['test/coverage/'],
      },
    },

    instrument: {
      files: 'lib/*.js',
      options: {
        lazy: true,
        basePath: 'test/coverage/instrument/'
      }
    },

    storeCoverage: {
      options: {
        dir: 'test/coverage/reports'
      }
    },

    makeReport: {
      src: 'test/coverage/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: 'test/coverage/reports',
        print: 'detail'
      }
    }
    // end - code coverage settings
  });


  // plugins
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks('grunt-env');


  // tasks
  grunt.registerTask('test', [
    'jshint', 'jscs',
    'mochaTest:unit', 'mochaTest:api',
  ]);
  grunt.registerTask('default', ['test']);

  grunt.registerTask('coverage', [
    'jshint', 'jscs', 'clean', 'env:coverage',
    'instrument', 'mochaTest:unit',
    'storeCoverage', 'makeReport',
  ]);
};

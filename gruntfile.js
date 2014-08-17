'use strict';

var _ = require("underscore/underscore-min.js");

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    project: {

      app: "app",
      dist: "dist",
      img: "/img/",
      js: "/js/",
      css: "/css/",
      scss: "/scss/",
      bower: "/bower/",
      fonts: "/fonts/"
    },

    pkg: grunt.file.readJSON('package.json'),

    // Concat all bower components in one file
    bower_concat: {

      all: {
        dest: "<%= project.app %><%= project.js %><%= project.bower %>bower_concat.js",
        dependencies: {
          'underscore': 'jquery',
          'backbone': 'underscore'
        }/*,
        callback: function(mainFiles, component) {
          // Ya minifico con Uglify en total de ficheros
          return _.map(mainFiles, function(filepath) {
              // Use minified files if available
            var min = filepath.replace(/\.js$/, '.min.js');
            return grunt.file.exists(min) ? min : filepath;
          });
        }*/
      }

    },

    uglify: {

      options: {
        mangle: {
          except: ['jQuery', 'Backbone']
        }
      },
      dist: {
        files: {
          '<%= project.dist %><%= project.js %><%= project.bower %>bower_concat.min.js': 
          ['<%= project.app %><%= project.js %><%= project.bower %>bower_concat.js']
        }
      }
    },

    compass: {     

      options: {
        sassDir: '<%= project.app %><%= project.scss %>',
        cssDir: '<%= project.app %><%= project.css %>',
        generatedImagesDir: '<%= project.app %><%= project.img %>',
        imagesDir: '<%= project.app %><%= project.img %>',
        javascriptsDir: '<%= project.app %>/bower_components',
        fontsDir: '<%= project.app %><%= project.fonts %>',
        importPath: '<%= project.app %><%= project.scss %>',
        httpImagesPath: '<%= project.img %>',
        httpGeneratedImagesPath: '<%= project.img %>',
        httpFontsPath: '<%= project.fonts %>',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= project.dist %><%= project.img %>'
        }
      },
      server: {
        options: {
          debugInfo: true
        },
        files: [{
            expand: true,
            src: ['**/*.{scss,sass}', '!**/*_.{scss,sass}']
        }]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= project.dist %>/*',
            '!<%= project.dist %>/.git*'
          ]
        }]
      },
      server: [
        '<%= project.app %><%= project.css %>',
        '<%= project.app %><%= project.js %><%= project.bower %>'
      ]
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
        {
          expand: true,
          dot: true,
          cwd: '<%= project.app %>',
          dest: '<%= project.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'views/{,*/}*.html',
            'img/*',
            'fonts/*'
          ]
        }]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= project.app %>/index.html',
      options: {
        dest: '<%= project.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= project.dist %>/{,*/}*.html'],
      css: ['<%= project.dist %><%= project.css %>{,*/}*.css'],
      options: {
        assetsDirs: ['<%= project.dist %>']
      }
    },

    concat: {
      dist: {
        dest: '<%= project.dist %>'
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '<%= project.app %>'
      },

    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %><%= project.img %>',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= project.dist %><%= project.img %>'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %><%= project.img %>',
          src: '{,*/}*.svg',
          dest: '<%= project.dist %><%= project.img %>'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= project.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= project.dist %>'
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %><%= project.css %>',
          src: '{,*/}*.css',
          dest: '<%= project.app %><%= project.css %>'
        }]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= project.dist %><%= project.js %>{,*/}*.js',
            '<%= project.dist %><%= project.css %>{,*/}*.css',
            '<%= project.dist %><%= project.img %>{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= project.dist %><%= project.css %><%= project.fonts %>*'
          ]
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= project.app %><%= project.js %>{,*/}*.js'],
        tasks: [/*'newer:jshint:all'*/],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: [
          "<%= project.app %><%= project.scss %>{,*/}*.{scss,sass}"
        ],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= project.app %>/{,*/}*.html',
          '<%= project.app %><%= project.css %>{,*/}*.css',
          '<%= project.app %><%= project.img %>{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= project.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            'test',
            '<%= project.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= project.dist %>'
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    }

  });
  
  // Load the plugin that provides the "uglify" task.
  /*grunt.loadNpmTasks('grunt-bower-concat');*/

  // Default task(s).
  grunt.registerTask('default', [
    
  ]);

  grunt.registerTask('serve', [
    'clean:server',
    'compass:server',
    'bower_concat',  
    'connect:livereload',
    'watch',

  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    'autoprefixer',
    'useminPrepare',
    'copy:dist',
    'uglify',
    'cssmin',
    'rev',
    'usemin',
    'htmlmin'
  ]);
};  
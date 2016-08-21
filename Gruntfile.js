module.exports = (grunt) => {
  require('load-grunt-tasks')(grunt)
  
  var fileReferences = {
    css: {
      dist: [
        'src/css/main.css'
      ],
      src: [
        'src/vendor/materialize/dist/css/materialize.min.css',
        'src/vendor/material-design-icons/iconfont/material-icons.css'
      ]
    },
    js: {
      dist: [
        'src/vendor/es5-shim/es5-shim.min.js',
        'src/vendor/js-md5/build/md5.min.js',
        'src/vendor/jquery/dist/jquery.min.js',
        'src/vendor/jquery.browser/dist/jquery.browser.min.js',
        'src/vendor/jquery.bbq/jquery.ba-bbq.min.js',
        'src/lib/jquery.slideto.min.js',
        'src/vendor/lodash/dist/lodash.min.js',
        'src/vendor/js-yaml/dist/js-yaml.min.js',
        'src/vendor/backbone/backbone-min.js',
        'src/vendor/handlebars/handlebars.min.js',
        'src/js/**/*.js',
        'src/vendor/swagger-js/browser/swagger-client.min.js',
        'src/vendor/highlightjs/highlight.pack.min.js',
        'src/vendor/marked/marked.min.js'
      ],
      src: [
        'src/vendor/ace-builds/src-min/ace.js',
        'src/vendor/ace-builds/src-min/mode-json.js',
        'src/vendor/ace-builds/src-min/mode-xml.js',
        'src/vendor/materialize/dist/js/materialize.min.js'
      ]
    }
  };
  
  grunt.initConfig({
    clean: ['dist/*'],
    copy: {
      index: {
        files: [{expand: false, src: "src/index.src.html", dest: "src/index.html"}]
      },
      dist: {
        files: {
          'dist/index.html': 'src/index.dist.html',
          'dist/favicon.ico': 'src/favicon.ico'
        } 
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/swagger-ui.min.js': fileReferences.js.dist
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'dist/swagger-ui.min.css': fileReferences.css.dist
        }
      }
    },
    tags: {
      index: {
        src: fileReferences.css.src.concat(fileReferences.css.dist).concat(fileReferences.js.dist).concat(fileReferences.js.src),
        dest: 'src/index.html'
      }
    },
    sass: {
      app: {
        cwd: 'src/sass/',
        src: ['*.scss'],
        dest: 'src/css/',
        ext: '.css',
        expand: true
      }
    },
    handlebars: {
      app: {
        options: {
          namespace: "Handlebars.templates",
          processName: function(filePath) {
            var pieces = filePath.split('/');
            return pieces[pieces.length - 1].split(".")[0];
          }
        },
        files: {
          'src/js/templates.js': 'src/templates/*.handlebars'
        }
      }
    },
    watch: {
      sass: {
        files: "src/sass/**/*.scss",
        tasks: ["sass:app"]
      },
      index: {
        files: "src/index.src.html",
        tasks: ["build:index"]
      },
      templates: {
        files: "src/templates/*.handlebars",
        tasks: ["handlebars:app"]
      }
    },
    browserSync: {
      app: {
        options: {
          watchTask: true,
          server: "src/",
          files: ["src/css/*.css", "src/js/templates.js"],
          port: 9999
        },
      },
      dist: {
        options: {
          server: "dist/",
          notify: false,
          codeSync: false,
          port: 9999
        },
      },
    }
  })

  grunt.registerTask("default", ["serve:dev"])
  grunt.registerTask("build:app", ["handlebars:app", "sass:app"])
  grunt.registerTask("build:index", ["copy:index", "tags:index"])
  grunt.registerTask("serve:dev", ["build:app", "build:index", "browserSync:app", "watch"])
  grunt.registerTask("dist", ["clean", "build:app", "build:index", "copy:dist", "uglify:dist", "cssmin:dist"])
  grunt.registerTask("serve:dist", ["browserSync:dist"])
}

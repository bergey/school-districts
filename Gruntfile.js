/* global module */

module.exports = function(grunt) {
    "use strict";
      // Project configuration.
    grunt.initConfig({
          bower: {
              target: {
                  rjsConfig: "js/rjs.js" // file with requirejs module -> file mappings
              }
          },
        jshint: {
            "options": {
                "curly": true,
                "eqeqeq": true,
                "forin": true,
                "freeze": true,
                "immed": true,
                "indent": 4,
                "latedef": true,
                "newcap": true,
                "noarg": true,
                "noempty": true,
                "nonew": true,
                "quotmark": "double",
                "undef": true,
                "unused": true,
                "strict": true,
                "trailing": true,
                "laxcomma": true, // allow lists & objects with the comma at the beginning of the line
                "browser": true,
                "globalstrict": true // allow "use strict" at top of file outside function wrapper
            },
            "all": ["Gruntfile.js", "js/**/*.js"]
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "/home/bergey/code/original/school-districts",
                    mainConfigFile: "js/rjs.js",
                    out: "dist/js/school-districts.js",
                    name: "bower_components/requirejs/require.js"
                }
            }
        }
      });
      // grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.registerTask("default", []);
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-bower-requirejs");
    // grunt.loadNpmTasks("grunt-gh-pages");
    // grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("default", ["bower"]);
    // grunt.registerTask("dist", ["requirejs", "copy", ]);
    grunt.registerTask("dist", ["requirejs"])
    grunt.registerTask("deploy", ["dist"]);

};

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jst');

    grunt.initConfig({
        jst: {
            compile: {
                files: {
                    "www/js/templates.js": ["www/template/**/*.html"]
                }
            }
        }
    });
};

module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            dev: {
                options: {
                    paths: ['./css']
                },
                files: {
                    './css/common.css': './css/common.less'
                }
            }
        },
        watch: {
            files: './css/common.less',
            tasks: ['less']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
}

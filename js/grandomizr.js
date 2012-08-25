/*jshint*/
/*globals jQuery*/
(function($){
    "use strict";

    function clean (grandomizr) {
        grandomizr = $(grandomizr);

        return grandomizr
            .val(grandomizr
                .val()
                .replace(/\n+/g, "\n")
                .replace(/\n+$/g, "")
                .split("\n")
                .map(function (str) {return str.replace(/^\s+|\s+$/g, "");})
                .filter(function (value) {return !(/^$/).test(value);})
                .join("\n"));
    }

    function grandomize (event) {
        event.preventDefault();

        var grandomizr = $(event.target).closest(".grandomizr")
          , data = grandomizr.data("gzr");

        reset(grandomizr);
    }

    function init (options, indx, grandomizr) {
        grandomizr = $(grandomizr);

        grandomizr
            .data("gzr", {
                 "count"  : grandomizr.find(options.count)
                ,"items"  : clean(grandomizr.find(options.items))
                ,"result" : grandomizr.find(options.result)
            })
            .find(options.button)
            .on("click", grandomize);
    }

    function reset (grandomizr) {
        grandomizr.data("gzr").result
            .children()
            .not(":first")
            .remove();

        clean(grandomizr.data("gzr").items);

        grandomizr
            .find(".error")
            .remove();
    }

    $.fn.grandomizr = function(options) {
        options = $.extend({}, $.fn.grandomizr.defaults, options);

        return this
            .each(init.bind(null, options));
    };

    $.fn.grandomizr.defaults = {
         button: "input[type=submit]"
        ,count: "input[type=number]"
        ,items: "textarea"
        ,result: "div:nth-child(3)"
    };
}(jQuery));

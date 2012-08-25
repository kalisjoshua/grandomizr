/*jshint*/
/*globals jQuery*/
(function($){
    "use strict";

    function clean (source) {
        source = $(source);

        return source
            .val(source
                .val()
                .replace(/\n+/g, "\n")
                .replace(/\n+$/g, "")
                .split("\n")
                .map(function (str) {return str.replace(/^\s+|\s+$/g, "");})
                .filter(function (value) {return !(/^$/).test(value);})
                .join("\n"));
    }

    function init (options, indx, self) {
        self = $(self);

        self
            .data("gzr", {
                 "count"  : self.find(options.count)
                ,"items"  : clean(self.find(options.items))
                ,"result" : self.find(options.result)
            })
            .find(options.button)
            .on("click", function (e) {});
    }

    function reset (self) {
        self.data("gzr").result
            .children()
            .not(":first")
            .remove();

        clean(self.data("gzr").items);

        self
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

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

    function createList (list) {
        var parent = $("<ul>");

        $.each(list, function (indx, value) {
            $("<li>")
                .text(value)
                .appendTo(parent);
        });

        return parent;
    }

    function error (grandomizr) {
        $("<div>")
            .addClass("alert alert-error")
            .text("The number of groups specified will not produce groups.")
            .appendTo(grandomizr.children().eq(1))
            .slideUp(0)
            .slideDown(400);
    }

    function grandomize (event) {
        event.preventDefault();

        var grandomizr = $(event.target).closest(".grandomizr")
          , data = grandomizr.data("gzr")

          , chunks = ~~data.chunks.val()
          , group = 1
          , list = mix(clean(data.items).val().split("\n"))
          , mod
          , size = ~~(list.length / chunks);

        reset(grandomizr);

        if (size > 1) {
            mod = list.length % chunks;

            while (list.length) {
                data.result
                    .append($("<h3>").text("Group " + group++))
                    .append(createList(list.slice(0, size + (mod ? 1 : 0))));

                list = list.slice(size + (mod ? 1 : 0));
                mod && mod--;
            }
        } else {
            error(grandomizr);
        }
    }

    function init (options, indx, grandomizr) {
        grandomizr = $(grandomizr);

        grandomizr
            .data("gzr", {
                 "chunks" : grandomizr.find(options.chunks)
                ,"items"  : clean(grandomizr.find(options.items))
                ,"result" : grandomizr.find(options.result)
            })
            .find(options.button)
            .on("click", grandomize);
    }

    function mix (list) {
        var len = list.length
            ,indx
            ,result = [];

        while (len > result.length) {
            indx = ~~(Math.random() * list.length);
            result.push(list[indx]);
            list = list.slice(0, indx).concat(list.slice(indx + 1));
        }

        return result;
    }

    function reset (grandomizr) {
        grandomizr.data("gzr").result
            .children()
            .not(":first")
            .remove();

        clean(grandomizr.data("gzr").items);

        grandomizr
            .find(".alert.alert-error")
            .remove();
    }

    function sorter (first, reversed) {

        return function (event) {
            event.preventDefault();
            event.stopPropagation();

            var source = clean(this.find(".items"))

              , list = source
                    .val()
                    .split("\n");

            list = list.sort(first === /,/.test(list[0]) ? sortSpecial : "");

            source.val((sorter.reversed ? list.reverse() : list).join("\n"));

            sorter.reversed = !sorter.reversed;
        };
    }

    function sorters (grandomizr) {
        var links = [$("<a>", {
                    click: sorter(true, false).bind(grandomizr)
                    ,href: "#"
                    ,text: "First"
                }).addClass("btn btn-small btn-info")
                , $("<a>", {
                    click: sorter(false, false).bind(grandomizr)
                    ,href: "#"
                    ,text: "Last"
                }).addClass("btn btn-small btn-info")]
            
          , commas = grandomizr
                .find(".items")
                .val()
                .split("\n")[0]
                .split(",")
                .length > 1;

        if (commas) {
            links = links.reverse();
        }

        return $("<p>")
            .append("Sort names by: ")
            .append(links[0])
            .append(commas ? ", " : " ")
            .append(links[1]);
    }

    function sortSpecial (a, b) {
        var r = /(?:\w+$)|(?:,\s*\w+)/;

        a = a.match(r)[0];
        b = b.match(r)[0];

        return a < b ? -1 : a > b ? 1 : 0;
    }

    $.fn.grandomizr = function(options) {
        options = $.extend({}, $.fn.grandomizr.defaults, options);

        return this
            .each(init.bind(null, options))
            .find(options.items)
            .before(sorters(this))
            .end()
            .fadeOut(0)
            .removeClass("invisible")
            .delay(600)
            .fadeIn(600);
    };

    $.fn.grandomizr.defaults = {
         button: "[type=submit]"
        ,chunks: "input[type=number]"
        ,items: "textarea"
        ,result: ".results"
    };
}(jQuery));

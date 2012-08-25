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

    $.grandomizr = function(element, options) {
        var $element = $(element),
             element = element;

        var plugin = this;

        plugin.config = $.extend({}, options);

        plugin.defaults = {
            itemList: $('.togroup'),
            groupsList: $('.groups'),
            numberOfLists: $('#group_number')
        }

        plugin.method = {
            reset: function() {
                plugin.defaults.groupsList.children().remove();
            },

            grandomize: function() {
                if (plugin.defaults.groupsList.children().length > 0) {
                    plugin.method.reset();
                }

                var listCount    = plugin.defaults.numberOfLists.val();
                var items        = plugin.defaults.itemList.children();

                if (listCount > items.length) {
                    alert('You are trying to make more groups than there are people.\n\nPlease select a group size under ' + items.length + '.')
                    return false;
                }

                var sortedList   = items.clone().sort(function() { return (Math.round(Math.random())-0.5); });

                var itemsPerList = Math.floor(sortedList.length / listCount),
                    rem          = sortedList.length - (itemsPerList * listCount);

                if (itemsPerList == 1) {
                    confirm('With ' + listCount + ' groups, some will only contain 1 member.\n\nAre you sure you want to continue?');
                }

                for (var i=0; i<listCount; i++) {
                    var className = 'group' + (i+1);
                    plugin.defaults.groupsList.append('<h3>Group ' + (i+1) +'</h3>');
                    plugin.defaults.groupsList.append('<ul class="' + className + '"></ul>');

                    var list = $('.' + className);

                    for (var ii=0; ii<itemsPerList; ii++) {
                        if (sortedList[0]) {
                            plugin.method.addItemToGroup(sortedList, list);
                        } else {
                            break;
                        }
                    }

                    if (rem && rem > 0 && sortedList[0]) {
                        plugin.method.addItemToGroup(sortedList, list);
                        --rem;
                    }
                };
            },

            addItemToGroup: function(list, group) {
                var item = list[0];
                group.append(item);

                // remove it from the list
                list.splice(0, 1);
            }
        }
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

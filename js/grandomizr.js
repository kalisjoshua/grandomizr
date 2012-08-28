(function($){
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
            },

            // sort the names in the list
            alphabetize: function (sort_on_first, event) {
                event.preventDefault();
                event.stopPropagation();
                var names = plugin.defaults.itemList
                    .children()
                    .sort(function (a, b) {
                        var aComma = a.innerHTML.indexOf(",") > 0
                          , bComma = b.innerHTML.indexOf(",") > 0;

                        // split the names
                        a = a.innerHTML.match(/([\-\w]+)/g);
                        b = b.innerHTML.match(/([\-\w]+)/g);

                        // normalize the position of First and Last
                        !aComma && a.push(a.shift());
                        !bComma && b.push(b.shift());

                        // get rid of the middle initial if it is present
                        a.length > 2 && (aComma ? a.pop() : a.shift());
                        b.length > 2 && (bComma ? b.pop() : b.shift());

                        // assign which to sort with
                        a = a[+sort_on_first];
                        b = b[+sort_on_first];

                        return a < b ? -1 : a > b ? 1 : 0;
                    });

                plugin.defaults.itemList
                    .empty()
                    .html(names);
            }
        }

        plugin.init = function() {
            // Bind "grandomize" button
            $element.find('input[type="submit"]').on('click', function(e) {
                e.preventDefault();
                plugin.method.grandomize();
            });

            // add the links for the user to click for sort
            plugin.defaults.itemList.before($("<p>").text("Sort by: ")
                .append($("<a>", {href: "#", text: "First", click: plugin.method.alphabetize.bind(null, true)}))
                .append(" ")
                .append($("<a>", {href: "#", text: "Last", click: plugin.method.alphabetize.bind(null, false)})));
        }

        plugin.init();
    }

    $.fn.grandomizr = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('grandomizr')) {
                var plugin = new $.grandomizr(this, options);
                $(this).data('grandomizr', plugin);
            }
        });
    }
})(jQuery);

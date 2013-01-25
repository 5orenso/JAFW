/* jafw - jQuery Ajax FrameWork */


(function ($) {
    $.fn.jafw = function (method) {
    // plugin's default options
    var defaults = {
        foo   : 'bar',
        debug : 'jafw-debug',

        tooltip_delay_in     : 500,
        tooltip_delay_out    : 500,
        tooltip_width        : 250,
        tooltip_height       : 70,

        class_load         : 'jafw-load',
        class_select       : 'jafw-select',
        class_click        : 'jafw-click',
        class_change       : 'jafw-change',
        class_keyup        : 'jafw-keyup',
        class_pageshow     : 'jafw-pageshow',
        class_ckeditor     : 'jafw-ckeditor',
        class_sortable     : 'jafw-sortable',
        class_datepicker   : 'jafw-datepicker',
        class_tabs         : 'jafw-tabs',
        class_accordion    : 'jafw-accordion',
        class_autocomplete : 'jafw-autocomplete',
        class_googlemap    : 'jafw-googlemap',
        class_editinplace  : 'jafw-editinplace',
        //class_badge        : 'jafw-badge',
        class_endless      : 'jafw-endless',
        class_serverpush   : 'jafw-serverpush',
        class_modal        : 'jafw-modal',
        class_tooltip        : 'jafw-tooltip',
        class_submit       : 'jafw-submit',

        class_required_field     : 'jafw-required-field',
        class_required_alert     : 'jafw-required-alert',
        class_submit_in_progress : 'jafw-submit-in-progress',

        class_active : '-active'
    };
    var delay_function = {};
    var settings       = {};
    var query_string   = {};
        var ckeditors      = [];

        // public methods
        // to keep the $.fn namespace uncluttered, collect all of the plugin's methods in an object literal and call
        // them by passing the string name of the method to the plugin
        //
        // public methods can be called as
        // element.pluginName('methodName', arg1, arg2, ... argn)
        // where "element" is the element the plugin is attached to, "pluginName" is the name of your plugin and
        // "methodName" is the name of a function available in the "methods" object below; arg1 ... argn are arguments
        // to be passed to the method
        //
        // or, from inside the plugin:
        // methods.methodName(arg1, arg2, ... argn)
        // where "methodName" is the name of a function available in the "methods" object below
        var methods = {
            // this the constructor method that gets called when the object is created
            init : function (options) {
                // the plugin's final properties are the merged default and user-provided properties (if any)
                // this has the advantage of not polluting the defaults, making them re-usable
                settings = $.extend({}, defaults, options);
                // iterate through all the DOM elements we are attaching the plugin to
                return this.each( function () {
                    var $this = $(this); // reference to the jQuery version of the current DOM element
                    var data = $this.data('jafw');
                    // If the plugin hasn't been initialized yet
                    if ( !data ) {
                        /* Do more setup stuff here */
                        query_string = methods.query_string();
                        if (query_string.jdebug) {
                            settings.debug = settings.debug + query_string.jdebug;
                            //alert(query_string.jdebug);
                            var height = query_string.jdebug > 2 ? 500 : 250;
                            var width  = query_string.jdebug > 2 ? 800 : 600;
                            $('body').append('<div style="background:#f6f6f6; color: #606060; font-size: 10px; font-family:verdana, arial; padding: 5px; position: fixed; bottom:60px; right:20px; z-index:99999; width:' + width + 'px; overflow:hidden; -moz-box-shadow: 0px 0px 10px #000000; -webkit-box-shadow: 0px 0px 10px #000000; box-shadow: 0px 0px 10px #000000; -moz-border-radius: 4px; -webkit-border-radius: 4px; border-radius: 4px;"><h1>Debug</h1><div style="height: ' + height + 'px; overflow : auto;" id="' + settings.debug + '"></div></div>');
                        }
                        $this.data('jafw', {
                            target       : $this,
                            query_string : query_string
                        });
                        methods.init_actions($this, 'body');
                    } else {
                        //alert('alread initialized...' + data.query_string.debug);
                    }
                });
            },


            destroy : function () {
                return this.each( function () {
                    var $this = $(this);
                    // Namespacing FTW
                    //$(window).unbind('.tooltip');
                    settings.data.tooltip.remove();
                    $this.removeData('jafw');
                });
            },


            query_string : function (query_string) {
                var params = {};
                var e,
                    a = /\+/g,  // Regex for replacing addition symbol with a space
                    r = /([^&=]+)=?([^&]*)/g,
                    d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
                    q = query_string || window.location.search.substring(1);
                while (e = r.exec(q))
                    params[d(e[1])] = d(e[2]);
                return params;
            },


            random_number: function (range) {
                if (!range) range = 101;
                var rand = Math.floor(Math.random() * range);
                return rand;
            },


            html_encode: function (value) {
                if (value) {
                    return jQuery('<div />').text(value).html();
                } else {
                    return '';
                }
            },


            html_decode: function (value) {
                if (value) {
                    return $('<div />').html(value).text();
                } else {
                    return '';
                }
            },


            debug : function ($this, msg, type) {
                //var $this = $(this);
                if (query_string.jdebug) {
                    var date = new Date();
                    var timestamp = date.getFullYear()
                    + '-' + date.getMonth()
                    + '-' + date.getDate()
                    + ' ' + date.getHours()
                    + ':' + date.getMinutes()
                    + ':' + date.getSeconds()
                    if (query_string.jdebug >= 3) {
                        try {
                            console.log(timestamp + ' : ' + msg);
                        } catch (err) {

                        }
                    }

                    var color = '';
                    if      (type == 'err')     { color = '#ff0000'; } // red
                    else if (type == 'action')  { color = '#0000aa'; } // blue
                    else if (type == 'info')    { if (query_string.jdebug < 3) return ''; color = '#aaaaaa'; } // gray
                    else if (type == 'network') { color = '#FF00E1'; } //
                    else if (type == 'warn')    { if (query_string.jdebug < 2) return ''; color = '#ff8000'; } // orange
                    else if (type == 'msg')     { color = '#00aa00'; } // green
                    else { if (query_string.jdebug < 2) return ''; color = '#8b8989'; }
                    var line = $(document.createElement('span'))
                        .css('color', color)
                        .append(timestamp + ': ' + msg + ', Element: ' + $this);
                    //jQuery.dump($this);
                    var br = $(document.createElement('br'));
                    br.appendTo(line);
                    line.prependTo($('#' + settings.debug));
                }
            },


            init_actions : function ($this, css_selector) {
                //var $this = $(this); // reference to the jQuery version of the current DOM element
                //alert(css_selector + ', settings.debug' + settings.debug);
                if (settings.debug) methods.debug($this, 'init_actions: ' + css_selector, 'info');
                methods.add_load($this, css_selector);
                methods.add_select($this, css_selector);
                methods.add_click($this, css_selector);
                methods.add_change($this, css_selector);
                methods.add_keyup($this, css_selector);
                methods.add_pageshow($this, css_selector);
                methods.add_ckeditor($this, css_selector);
                methods.add_sortable($this, css_selector);
                methods.add_datepicker($this, css_selector);
                methods.add_tabs($this, css_selector);
                methods.add_accordion($this, css_selector);
                methods.add_autocomplete($this, css_selector);
                methods.add_googlemap($this, css_selector);
                methods.add_editinplace($this, css_selector);
                //methods.add_badge($this, css_selector);
                methods.add_endless($this, css_selector);
                methods.add_serverpush($this, css_selector);

                methods.add_modal($this, css_selector);
                methods.add_tooltip($this, css_selector);
                methods.add_submit($this, css_selector);

            },


            loader : function (target, action) {
                var eh = 16;
                var ew = 16;
                if (action == 'show') {
                    if (settings.debug) methods.debug(target, 'loader: Show ajax loader.', 'info');
                    if ($('#' + target + '_ajax_loader').length <= 0) {
                        //$('<div id="' + target + '_ajax_loader" class="box_round ajax_loader" style="background-image:url(\'/tools/wip5b/img/bg_000000_30.png\'); background-repeat:repeat; background-position:left top; padding:20px; display:none; position:absolute; width:' + ew + 'px; height:' + eh + 'px;"><img src="/tools/jafw/ajax-loader.gif" /><div class="clear"></div>').appendTo($('body'));
                        $('<div id="' + target + '_ajax_loader" class="box_round ajax_loader" style="background-image:url(\'/jafw/img/bg_000000_30.png\'); background-repeat:repeat; background-position:left top; padding:5px; display:none; position:absolute; width:' + ew + 'px; height:' + eh + 'px;"><img src="/jafw/img/ajax-loader.gif" /></div>').prependTo($('#' + target));
                    }
                    var offset = $('#' + target).offset();
                    var h = $('#' + target).height();
                    var w = $('#' + target).width();
                    var wh = $(window).height();
                    var ww = $(window).width();
                    if (h > wh) h = wh;
                    if (w > ww) w = ww;
                    $('#' + target + '_ajax_loader').css({
                        //'top'  : offset.top + (h/3) + 'px',
                        //'left' : offset.left + (w/3) + 'px',
                        //'top'  : offset.top + 'px',
                        //'left' : offset.left + 'px',
                        //'width' : w + 'px',
                        //'height' : h + 'px',
                    });
                    $('#' + target + '_ajax_loader').show();
                } else if (action == 'hide') {
                    if (settings.debug) methods.debug(target, 'loader: Hide ajax loader.', 'info');
                    $('#' + target + '_ajax_loader').hide();
                }
            },


            ajax : function (opt) {
                // TODO: Check if #target _status exists. If not create and insert.
                // TODO: Toggle status loader.
                var param;
                if (Object.prototype.toString.call(opt.param) == "[object Object]") {
                    //if (jQuery.isPlainObject(opt.param)) {
                    // if opt.param is an object we have to extend it.
                    if (settings.debug) methods.debug($(this), 'ajax: Ajax param, #' + opt.target + ', ajax input is object. Trying to extend with target.', 'info');
                    param = $.extend({}, opt.param, {'target' : opt.target});
                } else {
                    // if opt.param is a text string we just append to it.
                    if (settings.debug) methods.debug($(this), 'ajax: Ajax param, #' + opt.target + ', ajax input is plain text. Appending target.', 'info');
                    param = opt.param + '&target=' + opt.target;
                }
                $.ajax({
                    url  : opt.url,
                    data : param,
                    type : 'GET',
                    //crossDomain: true,
                    //mimeType : 'text/plain; charset=iso-8859-1',
                    //contentType: 'application/x-www-form-urlencoded;charset=ISO-8859-1',
                    //
                    // Timeout request in seconds.
                    timeout : opt.timeout,
                    // This event, which is triggered before an Ajax request is started,
                    // allows you to modify the XMLHttpRequest object (setting additional
                    // headers, if need be.)
                    beforeSend: function (xhr) {
                        //  xhr.overrideMimeType('text/html; charset=ISO-8859-1');
                        // Show loader before we start loading.
                        if (!opt.loader_hide) methods.loader(opt.target, 'show');
                    },
                    // This event is called regardless of if the request was successful,
                    // or not. You will always receive a complete callback, even for
                    // synchronous requests.
                    complete : function (jqXHR, textStatus, options) {
                        if (opt.complete) {
                            var fn = eval(opt.complete);
                            if (settings.debug) methods.debug($(this), 'ajax: complete: Ajax complete function is present: "' + opt.complete + '" object: ' + fn, 'action');
                            if (jQuery.isFunction(fn)) {
                                if (settings.debug) methods.debug($(this), 'ajax: complete: Ajax complete isFunction is true. Running function.', 'action');
                                fn(jqXHR, textStatus, options);
                            }
                        }
                    },
                    // This event is only called if the request was successful (no errors
                    // from the server, no errors with the data).
                    success: function (data, textStatus, jqXHR) {
                        var target = $('#' + opt.target);
                        if (settings.debug) methods.debug($(this), 'ajax: success: Ajax success, #' + opt.target + ', param: ' + param + ' -> ' + textStatus + '. Target info: hidden="' + target.is(':hidden') + '", visible="' + target.is(':visible') + '",  el: ' + target.attr('id') + ' h=' + target.height() + ' w=' + target.width(), 'network');

                        // If function. Then execute it.
                        if (opt.success_before) {
                            var fn = eval(opt.success_before);
                            if (jQuery.isFunction(fn)) {
                                fn(data, textStatus, jqXHR);
                            }
                        }

                        // Update timestamp for last data-last-check and data-last-load.
                        if (opt.update_timestamp) {
                            var ts = Math.round((new Date()).getTime() / 1000);
                            var e  = $('#' + opt.update_timestamp);
                            e.data('last-check', ts);
                            e.data('last-load', ts);
                        }

                        // Remove element with data-last-(check|update).
                        if (opt.remove) {
                            var e  = $('#' + opt.update_timestamp);
                            e.remove();
                        }

                        // Hiding loader.
                        if (!opt.loader_hide) methods.loader(opt.target, 'hide');

                        // Updating container with query_string parameters from call.
                        var query_string;
                        if (jQuery.isPlainObject(param)) {
                            query_string = JSON.stringify(param);
                        } else {
                            query_string = param;
                        }
                        target.data('input-query-string', query_string);

                        // Inserting data to target.
                        if (opt.append) {
                            target.append(data);
                        } else if (opt.prepend) {
                            target.prepend(data);
                        } else {
                            target.html(data);
                        }

                        // Checking if this is a hidden element or not.
                        // if( target.is(':hidden') ) {
                        if ( target.css('display') == 'none') {
                            if (settings.debug) methods.debug($(this), 'ajax: success: Ajax success: target is hidden. hidden="' + target.is(':hidden') + '", visible="' + target.is(':visible') + '",  el: ' + target.attr('id') + ' h=' + target.height() + ' w=' + target.width(), 'info');
                            // It's visible, do something
                            if (!opt.keep_open) {
                                // If object is not visible fade in and fade out after 4 sec.
                                target.fadeIn(300);
                                var fade_out = function () {
                                    target.fadeOut(300);
                                };
                                setTimeout(fade_out, 4000);
                            } else {
                                target.fadeIn(300);
                            }
                        } else if (opt.load_toggle) {
                            // Do nothing..?
                            // TODO: Shouldn't we do something here?
                        } else {
                            if (settings.debug) methods.debug($(this), 'ajax: success: Ajax success: target is visible. el: ' + target, 'info');
                            // The element is visible and no toggle is wanted.
                        }

                        // If function. Then execute it.
                        if (opt.success_after) {
                            var fn = eval(opt.success_after);
                            if (settings.debug) methods.debug($(this), 'ajax: success: Ajax success_after function is present: "' + opt.success_after + '" object: ' + fn, 'info');
                            if (jQuery.isFunction(fn)) {
                                if (settings.debug) methods.debug($(this), 'ajax: success: Ajax success_after isFunction is true. Running function.', 'action');
                                fn();//jqXHR, textStatus, options);
                            }
                        }

                        // Init actions on target
                        methods.init_actions($(this), '#' + opt.target);

                        // If delay add opt.delay_class and remove it after opt.delay sec.
                        if (opt.delay) {
                            if (settings.debug) methods.debug($(this), 'ajax: success: Ajax success, adding class: ' + opt.delay_class + settings.class_active, 'info');
                            target.addClass(opt.delay_class + settings.class_active);
                            setTimeout( function () {
                                target.removeClass(opt.delay_class + settings.class_active)
                            }, opt.delay);
                            //.delay(delay).removeClass(delay_class + settings.class_active);
                        }

                        // If we shall close the modal window after save. Do it.
                        if (opt.modal_close) {
                            $('.' + settings.class_modal + '_window').hide().remove();
                            $('.' + settings.class_modal + '_mask').hide().remove();
                        }

                        // // If syntaxhighlight, the check for includes and do it.
                        // if (opt.syntax_highlight) {
                        //     if (jQuery.isFunction(target.syntaxHighlight)) {
                        //         if (settings.debug) methods.debug($(this), 'ajax: success: syntax highlighting found.', 'action');
                        //         target.syntaxHighlight();
                        //     } else {
                        //         if (settings.debug) methods.debug($(this), 'ajax: success: no syntax highlighting found.', 'info');
                        //     }
                        // }
                    },
                    // This event is only called if an error occurred with the request
                    // (you can never have both an error and a success callback with a request).
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (settings.debug) methods.debug($(this), 'ajax: error: ' + opt.url + ' -> ' + opt.target + ' : ' + textStatus, 'err');
                        if (!opt.loader_hide) methods.loader(opt.target, 'hide');
                        $('#' + opt.target).html(textStatus);
                    },
                    statusCode: {
                        301: function () {
                            if (settings.debug) methods.debug($(this), 'ajax: 301: ' + opt.target + ' -> Redirect!', 'err');
                        },
                        302: function () {
                            if (settings.debug) methods.debug($(this), 'ajax: 302: ' + opt.target + ' -> Redirect!', 'err');
                        },
                        404: function () {
                            if (settings.debug) methods.debug($(this), 'ajax: 404: ' + opt.target + ' -> Page not found!', 'err');
                        },
                        500: function () {
                            if (settings.debug) methods.debug($(this), 'ajax: 500: ' + opt.target + ' -> Server error!', 'err');
                        }
                    }
                });
            },


            add_load : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_load: ' + css_selector + ' .' + settings.class_load, 'info');
                $(css_selector + ' .' + settings.class_load).each( function (index) {
                    var el = $(this);
                    for (var i=1; i<=5; i++) {
                        var cnt         = i==1 ? '' : '-'+i;
                        var url         = el.attr('data-load-url' + cnt);
                        if (!el.attr('id')) el.attr('id', settings.class_load + '_' + methods.random_number(10000));
                        var target      = el.attr('data-load-target' + cnt) || el.attr('id'); //el.attr('data-target') || e.closest('.' + settings.class_click).attr('data-target');
                        var param       = el.attr('data-load-param' + cnt) || el.attr('data-param' + cnt);
                        var delay       = el.attr('data-load-delay' + cnt);
                        var delay_class = el.attr('data-load-delay-class' + cnt);
                        //jQuery.dump(e);
                        if (url) {
                            if (settings.debug) methods.debug($(this), 'add_load: ' + el + ' is loaded!, ' + url + ' -> ' + target, 'action');
                            // Run ajax call...
                            methods.ajax({
                                url    : url,
                                param  : param,
                                target : target,
                                delay  : delay,
                                delay_class : delay_class,
                                syntax_highlight : el.data('load-syntax-highlight'),
                                success_after    : el.data('load-complete')
                            });
                        } else {
                            if (settings.debug) methods.debug($(this), 'add_load: ' + el + ' is loaded but no URL defined.', 'warn');
                        }
                    }
                });
            },

            add_select : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_select: ' + css_selector + ' .' + settings.class_select, 'info');
                $(css_selector + ' .' + settings.class_select).bind({
                    change:  function (event) {
                        // TODO: Check if value has been changed before submitting.
                        var el = $(event.target);
                        if (!el.attr('id')) el.attr('id', settings.class_load + '_' + methods.random_number(10000));
                        var selected = $('#' + el.attr('id') + ' option:selected');
                        if (! el.attr('data-skip')) {
                            if (event.preventDefault) event.preventDefault();
                            if (event.stopPropagation) event.stopPropagation();
                        }

                        for (var i=1; i<=5; i++) {
                            var cnt    = i==1 ? '' : '-'+i;
                            var url    = selected.attr('data-url' + cnt)    || el.attr('data-url' + cnt);
                            var param  = selected.attr('data-param' + cnt)  || el.attr('data-param' + cnt);
                            var target = selected.attr('data-target' + cnt) || el.attr('data-target' + cnt);

                            //jQuery.dump(e);
                            if (url) {
                                var delay            = el.attr('data-delay' + cnt);
                                var delay_class      = el.attr('data-delay-class' + cnt);
                                var append           = el.attr('data-append' + cnt);
                                var prepend          = el.attr('data-prepend' + cnt);
                                var update_timestamp = el.data('update');
                                var remove           = el.attr('data-remove' + cnt);
                                var keep_open        = el.attr('data-keep-open' + cnt);
                                var load_toggle      = el.attr('data-load-toggle' + cnt);
                                var fn_complete      = el.attr('data-complete' + cnt);

                                if (!el.data('event-default')) event.preventDefault();
                                var data = $.extend({}, methods.query_string(param), {
                                    'f'       : el.attr('name'),
                                    'value'   : el.val(),
                                    'checked' : el.is(':checked'),
                                    'tagname' : el.prop('tagName'),
                                    'type'    : el.prop('type')
                                });
                                if (settings.debug) methods.debug($(this), 'add_select: ' + event.target + ' is selected!, ' + url + ' -> #' + target, 'action' + ', param=' + param);
                                methods.ajax({
                                    url              : url,
                                    param            : data,
                                    target           : target,
                                    delay            : delay,
                                    delay_class      : delay_class,
                                    append           : append,
                                    prepend          : prepend,
                                    update_timestamp : update_timestamp,
                                    remove           : remove,
                                    keep_open        : keep_open,
                                    load_toggle      : load_toggle,
                                    //complete         : fn_complete,
                                    success_after    : fn_complete
                                });
                            }
                        }
                    }
                });
            },


            add_click : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_click: ' + css_selector + ' .' + settings.class_click, 'info');
                $(css_selector + ' .' + settings.class_click).bind({
                    click: function (event) {
                        //event.stopPropagation();
                        //var e  = $(this); //event.target;
                        var el = $(event.target);
                        if (! el.attr('data-skip')) {
                            if (event.preventDefault) event.preventDefault();
                            if (event.stopPropagation) event.stopPropagation();
                        }

                        var no_action = 1;
                        for (var i=1; i<=5; i++) {
                            var cnt    = i==1 ? '' : '-'+i;
                            var url    = el.attr('data-url' + cnt) || el.attr('href' + cnt);
                            // Use target from this element or find closest upwards.
                            var target = el.attr('data-target' + cnt) || el.closest('.' + settings.class_click).attr('data-target' + cnt);
                            if (target == 'this') {
                                if (!el.attr('id')) el.attr('id', settings.class_load + '_' + methods.random_number(10000));
                                target = el.attr('id');
                            }
                            //if (settings.debug) methods.debug($(this), cnt + ', target=' + target);
                            var param         = el.attr('data-param' + cnt);
                            var delay         = el.attr('data-delay' + cnt);
                            var delay_class   = el.attr('data-delay-class' + cnt);
                            var toggle_class  = el.attr('data-toggle-class' + cnt);
                            var remove_class  = el.attr('data-remove-class' + cnt);
                            var toggle_target = el.attr('data-toggle-target' + cnt);
                            var toggle_state  = el.attr('data-toggle-state' + cnt);
                            var fn_complete   = el.attr('data-complete' + cnt);
                            var bubble_up     = el.attr('data-click'); // Sufficient with one bubble up check.
                            if (bubble_up == 'true') {
                                target                            = el.parent().attr('data-target' + cnt) || target;
                                if (!url)    url                  = el.parent().attr('data-url' + cnt);
                                if (settings.debug) methods.debug($this, 'add_click: ' + css_selector + ': bubbling up to find closest... url='+url + ', target=' + target, 'info');
                                if (!param)  param                = el.parent().attr('data-param' + cnt);
                                if (!delay)  delay                = el.parent().attr('data-delay' + cnt);
                                if (!delay_class) delay_class     = el.parent().attr('data-delay-class' + cnt);
                                if (!toggle_class) toggle_class   = el.parent().attr('data-toggle-class' + cnt);
                                if (!remove_class) remove_class   = el.parent().attr('data-remove-class' + cnt);
                                if (!toggle_target) toggle_target = el.parent().attr('data-toggle-target' + cnt);
                                if (!toggle_state) toggle_state   = el.parent().attr('data-toggle-state' + cnt);
                                if (!fn_complete) fn_complete     = el.parent().attr('data-complete' + cnt);
                            } else if (bubble_up) {
                                target                            = el.closest(bubble_up).attr('data-target' + cnt) || target;
                                if (!url)    url                  = el.closest(bubble_up).attr('data-url' + cnt);
                                if (settings.debug) methods.debug($this, 'add_click: ' + css_selector + ': bubbling up to find closest... url='+url + ', target=' + target, 'info');
                                if (!param)  param                = el.closest(bubble_up).attr('data-param' + cnt);
                                if (!delay)  delay                = el.closest(bubble_up).attr('data-delay' + cnt);
                                if (!delay_class) delay_class     = el.closest(bubble_up).attr('data-delay-class' + cnt);
                                if (!toggle_class) toggle_class   = el.closest(bubble_up).attr('data-toggle-class' + cnt);
                                if (!remove_class) remove_class   = el.closest(bubble_up).attr('data-remove-class' + cnt);
                                if (!toggle_target) toggle_target = el.closest(bubble_up).attr('data-toggle-target' + cnt);
                                if (!toggle_state) toggle_state   = el.closest(bubble_up).attr('data-toggle-state' + cnt);
                                if (!fn_complete) fn_complete     = el.closest(bubble_up).attr('data-complete' + cnt);
                            }
                            var toggle      = el.attr('data-toggle' + cnt);
                            if (toggle) {
                                $('#' + toggle).toggle();
                                no_action = 0;
                            }
                            if (settings.debug && fn_complete) methods.debug($this, 'add_click: fn_complete=' + fn_complete, 'info');

                            
                            // Remove all classes for matching css selector.
                            if (remove_class) {
                                $(remove_class).removeClass(toggle_class);
                            }
                            // Toggle class
                            if (toggle_class) {
                                if (settings.debug) methods.debug($this, 'add_click: toggle_class'+cnt+'=' + toggle_class + ', target=' + toggle_target, 'info');

                                if (toggle_target == 'this' || toggle_target === undefined) {
                                    if (!el.attr('id'))
                                        el.attr('id', settings.class_load + '_' + methods.random_number(10000));
                                    toggle_target = el.attr('id');
                                } else if (toggle_target == 'parent') {
                                    if (!el.parent().attr('id'))
                                        el.parent().attr('id', settings.class_load + '_' + methods.random_number(10000));
                                    toggle_target = el.parent().attr('id');
                                } else if (toggle_target.match(/^(#|\.).+$/gi) ) {
                                    if (!$(el + ' ' + toggle_target).attr('id'))
                                        $(el + ' ' + toggle_target).attr('id', settings.class_load + '_' + methods.random_number(10000));
                                    toggle_target = $(el + ' ' + toggle_target).attr('id');
                                }
                                if (toggle_state) {
                                    // If toggle_state is set, then make sure class is present inside object.
                                    $('#' + toggle_target).toggleClass(toggle_class, true);
                                } else {
                                    $('#' + toggle_target).toggleClass(toggle_class);
                                }
                                no_action = 0;
                            }

                            // Remove element after 1000 ms.
                            var remove = el.attr('data-remove' + cnt);
                            if (remove) {
                                el.fadeOut(1000, function () {
                                    $(this).remove();
                                });
                            }

                            // Hide element slowly.
                            var hide = el.attr('data-hide' + cnt);
                            if (hide) {
                                var hide_target = el.attr('data-hide-target' + cnt);
                                if (hide_target) {
                                    $('#'+hide_target).hide('slow');
                                } else {
                                    $(this).hide('slow');
                                }
                                no_action = 0;
                            }
                            var keep_open   = el.attr('data-keep-open' + cnt);
                            var load_toggle = el.attr('data-load-toggle' + cnt);
                            var append      = el.attr('data-append' + cnt);
                            var prepend     = el.attr('data-prepend' + cnt);
                            var update_timestamp = el.data('update');

                            //jQuery.dump(e);
                            if (url) {
                                if (!el.data('event-default')) event.preventDefault();
                                var data = $.extend({}, methods.query_string(param), {
                                    'f'       : el.attr('name'),
                                    'value'   : el.val(),
                                    'checked' : el.is(':checked'),
                                    'tagname' : el.prop('tagName'),
                                    'type'    : el.prop('type')
                                });
                                if (settings.debug) methods.debug($(this), 'add_click: ' + event.target + ' is clicked!, ' + url + ' -> #' + target, 'action');
                                methods.ajax({
                                    url              : url,
                                    param            : data,
                                    target           : target,
                                    delay            : delay,
                                    append           : append,
                                    prepend          : prepend,
                                    update_timestamp : update_timestamp,
                                    remove           : remove,
                                    delay_class      : delay_class,
                                    keep_open        : keep_open,
                                    load_toggle      : load_toggle,
                                    //complete         : fn_complete,
                                    success_after    : fn_complete
                                });
                                no_action = 0;
                            } else {
                                if (settings.debug >= 3) methods.debug($(this), 'add_click: ' + event.target + ' is clicked but no URL defined.', 'warn');
                                if (fn_complete) {
                                    var fn = eval(fn_complete);
                                    if (settings.debug) methods.debug($(this), 'ajax: complete: Ajax complete function is present: "' + fn_complete + '" object: ' + fn, 'action');
                                    if (jQuery.isFunction(fn)) {
                                        if (settings.debug) methods.debug($(this), 'ajax: complete: Ajax complete isFunction is true. Running function.', 'action');
                                        fn(jqXHR, textStatus, options);
                                    }
                                }
                            }
                        } // for (i=0; i<=5; i++)
                    } // click: function (event)
                });
            },


            add_change : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_change: ' + css_selector + ' .' + settings.class_change, 'info');
                $(css_selector + ' .' + settings.class_change).bind({
                    blur:  function (event) {
                        // TODO: Check if value has been changed before submitting.
                        methods.on_change (event);
                    },
                    changed:  function (event) {
                        methods.on_change (event);
                    }
                });
            },


            add_keyup : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_keyup: ' + css_selector + ' .' + settings.class_keyup, 'info');
                $(css_selector + ' .' + settings.class_keyup).bind({
                    keyup:  function (event) {
                        var el = $(event.target);
                        var delay = el.data('delay') || 500;
                        if (settings.debug) methods.debug($this, 'add_keyup: ' + css_selector + ' .' + settings.class_keyup + ', keyup fired on el=' + el.attr('id'), 'action');
                        if (!el.attr('id')) el.attr('id', settings.class_keyup + '_' + methods.random_number(10000));
                        var on_change = function () { methods.on_change(event) };
                        methods.delay_function($this, el, on_change, delay );
                    }
                });
            },


            delay_function : function ($this, el, callback, ms) {
                if (settings.debug) methods.debug($this, 'delay_function: id=' + el.attr('id') + ', timer=' + el.data('timer') + ', callback=' + callback + ', ms=' + ms, 'action');
                clearTimeout( el.data('timer') );
                var timer = setTimeout(callback, ms);
                el.data('timer', timer);
            },


            on_change : function (event) {
                //if (event.sender) alert( $(event.sender.element).attr('data-url') );
                var el, val;
                // Have to wrap this due to a bug in IE8.
                try {
                    if (event.preventDefault) event.preventDefault();
                    if (event.stopPropagation) event.stopPropagation();
                } catch (err) {}

                //var e  = $(this); //event.target;
                if (event.sender) {
                    el = $(event.sender.element);
                    var name = event.sender.name;
                    var edit = CKEDITOR.instances[name];
                    if (edit.getData) {
                        val = escape(edit.getData());
                    }
                    if (settings.debug) methods.debug($(this), 'on_change: event.sender=' + event.sender.id + ', getData(): ' + val + ', el:' + el, 'msg');
                } else {
                    el = $(event.target);
                    val = escape( el.val() ); //methods.html_encode( methods.html_decode(el.val()) );
                }

                for (var i=1; i<=5; i++) {
                    var cnt         = i==1 ? '' : '-'+i;
                    var url         = el.attr('data-change-url' + cnt);
                    if (!url) url   = el.attr('data-url' + cnt);
                    var target      = el.attr('data-target' + cnt) || el.closest('.' + settings.class_change).attr('data-target' + cnt);
                    if (target == 'this') {
                        if (!el.attr('id')) el.attr('id', settings.class_load + '_' + methods.random_number(10000));
                        target = el.attr('id');
                    }
                    //if (settings.debug) methods.debug($(this), cnt + ', target=' + target);
                    var param       = el.attr('data-param' + cnt);
                    var name        = el.attr('name');
                    var delay       = el.attr('data-delay' + cnt);
                    var delay_class = el.attr('data-delay-class' + cnt);

                    //jQuery.dump(e);
                    if (url) {
                        // Run ajax call...
                        var data = $.extend({}, methods.query_string(param), {'f' : name, 'value' : val});
                        if (settings.debug) methods.debug($(this), 'on_change: ' + el.attr('id') + ' is changed!, ' + url + '?' + data + ' -> #' + target, 'action');
                        methods.ajax({
                            url    : url,
                            param  : data, //param + '&f=' + name + '&value=' + val,
                            target : target,
                            delay  : delay,
                            delay_class : delay_class,
                            syntax_highlight : el.data('syntax-highlight'),
                            success_after    : el.data('complete')
                        });
                    } else {
                        if (settings.debug >= 3) methods.debug($(this), 'on_change: ' + el.attr('id') + ' is changed but no URL defined.', 'warn');
                    }
                } // for (i=0; i<=5; i++)
            },

            // TODO:
            // * Add more options from module: http://api.jqueryui.com/sortable/
            add_sortable : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_sortable: ' + css_selector + ' .' + settings.class_sortable, 'info');
                $(css_selector + ' .' + settings.class_sortable).each( function (index) {
                    var el = $(this);
                    var cnt = '';
                    var url         = el.attr('data-url' + cnt);
                    var target      = el.attr('data-target' + cnt) || el.closest('.' + settings.class_sortable).attr('data-target' + cnt);
                    var append      = el.attr('data-append' + cnt);
                    var param       = el.attr('data-param' + cnt);
                    var delay       = el.attr('data-delay' + cnt);
                    var keep_open   = el.attr('data-keep-open' + cnt);
                    var delay_class = el.attr('data-delay-class' + cnt);
                    var handle      = el.attr('data-handle' + cnt);
                    var connect     = el.attr('data-connect') || settings.class_sortable;

                    el.sortable({
                        connectWith: '.' + connect,
                        placeholder: 'sortable-highlight',
                        scroll  : false,
                        delay   : 50,
                        opacity : 0.6,
                        handle  : handle || false,
                        //tolerance : 'pointer',
                        update  : function (event, ui) {
                            var param2 = $(event.target).sortable('serialize', {
                                key: event.target.id + '[]'
                            });
                            //var param2 = $(event.target).sortable('toArray', {
                            //  key: event.target.id + '[]'
                            //});
                            if (url) {
                                // Run ajax call...
                                if (settings.debug) methods.debug($(this), 'add_sortable: ' + event.target + ' is sorted!, ' + url + ' -> #' + target, 'action');
                                methods.ajax({
                                    append : append,
                                    url    : url,
                                    param  : param2 + '&' + param,
                                    target : target,
                                    delay  : delay,
                                    delay_class : delay_class,
                                    keep_open   : keep_open
                                });
                            } else {
                                if (settings.debug) methods.debug($(this), 'add_sortable: ' + event.target + ' is sorted but no URL defined.', 'warn');
                            }
                        }
                    });
                    // Connect all other sortables related.
                    //$(' .' + settings.class_sortable).each( function (index) {
                    //  $(this).sortable( "option", "connectWith", '.' + connect );
                    //});
                });
            },


            add_ckeditor : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_ckeditor: ' + css_selector + ' .' + settings.class_ckeditor, 'info');
                $(css_selector + ' .' + settings.class_ckeditor).each( function (index) {
                    var el = $(this);
                    if (!el.attr('id')) el.attr('id', settings.class_ckeditor + '_' + methods.random_number(10000));
                    //el.attr('id', settings.class_ckeditor + '_' + methods.random_number(100000));
                    var id   = el.attr('id');
                    var h    = el.attr('data-height') || 100;
                    var w    = el.attr('data-width') || 400;
                    var hide = el.attr('data-hide');
                    var save_on_blur     = el.attr('data-save-on-blur');
                    var save_on_snapshot = el.attr('data-save-on-snapshot');
                    var paste_url        = el.attr('data-paste-url');

                    //-------------------------------------------------------------------------
                    // if (typeof(editor) == 'undefined')
                    //  var editor=null;
                    //
                    // function ck_delete(editor) {
                    //  if(typeof(editor) != 'undefined' && editor!=null)
                    //      editor.destroy();
                    // }
                    //
                    // function ck_init(ck_inst_name) {
                    //  var el_id = document.getElementById(ck_inst_name);
                    //  if (typeof(el_id) != 'undefined' && el_id!=null) {
                    //      if (typeof(editor) == 'undefined' || editor==null) {
                    //      editor=CKEDITOR.replace( ck_inst_name );
                    //      } else {
                    //      ck_delete(editor);
                    //      editor=null;
                    //      editor = CKEDITOR.replace( ck_inst_name );
                    //      }
                    //  }
                    // }


                    //-------------------------------------------------------------------------
                    var editor_config = {
                        stylesSet : [
                            {name:'Facts',element:'div', attributes:{'class':'wip5facts'}},
                            {name:'Facts2',element:'div', attributes:{'class':'wip5facts2'}},
                            {name:'Full quote',element:'div', attributes:{'class':'wip5quotefull'}},
                            {name:'Left quote',element:'div', attributes:{'class':'wip5quoteleft'}},
                            {name:'Right quote',element:'div', attributes:{'class':'wip5quoteright'}},
                            {name:'Full quote2',element:'div', attributes:{'class':'wip5quotefull2'}},
                            {name:'Big',element:'big'},
                            {name:'Small',element:'small'},
                            {name:'Typewriter',element:'tt'},
                            {name:'Computer Code',element:'code'},
                            {name:'Keyboard Phrase',element:'kbd'},
                            {name:'Sample Text',element:'samp'},
                            {name:'Variable',element:'var'},
                            {name:'Deleted Text',element:'del'},
                            {name:'Inserted Text',element:'ins'},
                            {name:'Cited Work',element:'cite'}
                        ],
                        //font_defaultLabel : 'Arial',
                        toolbarStartupExpanded : (hide ? false : true),
                        baseHref : '/',
                        height : h,
                        width : w,
                        entities : true,
                        FormatSource : false,
                        //forceSimpleAmpersand : true,
                        //entities_latin : true,
                        //entities_greek : false,
                        toolbar :[
                            ['Format'], ['Styles'],
                            ['Undo', 'Redo', 'PasteText'],
                            ['Bold', 'Italic', 'Underline', 'Strike', '-', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Link', 'Unlink', 'Table'],
                            ['Wip5form2mail', 'Wip5rss', 'Wip5rpl', 'Wip5boxleft', 'Wip5boxright', 'Wip5boxup', 'Wip5boxdown'],
                            ['Source']
                        ],
                        //enterMode : CKEDITOR.ENTER_BR,
                        //shiftEnterMode: CKEDITOR.ENTER_P,
                        on : {
                            //paste : function (evt) {
                            //  var editor = evt.editor;
                            //  evt.stop(); // we don't let editor to paste data, only for current event
                            //  // show loader that blocks editor changes
                            //  $.post('clean.php', {html: evt.data.html}, function (data) {
                            //      editor.insertHtml( data.html ); // text will be inserted at correct place
                            //      // hide loader
                            //  }, 'json');
                            //},
                            blur : function (event) {
                                methods.on_change (event);
                            },
                            //saveSnapshot : function (event) {
                            //  methods.on_change (event);
                            //},
                            paste : function (ev) {
                                if (settings.debug) methods.debug($this, 'add_ckeditor: something is pasted into editor. : "' + ev.data.html + '". Posting to: ' + paste_url + settings.class_ckeditor, 'action');
                                var editor = ev.editor;
                                if (1==2 && paste_url) {
                                    ev.stop(); // we don't let editor to paste data, only for current event
                                    // show loader that blocks editor changes
                                    $.post(paste_url, { html: ev.data.html }, function (data) {
                                        editor.insertHtml( data.html ); // text will be inserted at correct place
                                    }, 'json');
                                }
                            },
                            change : function (ev) {
                                //if (settings.debug) console.log(ev);
                                methods.on_change (ev);
                            },
                            instanceReady : function (ev) {
                                // Output paragraphs as <p>Text</p>.
                                this.dataProcessor.writer.setRules( 'span', {
                                    indent : false,
                                    breakBeforeOpen : true,
                                    breakAfterOpen : false,
                                    breakBeforeClose : false,
                                    breakAfterClose : true
                                });
                                this.dataProcessor.writer.setRules( 'div', {
                                    indent : false,
                                    breakBeforeOpen : true,
                                    breakAfterOpen : false,
                                    breakBeforeClose : false,
                                    breakAfterClose : true
                                });
                                this.dataProcessor.writer.setRules( 'p', {
                                    indent : false,
                                    breakBeforeOpen : true,
                                    breakAfterOpen : false,
                                    breakBeforeClose : false,
                                    breakAfterClose : true
                                });
                                this.dataProcessor.writer.setRules( 'h1', {
                                    indent : false,
                                    breakBeforeOpen : true,
                                    breakAfterOpen : false,
                                    breakBeforeClose : false,
                                    breakAfterClose : true
                                });
                                this.dataProcessor.writer.setRules( 'h2', {
                                    indent : false,
                                    breakBeforeOpen : true,
                                    breakAfterOpen : false,
                                    breakBeforeClose : false,
                                    breakAfterClose : true
                                });
                                this.dataProcessor.writer.setRules( 'h3', {
                                    indent : false,
                                    breakBeforeOpen : true,
                                    breakAfterOpen : false,
                                    breakBeforeClose : false,
                                    breakAfterClose : true
                                });
                                this.dataProcessor.writer.setRules( 'h4', {
                                    indent : false,
                                    breakBeforeOpen : true,
                                    breakAfterOpen : false,
                                    breakBeforeClose : false,
                                    breakAfterClose : true
                                });
                                this.dataProcessor.writer.setRules( 'ul', {
                                    indent : false,
                                    breakBeforeOpen : true,
                                    breakAfterOpen : false,
                                    breakBeforeClose : false,
                                    breakAfterClose : true
                                });
                                this.dataProcessor.writer.setRules( 'li', {
                                    indent : false,
                                    breakBeforeOpen : true,
                                    breakAfterOpen : false,
                                    breakBeforeClose : false,
                                    breakAfterClose : true
                                });
                            }
                        }
                    };


                    if (CKEDITOR.instances[id]) {
                        try {
                            CKEDITOR.instances[id].destroy(true);
                        } catch (err) { }
                        try {
                            delete CKEDITOR.instances[id];
                        } catch (err) { }
                        //try {
                        //    CKEDITOR.instances[id].remove(true);
                        //} catch (err) { }
                    }
                    //ckeditors.push(id);
                    //ckeditors = jQuery.unique(ckeditors);

                    CKEDITOR.replace( id, editor_config );
                    //-----------------------------------------------------------------------------------------

                });
            },

            // TODO:
            // * Add date format.
            // * Add other params from module: http://api.jqueryui.com/datepicker/
            add_datepicker : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_datepicker: ' + css_selector + ' .' + settings.class_datepicker, 'info');
                $(css_selector + ' .' + settings.class_datepicker).each( function (index) {
                    var el = $(this);
                    if (!el.attr('id')) el.attr('id', settings.class_datepicker + '_' + methods.random_number(10000));
                    var id     = el.attr('id');
                    var format = el.attr('data-format') || 'yy-mm-dd';
                    var change_year = el.attr('data-change-year');

                    $(el).datepicker({
                        'dateFormat': format,
                        'changeYear' : change_year,
                        'firstDay': 1
                    });
                });
            },


            add_tabs : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_tabs: ' + css_selector + ' .' + settings.class_tabs, 'info');
                $(css_selector + ' .' + settings.class_tabs).each( function (index) {
                    var el = $(this);
                    $(el).tabs({
                        // TODO: cookie: {
                        //     store cookie for a day, without, it would be a session cookie
                        //     expires: 365
                        show: function (event, ui) {
                            //console.log(event);
                            //console.log(ui);
                            //event.stopPropagation();
                            //event.preventDefault();
                            var el = $(ui.panel);
                            for (var i=1; i<=5; i++) {
                                var cnt         = i==1 ? '' : '-'+i;
                                var url         = el.attr('data-url' + cnt);
                                if (!el.attr('id')) el.attr('id', settings.class_load + '_' + methods.random_number(10000));
                                var target      = el.attr('data-target' + cnt) || el.attr('id'); //el.attr('data-target') || e.closest('.' + settings.class_click).attr('data-target');
                                var param       = el.attr('data-param' + cnt) || el.attr('data-param' + cnt);
                                var delay       = el.attr('data-delay' + cnt);
                                var delay_class = el.attr('data-delay-class' + cnt);
                                //jQuery.dump(e);
                                if (url) {
                                    if (settings.debug) methods.debug($(this), 'add_tabs: ' + el + ' is showed!, ' + url + ' -> ' + target, 'action');
                                    // Run ajax call...
                                    methods.ajax({
                                        url    : url,
                                        param  : param,
                                        target : target,
                                        delay  : delay,
                                        delay_class : delay_class
                                    });
                                } else {
                                    if (settings.debug) methods.debug($(this), 'add_tabs: ' + el + ' is showed but no URL defined.', 'warn');
                                }
                            }
                        }
                    });
                });
            },


            add_accordion : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_accordion: ' + css_selector + ' .' + settings.class_accordion, 'info');
                $(css_selector + ' .' + settings.class_accordion).each( function (index) {
                    var el = $(this);
                    $(el).accordion({
                        autoHeight : false,
                        heightStyle : el.attr('data-accordion-heightstyle'),
                        active :  el.attr('data-accordion-active'),
                        animate :  el.attr('data-accordion-animate'),
                        collapsible :  el.attr('data-accordion-collapsible'),
                        disabled :  el.attr('data-accordion-disabled'),
                        header :  el.attr('data-accordion-header'),
                        icons :  el.attr('data-accordion-icons'),
                        beforeActivate: function (event, ui) {
                            //console.log(event);
                            //console.log(ui);
                            //event.stopPropagation();
                            //event.preventDefault();
                            var el = $(ui.newPanel);
                            // console.log(el);
                            for (var i=1; i<=5; i++) {
                                var cnt         = i==1 ? '' : '-'+i;
                                var url         = el.attr('data-url' + cnt);
                                if (!el.attr('id')) el.attr('id', settings.class_load + '_' + methods.random_number(10000));
                                var target      = el.attr('data-target' + cnt) || el.attr('id'); //el.attr('data-target') || e.closest('.' + settings.class_click).attr('data-target');
                                var param       = el.attr('data-param' + cnt) || el.attr('data-param' + cnt);
                                var delay       = el.attr('data-delay' + cnt);
                                var delay_class = el.attr('data-delay-class' + cnt);
                                //jQuery.dump(e);
                                if (url) {
                                    if (settings.debug) methods.debug($(this), 'add_accordion: beforeActivate: ' + el + ' is showed!, ' + url + ' -> ' + target, 'action');
                                    // Run ajax call...
                                    methods.ajax({
                                        url    : url,
                                        param  : param,
                                        target : target,
                                        delay  : delay,
                                        delay_class : delay_class
                                    });
                                } else {
                                    if (settings.debug) methods.debug($(this), 'add_accordion: beforeActivate: ' + el + ' is showed but no URL defined.', 'warn');
                                }
                            }
                        }

                    });
                });
            },


            add_submit : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_submit: ' + css_selector + ' .' + settings.class_submit, 'info');
                $(css_selector + ' .' + settings.class_submit).bind({
                    submit: function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        var el = $(this);
                        if (!el.attr('id')) el.attr('id', settings.class_load + '_' + methods.random_number(10000));

                        // Remove all alerts and alert classes.
                        $('.' + settings.class_required_field).each( function (index) {
                            var e = $(this);
                            e.removeClass(settings.class_required_field);
                        });
                        $('.' + settings.class_required_alert).each( function (index) {
                            var e = $(this);
                            e.remove();
                        });

                        // Check required
                        var faults = $('input,textarea').filter(function () {
                            // filter input elements to required ones that are empty
                            if (settings.debug && $(this).data('required')) methods.debug($this, 'add_submit: ' + css_selector + ' : Found required field : ' + $(this).attr('name') + ' with value=' + $(this).val(), 'info');
                            if ($(this).data('required') && $(this).val() === "") {
                                $(this).after('<span class="' + settings.class_required_alert + '"></span>'); // make them attract the eye
                            }
                            return $(this).data('required') && $(this).val() === "";
                        }).addClass(settings.class_required_field);
                        //console.log(faults);
                        //console.log(faults.length);

                        $('input[type="submit"]').each( function (index) {
                            var e = $(this);
                            e.prop('disabled', true);
                            var t = e.data('in-progress');
                            if (t) {
                                e.data('org-text', e.attr('value'));
                                e.attr('value', t);
                            }
                            e.addClass(settings.class_submit_in_progress);
                        });

                        if (!faults.length) {
                            for (var i=1; i<=5; i++) {
                                var cnt         = i==1 ? '' : '-'+i;
                                var url         = el.attr('data-url' + cnt) || el.attr('action');
                                if (!el.attr('id')) el.attr('id', settings.class_submit + '_' + methods.random_number(10000));
                                var target      = el.attr('data-target' + cnt); //el.attr('data-target') || e.closest('.' + settings.class_click).attr('data-target');
                                var param       = el.attr('data-param' + cnt);
                                var delay       = el.attr('data-delay' + cnt);
                                var delay_class = el.attr('data-delay-class' + cnt);
                                var modal_close = el.attr('data-modal-close');
                                //var required    = el.data('required');

                                //jQuery.dump(e);
                                if (url && target) {
                                    if (settings.debug) methods.debug($(this), 'add_submit: ' + el + ' is submited!, ' + url + ' -> ' + target, 'action');
                                    // Run ajax call...
                                    methods.ajax({
                                        url    : url,
                                        param  : param + '&' + el.serialize(),
                                        target : target,
                                        delay  : delay,
                                        delay_class : delay_class,
                                        modal_close : modal_close,
                                        success_before : function () {
                                            $('#' + el.attr('id') + ' input[type="submit"]').each( function (index) {
                                                var e = $(this);
                                                e.prop('disabled', false);
                                                var t = e.data('org-text');
                                                if (t) e.attr('value', t);
                                                e.removeClass(settings.class_submit_in_progress);
                                            });
                                        }
                                    });
                                } else {
                                    if (settings.debug) methods.debug($(this), 'add_submit: ' + el + ' is submited but no URL defined.', 'warn');
                                }
                            }
                        } else {
                            $('#' + el.attr('id') + ' input[type="submit"]').each(function (index) {
                                var e = $(this);
                                e.prop('disabled', false);
                                var t = e.data('org-text');
                                if (t) e.attr('value', t);
                                e.removeClass(settings.class_submit_in_progress);
                            });
                        }
                    }
                });
            },


            add_autocomplete : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_autocomplete: ' + css_selector + ' .' + settings.class_autocomplete, 'info');
                $(css_selector + ' .' + settings.class_autocomplete).each(function (index) {
                    var el = $(this);
                    if (!el.attr('id')) el.attr('id', settings.class_autocomplete + '_' + methods.random_number(10000));
                    var id          = el.attr('id');
                    var source      = el.attr('data-source');
                    var min_length  = el.attr('data-min-length') || 2;
                    var append      = el.attr('data-append');
                    var name        = el.attr('data-name');
                    var class_name  = el.attr('data-class');
                    var data        = el.attr('data-data');
                    var url         = el.attr('data-url');
                    var target      = el.attr('data-target');
                    var param       = el.attr('data-param');
                    var delay       = el.attr('data-delay');
                    var delay_class = el.attr('data-delay-class');

                    if (source) {
                        $(el).autocomplete({
                            source: source,
                            minLength: min_length,
                            //change: function (event, ui) {  },
                            select: function ( event, ui ) {
                                var e = $(this);
                                if (settings.debug) methods.debug($this, 'add_autocomplete: selected: ' + ui.item.id + ', ' + ui.item.value + ' -> ' + append + ', form=' + e.val(), 'info');
                                e.val('');
                                if (append) {
                                    var dta = data.replace(/{value}/g, ui.item.id);
                                    $('<span class="'+class_name+'" '+dta+'>'+ui.item.value+'</span>').prependTo('#' + append);
                                    $('#' + append).scrollTop(0);
                                }
                                if (url && target) {
                                    if (settings.debug) methods.debug($(this), 'add_autocomplete: selected: ' + e + ' is submited!, ' + url + ' -> ' + target, 'action');
                                    // Run ajax call...
                                    methods.ajax({
                                        url    : url,
                                        param  : param + '&f=' + name + '&value=' + ui.item.id,
                                        target : target,
                                        delay  : delay,
                                        delay_class : delay_class
                                    });
                                } else {
                                    if (settings.debug) methods.debug($(this), 'add_autocomplete: selected: ' + e + ' is submited but no URL defined.', 'warn');
                                }
                                return false;
                            }
                        });
                    }
                });
            },


            add_googlemap : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_googlemap: ' + css_selector + ' .' + settings.class_googlemap, 'info');
                $(css_selector + ' .' + settings.class_googlemap).each( function (index) {
                    var el = $(this);
                    if (!el.attr('id')) el.attr('id', settings.class_googlemap + '_' + methods.random_number(10000));
                    var id           = el.attr('id');
                    var lat          = el.attr('data-lat') || 59.9138688;
                    var lng          = el.attr('data-lng') || 10.7522454;
                    var search       = el.attr('data-search');
                    var map_canvas   = id + '_map_canvas';
                    var search_field = id + '_search_field';
                    var position     = el.attr('data-latlng-input') || 'geotag_position';
                    var height       = el.attr('data-height') || el.height() || 300;
                    var marker_title = el.attr('data-marker-title');
                    var info_content = el.attr('data-info-content');

                    // Insert search field if wanted
                    if (search && !$('#' + search_field).length>0) {
                        var h = 20;
                        $('<div class="googlesearch" style="width:100%; height:' + h + 'px;"><input id="' + search_field + '"  type="text"/></div><div class="clear"></div>').appendTo(el);
                        height = height-h;
                    }
                    // Insert map_canvas
                    if (!$('#' + map_canvas).length>0) {
                        $('<div id="' + map_canvas + '" class="googlemap" style="width:100%; height:' + height + 'px;">Loading google map...</div>').appendTo(el);
                    }

                    var geocoder;
                    var map;
                    var marker;
                    var info;
                    var latlng = new google.maps.LatLng(lat, lng);
                    var opt = {
                        zoom: (el.attr('data-lat') ? 10 : 6),
                        center: latlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    // Initializing map
                    map = new google.maps.Map(document.getElementById(map_canvas), opt);

                    // Geocoder
                    geocoder = new google.maps.Geocoder();
                    marker = new google.maps.Marker({
                        position: latlng,
                        map: map,
                        draggable: true,
                        title: marker_title
                    });

                    info = new google.maps.InfoWindow({
                        content: '<h1>' + marker_title + '</h1>' + info_content
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        info.open(map, marker);
                    });

                    $('#' + search_field).autocomplete({
                        //This bit uses the geocoder to fetch address values
                        source: function (request, response) {
                            geocoder.geocode( {'address': request.term }, function (results, status) {
                                response($.map(results, function (item) {
                                    return {
                                        label:  item.formatted_address,
                                        value: item.formatted_address,
                                        latitude: item.geometry.location.lat(),
                                        longitude: item.geometry.location.lng()
                                    }
                                }));
                            })
                        },
                        //This bit is executed upon selection of an address
                        select: function (event, ui) {
                            $('#' + position).val(ui.item.latitude + ',' + ui.item.longitude).triggerHandler('changed');
                            var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
                            marker.setPosition(location);
                            map.setCenter(location);
                        }
                    });

                    google.maps.event.addListener(marker, 'drag', function () {
                        geocoder.geocode({'latLng': marker.getPosition()}, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[0]) {
                                    $('#' + search_field).val(results[0].formatted_address);
                                    $('#' + position).val(marker.getPosition().lat() + ',' + marker.getPosition().lng()).triggerHandler('changed');
                                }
                            }
                        });
                    });


                    // Dynamic loading... TODO
                    // Check if google api is loaded.
                    // window.google = window.google || {}; google.maps = google.maps || {};
                    //if (!google) {
                    //  $('head').append(unescape('%3Cscript type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"%3E%3C/script%3E'));
                    //  init_map();
                    //} else {
                    //init_map();
                    //}

                });
            },


            add_editinplace : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_editinplace: ' + css_selector + ' .' + settings.class_editinplace, 'info');
                $(css_selector + ' .' + settings.class_editinplace).each( function (index) {
                    var el = $(this);
                    if (!el.attr('id')) el.attr('id', settings.class_editinplace + '_' + methods.random_number(10000));
                    var id           = el.attr('id');
                    var url         = el.attr('data-url');
                    var param       = el.attr('data-param');

                    $(el).editable(url, {
                        indicator  : '<img src="/tools/jafw/ajax-loader.gif">',
                        tooltip    : "Doubleclick to edit...",
                        event      : "dblclick",
                        style      : "inherit",
                        submit     : 'OK',
                        submitdata : methods.query_string(param)
                    });

                });
            },


            // add_badge : function ($this, css_selector) {
            //     if (settings.debug) methods.debug($this, 'add_badge: ' + css_selector + ' .' + settings.class_badge, 'info');
            //     $(css_selector + ' .' + settings.class_badge).each( function (index) {
            //         var el = $(this);
            //         if (!el.attr('id')) el.attr('id', settings.class_badge + '_' + methods.random_number(10000));
            //         var id    = el.attr('id');
            //         var text  = el.attr('data-text');
            //         if (text) {
            //             var pos = $(el).css('position');
            //             //console.log('position:' +  pos);
            //             if (!pos || pos == 'static' ) {
            //                 $(el).css('position', 'relative');
            //             }
            //             $(el).badger(text);
            //         }
            //     });
            // },


            add_modal : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_modal: ' + css_selector + ' .' + settings.class_modal, 'info');

                // Activate modal close links.
                $(css_selector + ' .' + settings.class_modal + '-close').bind({
                    click: function (event) {
                        var el = $(this);
                        $('.' + settings.class_modal + '_window').hide().remove();
                        $('.' + settings.class_modal + '_mask').hide().remove();
                    }
                });

                // Activate modal links.
                $(css_selector + ' .' + settings.class_modal).bind({
                    click: function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        var el = $(this);
                        var url         = el.attr('data-url') || el.attr('href');
                        var url_part    = url.split('\?');
                        var param       = el.attr('data-param') || url_part[1];
                        var height      = el.attr('data-height') || 400;
                        var width       = el.attr('data-width') || 500;
                        var delay       = el.attr('data-delay');
                        var delay_class = el.attr('data-delay-class');
                        var modal  = settings.class_modal + '_' + methods.random_number(10000);
                        var mask   = modal + '_mask';

                        // Insert mask
                        $('<div class="jafw-modal_mask" id="' + mask + '"></div>').appendTo($('body'));
                        // Insert window
                        $('<div class="jafw-modal_window" id="' + modal + '"></div>').appendTo($('body'));


                        // Load content into window
                        if (url) {
                            if (settings.debug) methods.debug($(this), 'add_modal: ' + el + ' is modal!, url_part[1]=' + url_part[1] + ', ' + url + ' -> ' + modal, 'action');
                            // Run ajax call...
                            methods.ajax({
                                url    : url,
                                param  : param,
                                target : modal,
                                delay  : delay,
                                delay_class : delay_class
                            });
                        } else {
                            if (settings.debug) methods.debug($(this), 'add_modal: ' + el + ' is modal but no URL defined.', 'warn');
                        }


                        // Get the screen height and width
                        var maskHeight = $(document).height();
                        var maskWidth = $(window).width();

                        // Set height and width to mask to fill up the whole screen
                        $('#' + mask).css({
                            'background-color' : '#000',
                            'display' : 'none',
                            'height' : maskHeight,
                            'left' : '0px',
                            'position' : 'absolute',
                            'top' : '0px',
                            'width'  : maskWidth,
                            'z-index' : 9990
                        });

                        // Set styles of the window.
                        $('#' + modal).css({
                            'background' : '#ffffff',
                            'border-radius' : '4px',
                            'display' : 'none',
                            'height' : height + 'px',
                            'overflow' : 'auto',
                            'padding' : '20px',
                            'position' : 'fixed',
                            'width' : width + 'px',
                            'z-index' : 9999
                        });


                        // transition effect
                        //$('#' + mask).fadeIn(1000);
                        $('#' + mask).fadeTo("slow",0.8);

                        // Get the window height and width
                        var winH = $(window).height();
                        var winW = $(window).width();

                        // Set the popup window to center
                        $('#' + modal).css('top',  winH/2-$('#' + modal).height()/2);
                        $('#' + modal).css('left', winW/2-$('#' + modal).width()/2);

                        // transition effect
                        $('#' + modal).fadeIn(1000);

                        // Hide if close button is clicked
                        $('#' + modal + ' .close').click(function (e) {
                            // Cancel the link behavior
                            e.preventDefault();
                            $('#' + modal).hide().remove();
                            $('#' + mask).hide().remove();
                        });

                        // Hide if mask is clicked.
                        $('#' + mask).click(function () {
                            $('#' + modal).hide().remove();
                            $('#' + mask).hide().remove();
                        });

                        // Hide when escape it hit.
                        $(document).keyup(function (e) {
                            //if (e.keyCode == 13) { // enter
                            //  $('#' + modal).hide().remove();
                            //  $('#' + mask).hide().remove();
                            //}
                            if (e.keyCode == 27) { // esc
                                $('#' + modal).hide().remove();
                                $('#' + mask).hide().remove();
                            }
                        });

                        $(window).resize(function () {
                            var box = $('#' + modal);
                            //Get the screen height and width
                            var maskHeight = $(document).height();
                            var maskWidth = $(window).width();
                            //Set height and width to mask to fill up the whole screen
                            $('#' + mask).css({'width':maskWidth,'height':maskHeight});
                            //Get the window height and width
                            var winH = $(window).height();
                            var winW = $(window).width();
                            //Set the popup window to center
                            box.css('top',  winH/2 - box.height()/2);
                            box.css('left', winW/2 - box.width()/2);
                        });
                    }
                });
            },


            tooltip_set_timer : function ($this, el) {
                var tooltip = $('#' + el.data('tooltip'));
                var hide_timer = tooltip.data('tooltip-hide-timer');
                var show_timer = el.data('tooltip-show-timer');
                if (settings.debug) methods.debug($(this), 'tooltip_set_timer: ' + el + ' tooltip_set_timer!, hide_timer=' + hide_timer + ', show_timer=' + show_timer, 'action');
                if (hide_timer) {
                    clearTimeout(hide_timer);
                    tooltip.removeData('tooltip-hide-timer');
                }
                if (!show_timer) {
                    var show_timer = setTimeout( function () {
                        methods.tooltip_show($this, el);
                        el.removeData('tooltip-show-timer');
                    }, settings.tooltip_delay_in);
                    el.data('tooltip-show-timer', show_timer);
                }
            },


            tooltip_clear_timer : function ($this, el) {
                var tooltip = $('#' + el.data('tooltip'));
                var hide_timer = tooltip.data('tooltip-hide-timer');
                var show_timer = el.data('tooltip-show-timer');
                if (settings.debug) methods.debug($(this), 'tooltip_clear_timer: ' + el + ' tooltip_clear_timer!, hide_timer=, ' + hide_timer + ', show_timer=' + show_timer, 'action');
                if (show_timer) {
                    clearTimeout(show_timer);
                    el.removeData('tooltip-show-timer');
                }
                if (!hide_timer) {
                    var hide_timer = setTimeout( function () {
                        methods.tooltip_hide($this, el);
                        tooltip.removeData('tooltip-hide-timer');
                    }, settings.tooltip_delay_out);
                    tooltip.data('tooltip-hide-timer', hide_timer);
                }
            },


            tooltip_show : function ($this, el) {
                var tooltip = el.data('tooltip') || settings.class_tooltip + '_' + methods.random_number(10000);
                if ($('#' + tooltip).data('tooltip_is_visible')) {
                    if (settings.debug) methods.debug($(this), 'tooltip_show: ' + el + ' tooltip_show! ' + tooltip + ', Doing nothing because element is visible. ', 'action');
                } else {
                    if (settings.debug) methods.debug($(this), 'tooltip_show: ' + el + ' tooltip_show! ' + tooltip + ', Showing element. ', 'action');
                    var offset = el.offset();
                    var h      = el.height();
                    var w      = el.width();
                    var url    = el.data('tooltip-url');
                    var param  = el.data('tooltip-param');
                    var height = el.data('tooltip-height') || settings.tooltip_height;
                    var width  = el.data('tooltip-width') || settings.tooltip_width;
                    // Add offset as params.
                    var delay       = el.data('tooltip-delay');
                    var delay_class = el.data('tooltip-delay-class');

                    // Setting tooltip id to trigger el.
                    el.data('tooltip', tooltip);
                    // Insert window
                    $('<div class="jafw-tooltip-container" id="' + tooltip + '"><div class="jafw-arrow-up" id="' + tooltip + '-arrow-up"></div><div class="jafw-tooltip-window jafw-tooltip" id="' + tooltip + '-window" data-tooltip="' + tooltip + '"></div></div>').appendTo($('body'));
                    methods.add_tooltip($this, '#' + tooltip);

                    // Load content into window
                    if (url) {
                        if (settings.debug) methods.debug($(this), 'tooltip_show: ' + el + ' loading ajax content!, ' + url + ' -> ' + tooltip, 'action');
                        // Run ajax call...
                        methods.ajax({
                            url    : url,
                            param  : param,
                            target : tooltip + '-window',
                            delay  : delay,
                            delay_class : delay_class,
                            keep_open : 1
                        });
                    } else {
                        if (settings.debug) methods.debug($(this), 'tooltip_show: ' + el + ' is tooltip but no URL defined.', 'warn');
                    }
                    // Set styles of the arrow.
                    $('#' + tooltip + '-arrow-up').css({
                        'border-left'   : '10px solid transparent',
                        'border-right'  : '10px solid transparent',
                        'border-bottom' : '10px solid #808080',
                        'font-size'     : '0px',
                        'height'        : '0px',
                        'line-height'   : '0px',
                        'margin-left'   : '20px',
                        'width'         : '0px'
                    });
                    // Set styles of the container.
                    $('#' + tooltip + '-window').css({
                        'background' : '#ffffff',
                        'border' : '4px #808080 solid',
                        'border-radius' : '4px',
                        'height' : height + 'px',
                        'overflow' : 'auto',
                        'padding' : '20px',
                        'width' : width + 'px'
                    });
                    // Set styles of the container.
                    $('#' + tooltip).css({
                        //'box-shadow' : '0px 0px 4px #000000',
                        'display' : 'none',
                        'left' : offset.left,
                        'position' : 'absolute',
                        'top' : offset.top + h,
                        'z-index' : 9999
                    });
                    // Show tooltip element.
                    $('#' + tooltip).show(100);
                    // Set is visible flag.
                    $('#' + tooltip).data('tooltip_is_visible', 1);
                }
            },


            tooltip_hide : function ($this, el) {
                var tooltip = $('#' + el.data('tooltip'));
                // Hide and remove tooltip element if visible.
                if (tooltip.data('tooltip_is_visible')) {
                    if (settings.debug) methods.debug($(this), 'tooltip_hide: ' + el + ' tooltip_hide! Hiding element., ', 'action');
                    tooltip.hide(100, 'swing').remove();
                    // Clear is_visible flag.
                    tooltip.removeData('tooltip_is_visible');
                } else {
                    if (settings.debug) methods.debug($(this), 'tooltip_hide: ' + el + ' tooltip_hide! Element is not visible. Doing nothing., ', 'action');
                }
            },


            add_tooltip : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_tooltip: ' + css_selector + ' .' + settings.class_tooltip, 'info');

                // Activate tooltip links.
                $(css_selector + ' .' + settings.class_tooltip).bind({
                    mouseenter: function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        var el = $(this);
                        methods.tooltip_set_timer($this, el);
                        if (settings.debug) methods.debug($(this), 'add_tooltip: ' + el + ' is mouseenter!, ', 'action');
                    },
                    mouseleave: function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        var el = $(this);
                        methods.tooltip_clear_timer($this, el);
                        if (settings.debug) methods.debug($(this), 'add_tooltip: ' + el + ' is mouseleave!, ', 'action');
                    },
                    click: function (event) {
                        // What should happend when I click this?
                    }

                });
            },


            add_endless : function ($this, css_selector) {

                //      $(css_selector + ' .' + settings.class_serverpush).bind({
                //          click: function (event) {
                //          var el = $(this);
                //
                //      $(window).scroll(function () {
                //          if ($(window).scrollTop() >= $(document).height() - $(window).height() - 100) {
                //          //Add something at the end of the page
                //          }
                //      });
                //
                //      if (settings.debug) methods.debug($this, 'add_endless: ' + css_selector + ' .' + settings.class_endless, 'info');
                //      $(css_selector + ' .' + settings.class_endless).each( function (index) {
                //          var el = $(this);
                //          if (!el.attr('id')) el.attr('id', settings.class_endless + '_' + methods.random_number(10000));
                //          var id    = el.attr('id');
                //          var text  = el.attr('data-text');
                //          if (text) {
                //          var pos = $(el).css('position');
                //          //console.log('position:' +  pos);
                //          if (!pos || pos == 'static' ) {
                //              $(el).css('position', 'relative');
                //          }
                //          $(el).endlessr(text);
                //          }
                //      });
            },


            callback_do_serverpush : function (jqXHR, textStatus, options) {
                // console.log($(this));
                // console.log(this);
                // console.log(this.element);
                // console.log(jqXHR);
                // console.log(textStatus);
                // console.log(options);
                var el = this.element;
                var timeout = this.timeout || 10000;
                setTimeout( function () {
                    methods.do_serverpush(el);
                }, timeout);
            },


            do_serverpush : function (el) {
                if (!el.attr('id')) el.attr('id', settings.class_serverpush + '_' + methods.random_number(10000));
                var ts = Math.round((new Date()).getTime() / 1000);
                el.data('last-check', ts);
                if (!el.data('last-load')) el.data('last-load', ts);
                var id      = el.attr('id');
                var url     = el.attr('data-url');
                var target  = el.attr('data-target') || el.attr('id'); //el.attr('data-target') || e.closest('.' + settings.class_click).attr('data-target');
                var param   = el.attr('data-param');
                var timeout = el.data('timeout') || 10000;
                var data = $.extend({}, methods.query_string(param), {
                    'last-check' : el.data('last-check'),
                    'last-load'  : el.data('last-load')
                });

                //jQuery.dump(e);
                if (url) {
                    if (settings.debug) methods.debug($(this), 'do_serverpush: ' + el + ' is serverpush!, ' + url + ' -> ' + target, 'action');
                    // Run ajax call...
                    methods.ajax({
                        loader_hide : 1,
                        element  : el,
                        url      : url,
                        param    : data,
                        target   : target,
                        complete : methods.callback_do_serverpush,
                        timeout  : timeout
                    });
                } else {
                    if (settings.debug) methods.debug($(this), 'do_serverpush: ' + el + ' is serverpush but no URL defined.', 'warn');
                }
            },


            add_serverpush : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_serverpush: ' + css_selector + ' .' + settings.class_serverpush, 'info');
                $(css_selector + ' .' + settings.class_serverpush).each( function (index) {
                    var el = $(this);
                    methods.do_serverpush(el);
                });
            },


            add_pageshow : function ($this, css_selector) {
                if (settings.debug) methods.debug($this, 'add_pageshow: ' + css_selector + ' .' + settings.class_pageshow, 'info');
                //$(css_selector + ' .' + settings.class_pageshow).bind({
                $(document).bind({
                    'pageshow':  function (event) {
                        var el = $(event.target);
                        if (!el.attr('id')) el.attr('id', settings.class_pageshow + '_' + methods.random_number(10000));
                        methods.init_actions($(this), 'body');
                        //methods.init_actions($(el), '#' + el.id);
                    }
                });
            },




            // ------------------------------------------------------------------------------------------
            // ------------------------------------------------------------------------------------------
            // a public method. for demonstration purposes only - remove it!
            foo_public_method : function () {
                // code goes here
            }
        }

        // private methods
        // these methods can be called only from inside the plugin
        //
        // private methods can be called as
        // helpers.methodName(arg1, arg2, ... argn)
        // where "methodName" is the name of a function available in the "helpers" object below; arg1 ... argn are
        // arguments to be passed to the method
        var helpers = {
            // a private method. for demonstration purposes only - remove it!
            foo_private_method: function () {
                // code goes here
            }
        }

        // if a method as the given argument exists
        if (methods[method]) {
            // call the respective method
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        // if an object is given as method OR nothing is given as argument
        } else if (typeof method === 'object' || !method) {
            // call the initialization method
            return methods.init.apply(this, arguments);
        // otherwise
        } else {
            // trigger an error
            $.error( 'Method "' +  method + '" does not exist in jafw plugin!');
        }
    }


})(jQuery);

jQuery(document).ready(function ($) {
    // Code using $ as usual goes here.
    jQuery.fn.exists = function (){return this.length>0;}
    $(document).jafw();

    // TODO: Should we include this or should this be a plugin?
    //$('head').append('<script type="text/javascript" src="/tools/jafw/js/libs/badger.js"></script>');
    // $('head').append('<link rel="stylesheet" href="/tools/jafw/css/badger.css" type="text/css" />');

    // Init syntax highlighting.
    // TODO: Make this optional.
    //try {
    //    if (jQuery.isFunction($.SyntaxHighlighter.init)) {
    //        $.SyntaxHighlighter.init();
    //        $('body').syntaxHighlight();
    //    }
    //} catch (err) {
//
    //}

    //    $(document).jafw('debug', 'test 123', 'msg');
});

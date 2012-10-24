JAFW - jQuery Ajax FrameWork
==============================
---

Inline javascript is a mess!
----------------------------
	<button onclick="$('#window_1').load('./ajax/hello_world.html');">Click me</button>
	<div id="window_1"<>/div>

This is better, but still not optimal
-------------------------------------
	<button id="button_1">Click me</button>
	<div id="window_1"></div>
	<script>
    	jQuery(document).ready(function($) {
        	$('#button_1').bind({
	            click: function (event) {
    	            event.stopPropagation();
        	        var el = $(event.target);
            	    el.load('./ajax/hello_world.html');
	            }
    	    });
	    });
	</script>

The Solution!
-------------
	<button class="jafw-click" data-url="./ajax/hello_world.html" data-target="	window_1">Click me</button>
	<div class="jafw-window" id="window_1"></div>
	            
	<!-- JavaScript at the bottom for fast page loading -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></	script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js">	</script>  
	<script src="../js/jafw-0.1.js"></script>
	</body>
	</html>

Why is inline javascript bad?
-----------------------------
* HTML file size
* Lack of caching
* Poor accessibility
* Difficult code maintenance. Cut'n paste is always bad!
* Difficult to keep track of all events => Bad performance
* Lack of flexibility
* Hard/not possible to use dipatching

Write unobtrusive javascript
----------------------------
* Try to make added behavior degrade gracefully.
* Use a for links, button for buttons and form for forms.

Keep your HTML clean
--------------------
• No javascript or CSS is allowed inside the HTML.
• Never!

Put the links to the javscripts at the bottom
---------------------------------------------
• Faster page loading.

Write plugins
-------------
* Object oriented
* Reuseable
* Easy to maintain
* All javascript in one place
* Fast loading

Make valid HTML
---------------
* Avoid quirks mode


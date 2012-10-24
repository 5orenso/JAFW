JAFW - jQuery Ajax FrameWork
==============================
An easy to use jQuery framwork to make your HTML 100% separated from the javascript. As a bonus your HTML will also validate :)

This is still work in progress, so please help me with comments, ideas, etc.

Usage
-----
To load content when as soon as possible:
```html
<div class="jafw-load" data-url="./ajax/hello_world.html" data-param="foo=bar">Loading...</div>
```

To activate on button with click:
```html
<button class="jafw-click" data-url="./ajax/hello_world.html" data-target="window_1" data-param="foo=bar">Click me</button>
<div class="jafw-window" id="window_1"></div>
```

To activate multiple buttons with click dispatcher:
```html
<div class="jafw-click">
	<button data-url="./ajax/hello_world.html" data-target="window_1" data-param="foo=bar&button=1">Click me 1</button>
	<button data-url="./ajax/hello_world.html" data-target="window_1" data-param="foo=bar&button=2">Click me 2</button>
	<button data-url="./ajax/hello_world.html" data-target="window_1" data-param="foo=bar&button=3">Click me 3</button>
</div>
<div class="jafw-window" id="window_1"></div>
```




Include these line in the bottom of the html
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>  
<script src="../js/jafw.js"></script>
```


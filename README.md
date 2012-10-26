JAFW - jQuery Ajax FrameWork
==============================
An easy to use jQuery framwork to make your HTML 100% separated from the javascript. As a bonus your HTML will also validate :)

This is still work in progress, so please help me with comments, ideas, etc.

Usage
-----
Include these line in the bottom of the html to enable jafw-parsing.
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>  
<script src="../js/jafw.js"></script>
```

To load content into container as soon as possible:
```html
<div class="jafw-load" data-url="./ajax/hello_world.html" data-param="foo=bar&gomle=foobar">Loading...</div>
```

To activate on button with click:
```html
<button class="jafw-click" data-url="./ajax/hello_world.html" data-target="window_1" data-param="foo=bar&gomle=foobar">Click me</button>
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

To activate keyup event on an input field:
```html
<input class="jafw-keyup" name="myinput" data-url="./ajax/hello_world.html" data-target="window_1">
<div class="jafw-window" id="window_1"></div>
```

To activate change event on an input field:
```html
<input type="email" class="jafw-change" name="myinput" data-url="./ajax/hello_world.html" data-target="window_1">
<div class="jafw-window" id="window_1"></div>
```

To activate sortable lists:
```html
<div id="mylist" class="jafw-sortable" data-url="./ajax/hello_world.html" data-param="foo=123&bar=456" data-target="window_1">
	<div id="el_1">Element 1</div>
	<div id="el_2">Element 2</div>
	<div id="el_3">Element 3</div>
	<div id="el_4">Element 4</div>
</div>
<div class="jafw-window" id="window_1"></div>
```



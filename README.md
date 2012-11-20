JAFW - jQuery Ajax FrameWork
==============================
An easy to use jQuery framwork to make your HTML 100% separated from the javascript. As a bonus your HTML will also validate :)

This is still work in progress, so please help me with comments, ideas, etc.

Demos are available on [my blog](http://litt.no/tools/jafw/demo/index.html).

Usage
-----
Include these line in the bottom of the html to enable jafw-parsing.
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script>  
<script src="../js/jafw.js"></script>
```

### To load dynamic content into container as soon as possible:
```html
<div class="jafw-load" data-url="./ajax/hello_world.html" data-param="foo=bar&gomle=foobar">Loading...</div>
```

### To activate on button with click:
```html
<button class="jafw-click" data-url="./ajax/hello_world.html" data-target="window_1" data-param="foo=bar&gomle=foobar">Click me</button>
<div class="jafw-window" id="window_1"></div>
```

### To activate multiple buttons with click dispatcher:
```html
<div class="jafw-click">
	<button data-url="./ajax/hello_world.html" data-target="window_1" data-param="foo=bar&button=1">Click me 1</button>
	<button data-url="./ajax/hello_world.html" data-target="window_1" data-param="foo=bar&button=2">Click me 2</button>
	<button data-url="./ajax/hello_world.html" data-target="window_1" data-param="foo=bar&button=3">Click me 3</button>
</div>
<div class="jafw-window" id="window_1"></div>
```

### To activate keyup event on an input field:
```html
<input class="jafw-keyup" name="myinput" data-url="./ajax/hello_world.html" data-target="window_1">
<div class="jafw-window" id="window_1"></div>
```

### To activate change event on an input field:
```html
<input type="email" class="jafw-change" name="myinput" data-url="./ajax/hello_world.html" data-target="window_1">
<div class="jafw-window" id="window_1"></div>
```

### To activate sortable lists:
```html
<div id="mylist" class="jafw-sortable" data-url="./ajax/hello_world.html" data-param="foo=123&bar=456" data-target="window_1">
	<div id="el_1">Element 1</div>
	<div id="el_2">Element 2</div>
	<div id="el_3">Element 3</div>
	<div id="el_4">Element 4</div>
</div>
<div class="jafw-window" id="window_1"></div>
```

### To activate tabs:
```html
<div class="jafw-tabs">
	<ul>
		<li><a href="#tabs-1">Nunc tincidunt</a></li>
		<li><a href="#tabs-2">Proin dolor</a></li>
	</ul>
	<div id="tabs-1" data-url="./ajax/hello_world.html">
	</div>
	<div id="tabs-2">
		<p>Morbi tincidunt, dui sit amet facilisis feugiat, odio metus gravida ante, ut pharetra massa metus id nunc. Duis scelerisque molestie turpis.</p>
	</div>
</div>
```

### To activate accordion:
```html
<div class="jafw-accordion">
	<h3>Section 1</h3>
	<div>
		<p>
			Sed non urna. Donec et ante. Phasellus eu ligula. Vestibulum sit amet purus. Vivamus hendrerit, dolor at aliquet laoreet, mauris turpis porttitor velit, faucibus interdum tellus libero ac justo. Vivamus non quam. In suscipit faucibus urna.
		</p>
	</div>
	<h3>Section 2</h3>
	<div data-url="ajax/hello_world.html">
	</div>
</div>
```


Authors
-------
**Øistein Sørensen**

+ http://litt.no/twitter
+ http://litt.no/linkedin


Copyright and license
---------------------

Copyright 2012 Twitter, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.



To use delegatejs with prototype include:

```html
<script type="text/javascript" src='delegate-generic.js'></script>
<script type="text/javascript" src='delegate-prototype.js'></script>
```

in you HTML.

To use delegatejs with mootools include:

```html
<script type="text/javascript" src='delegate-generic.js'></script>
<script type="text/javascript" src='delegate-mootools.js'></script>
```

Now you can do event delegation in the following way:

```html
<html>
	<head>
		<title>Event Delegation with Prototype</title>
		<script type="text/javascript" src='prototype.js'></script>
		<script type="text/javascript" src='delegate-generic.js'></script>
		<script type="text/javascript" src='delegate-prototype.js'></script>
		<script type="text/javascript">
			document.observe('dom:loaded', function() {
				$('someDIV').delegate('submit', '.dont-submit', function(event){
					event.stop();
					alert('The form was not submitted!');
				});
			});
		</script>
	</head>
	<body>
		<div id="someDIV">
			<form class="dont-submit">
				<input type="submit" value="Submit">
			</form>
			<form class="dont-submit">
				<input type="submit" value="Submit">
			</form>
		</div>
	</body>
</html>
```

delegatejs works for submit, change, focus and blur event - as well as all bubbling events.

Please check out the tests for more examples, or read my [blog entry](http://www.dreamchain.com/event-delegation-with-prototype-and-mootools/).

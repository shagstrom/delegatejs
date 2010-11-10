To use delegatejs with prototype include:

	<script type="text/javascript" src='delegate-generic.js'></script>
	<script type="text/javascript" src='delegate-prototype.js'></script>

in you HTML.

To use delegatejs with mootools include:

	<script type="text/javascript" src='delegate-generic.js'></script>
	<script type="text/javascript" src='delegate-mootools.js'></script>


Now you can do event delegation in the following way:

	<html>

	  <head>
	    <title>Example</title>
	    <script type="text/javascript" src='prototype.js'></script>
	    <script type="text/javascript" src='delegate-generic.js'></script>
	    <script type="text/javascript" src='delegate-prototype.js'></script>
	  </head>

	  <body>
	    <div id="someDIV">

	      <form class="please-delegate-me">
	        <div>
	          <input type="submit" value="Submit">
	        </div>
	      </form>

	      <form class="please-delegate-me">
	        <div>
	          <input type="submit" value="Submit">
	        </div>
	      </form>

	    </div>
	  </body>
	</html>


	$('someDIV').delegate('submit', '.please-delegat-me', function(event){
	  event.stop();
	  alert('The form was not submitted!');
	});

delegatejs works for submit, change, focus and blur event - as well as all bubbling events.

Please check out the tests for more examples!

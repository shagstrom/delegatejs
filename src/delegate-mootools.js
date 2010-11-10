(function() {
	var matcher = function(element, selector){return element.match(selector);};
	var extender = function(event) { return new Event(event);};
	var methods = DelegateGeneric(matcher, extender);
	Element.implement({delegate: function(eventType, selector, handler){ methods.delegate(this, eventType, selector, handler)}});
	Element.implement({stopDelegating: function(eventType, selector, handler){ methods.stopDelegating(this, eventType, selector, handler)}});
})();


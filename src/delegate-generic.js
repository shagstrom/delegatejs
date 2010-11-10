(function(){

	var PseudoEvent = (function(){

		var listeners = {};

		function add(element, type, callBack) {
			if (!listeners[type]) {
				listeners[type] = [];
			}
			listeners[type].push([element, callBack]);
		}

		function remove(element, type, callBack) {
			var typeListeners = listeners[type];
			if (typeListeners) {
				for (var j = typeListeners.length, typeListener; j > 0;) {
					typeListener = typeListeners[--j];
					if (typeListener[0] == element && typeListener[1] == callBack) {
						typeListeners.splice(j, 1);
					}
				}
			}
		}

		function fire(element, type, event) {
			var typeListeners = listeners[type];
			if (typeListeners) {
				for (var j = typeListeners.length, typeListener; j > 0;) {
					typeListener = typeListeners[--j];
					if (typeListener[0].contains(element)) {
						typeListener[1](event);
					}
				}
			}
		}

		return {
			add: add,
			remove: remove,
			fire: fire
		};

	})();

	var ProxyListeners = (function() {

		var hasListeners, formInFocus;

		function addIfNotAdded() {
			if (!hasListeners) {
				hasListeners = true;
				document.body.attachEvent('onfocusin', focusinHandler);
				document.body.attachEvent('onfocusout', focusoutHandler);
			}
		}

		function focusinHandler() {
			var target = window.event.srcElement;
			var form = target.form;
			if (formInFocus && formInFocus !== form) {
				formInFocus.detachEvent('onsubmit', shortlivedSubmitEvent);
				formInFocus = undefined;
			}
			if (form && formInFocus !== form) {
				form.attachEvent('onsubmit', shortlivedSubmitEvent);
				formInFocus = form;
			}
			if (target.type && target.type.match(/file|text|select/)) {
				target.attachEvent('onchange', shortlivedChangeEvent);
			}
			if (form) {
				PseudoEvent.fire(target, 'focus', window.event);
			}
		}

		function focusoutHandler() {
			var target = window.event.srcElement;
			if (target.type && target.type.match(/file|text|select/)) {
				target.detachEvent('onchange', shortlivedChangeEvent);
			}
			if (target.form) {
				PseudoEvent.fire(target, 'blur', window.event);
			}
		}

		function shortlivedChangeEvent() {
			PseudoEvent.fire(window.event.srcElement, 'change', window.event);
		}

		function shortlivedSubmitEvent() {
			PseudoEvent.fire(window.event.srcElement, 'submit', window.event);
		}

		return {
			addIfNotAdded: addIfNotAdded
		};

	})();

	var HandlerStorage = (function(){

		function push(element, eventType, selector, handler, internalHandler) {
			if (!element._delegates) {
				element._delegates = {};
			}
			if (!element._delegates[eventType]) {
				element._delegates[eventType] = {};
			}
			if (!element._delegates[eventType][selector]) {
				element._delegates[eventType][selector] = [];
			}
			element._delegates[eventType][selector].push({handler: handler, internalHandler: internalHandler});
		}

		function pop(element, eventType, selector, handler) {
			var handlers = [];
			if (element._delegates && element._delegates[eventType]) {
				if (selector) {
					popSelector(element._delegates[eventType], handlers, selector, handler);
				} else {
					for (selector in element._delegates[eventType]) {
						popSelector(element._delegates[eventType], handlers, selector);
					}
				}
				if (isEmpty(element._delegates[eventType])) {
					delete element._delegates[eventType];
				}
			}
			return handlers;
		}

		function isEmpty(object) {
			for (var property in object) {
				return false;
			}
			return true;
		}

		function popSelector(type, handlers, selector, handler) {
			if (type[selector]) {
				for (var j = type[selector].length; --j >= 0;) {
					if (!handler || type[selector][j].handler === handler) {
						handlers.push(type[selector].splice(j, 1).shift());
					}
				}
				if (!type[selector].length) {
					delete type[selector];
				}
			}
		}

		return {
			push: push,
			pop: pop
		};

	})();

	var DelegateGeneric = function(selectorMatcher, eventExtender){

		var SUPPORTS_ADD_EVENT_LISTENER = !!window.addEventListener;
		
		function delegate(element, eventType, selector, handler) {
			var internalHandler = createInternalHandler(element, eventType, selector, handler);
			HandlerStorage.push(element, eventType, selector, handler, internalHandler);
			addListener(element, eventType, internalHandler);
		}

		function addListener(element, eventType, internalHandler) {
			if (eventType.match(/^focus|blur|change|submit$/) && !SUPPORTS_ADD_EVENT_LISTENER) {
				ProxyListeners.addIfNotAdded();
				PseudoEvent.add(element, eventType, internalHandler);
			} else if (SUPPORTS_ADD_EVENT_LISTENER) {
				element.addEventListener(eventType, internalHandler, eventType.match(/^focus|blur|submit$/));
			} else {
				element.attachEvent('on' + eventType, internalHandler);
			}
		}

		function createInternalHandler(element, eventType, selector, handler) {
			return function(event) {
				event = event || window.event;
				var target = event.target || event.srcElement;
				if (matchesAncestor(element, target, selector)) {
					handler(eventExtender(event));
				}
			};
		}

		function matchesAncestor(element, target, selector) {
			for (;element != target; target = target.parentNode) {
				if (selectorMatcher(target, selector)) {
					return true;
				}
			}
			return selectorMatcher(target, selector);
		}

		function stopDelegating(element, eventType, selector, handler) {
			var handlers = HandlerStorage.pop(element, eventType, selector, handler);
			for (var j = handlers.length; j > 0;) {
				removeListener(element, eventType, handlers[--j].internalHandler);
			}
		}

		function removeListener(element, eventType, internalHandler) {
			if (eventType.match(/^focus|blur|change|submit$/) && !SUPPORTS_ADD_EVENT_LISTENER) {
				PseudoEvent.remove(element, eventType, internalHandler);
			} else if (SUPPORTS_ADD_EVENT_LISTENER) {
				element.removeEventListener(eventType, internalHandler, eventType.match(/^focus|blur|submit$/));
			} else {
				element.detachEvent('on' + eventType, internalHandler);
			}
		}

		return {
			delegate: delegate,
			stopDelegating: stopDelegating
		};

	};
	
	window.HandlerStorage = HandlerStorage;
	window.DelegateGeneric = DelegateGeneric;
	
})();

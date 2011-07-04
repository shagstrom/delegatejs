var simulateEvent = function(element, eventName, options) {
	var bubble = true;
	var cancelable = true;
	var event;
	if (document.createEvent) {
		// event = document.createEvent("MouseEvents");
		// event.initMouseEvent("click", true, true, window,
		//     0, 0, 0, 0, 0, false, false, false, false, 0, null);
		event = document.createEvent("UIEvents");
		event.initUIEvent(eventName, bubble, cancelable, window, 1);
		Object.extend(event, options || {});
		element.dispatchEvent(event);
	} else if (document.createEventObject) {
		event = document.createEventObject();
		Object.extend(event, options || {});
		event.cancelBubble = cancelable;
		element.fireEvent("on" + eventName, event);
	} else {
		throw new Error("Firing event failed");
	}
}

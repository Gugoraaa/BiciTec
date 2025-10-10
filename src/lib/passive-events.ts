// This file adds passive event listeners to improve scrolling performance
// and prevent console warnings about non-passive event listeners

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  // Add event listener for touch events
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  
  // Define the type for the this context
  type EventTargetThis = Window & typeof globalThis;

  // Override the addEventListener method
  Object.defineProperty(EventTarget.prototype, 'addEventListener', {
    value: function(
      this: EventTargetThis,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) {
      // Only modify the options for wheel and touch events
      const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
      if (passiveEvents.includes(type)) {
        const optionsWithPassive: AddEventListenerOptions = {
          ...(typeof options === 'boolean' ? { capture: options } : options || {}),
          passive: true,
        };
        return originalAddEventListener.call(this, type, listener, optionsWithPassive);
      }
      
      // For other events, use the original method
      return originalAddEventListener.call(this, type, listener, options);
    },
    writable: true,
    configurable: true
  });
}

// This is a side-effect only module
export {};

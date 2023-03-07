interface IEventListener {
  [event: string]: Function[]
}

export class EventEmitter {
  protected callbacks: IEventListener;

  constructor() {
    this.callbacks = {};
  }

  on(event:string, cb:CallableFunction) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(cb);
  }

  clean() {
    this.callbacks = {};
  }

  /**
   *
   * @param {string} event event name
   * @param {Function} listener event listener
   * @return {number}
   *  `-1` if event is't not defined
   *  `0` if listeners is't defined
   *  `1` if listeners is defined
   */
  removeListener(event: string, listener: Function): number {
    const callbacks = this.callbacks[event];

    if (!callbacks) return -1;
    if (callbacks.length === 0) return 0;

    for (let i = callbacks.length-1; i >= 0; i--) {
      const callback = callbacks[i];

      if (callback === listener) callbacks.splice(i, 1);
    }

    return 1;
  }

  /**
   * method removed all event listeners
   *
   * @param {string} event event name
   */
  removeAllListeners(event: string) {
    if (this.callbacks[event]) this.callbacks[event] = [];
  }

  emit(event: string, data:any) {
    const cbs = this.callbacks[event];
    if (cbs) {
      cbs.forEach((cb:any) => cb(data));
    }
  }
}

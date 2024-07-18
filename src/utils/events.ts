function subscribeEvt(eventName: string, listener: any) {
  document.addEventListener(eventName, listener);
}

function unsubscribeEvt(eventName: string, listener: any) {
  document.removeEventListener(eventName, listener);
}

function publishEvt(eventName: string, data?: any) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

export { publishEvt, subscribeEvt, unsubscribeEvt };

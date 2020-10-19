/* eslint-disable no-undef */
if (window.navigator.serviceWorker) {
    /* eslint-disable no-undef */
    window.navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage({ type: 'init' });
    });
}
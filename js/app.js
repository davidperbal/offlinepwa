/**
 * Check if exist service worker in navigator and register file.
 */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function() {
      console.log('Service worker registered.');
    })
    .catch(function() {
      console.warn('Service worker failed.')
    });
}

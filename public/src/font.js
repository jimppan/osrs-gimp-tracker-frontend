var font = new FontFaceObserver('OSRS Font');

font.load().then(function () {
  console.log('OSRS Font has loaded.');
}).catch(function () {
  console.log('OSRS Font failed to load.');
});

font = new FontFaceObserver('OSRS Font Plain');

font.load().then(function () {
  console.log('OSRS Font Plain has loaded.');
}).catch(function () {
  console.log('OSRS Font Plain failed to load.');
});
var font = new FontFaceObserver('OSRS Font');
font.load().then(function () {
  console.log('OSRS Font has loaded.');
}).catch(function () {
  console.log('OSRS Font failed to load.');
});
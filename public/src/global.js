var GIMP_TRACKER_CACHE_VERSION = "2021-09-02_1"


// fuck it, go full global

var APP = null;
var WORLD = null;
var CAMERA = null;
var INPUT = null;
var HUD = null;

var RENDERQUEUE = null;

var SOCKET = null;

var OBJECTS = [];        // any interactable object on the screen that can change

var PLAYERS = new Map();  // connected players
var OVERLAYS = new Map(); // stuff like world text, overlays


var MOUSE_OVER_OBJECT = null;
var SELECTED_OBJECT = null;

var DEVELOPER_MODE = true;
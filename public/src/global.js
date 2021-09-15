var GIMP_TRACKER_CACHE_VERSION = "2021-09-02_1"


// fuck it, go full global
var JSON_MAP_DATA = null;

var APP = null;
var WORLD = null;
var CAMERA = null;
var INPUT = null;
var HUD = null;

var RENDERQUEUE = null;

var SOCKET = null;

var OBJECTS = [];        // any interactable world object on the screen that can change
var HUD_OBJECTS = [];    // any interactable hud object on the screen that can change
var DEV_OBJECTS = [];

var PLAYERS = new Map();  // connected players
var OVERLAYS = new Map(); // stuff like world text, overlays

var MOUSE_OVER_OBJECT = null;
var LAST_MOUSE_CLICKED_OBJECT = null;
var SELECTED_OBJECT = null;

var DEVELOPER_MODE = false;
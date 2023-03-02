var GIMP_TRACKER_CACHE_VERSION = "2021-09-02_1"


// fuck it, go full global
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
var CAMERA_FOLLOW_OBJECT = null;

var DEVELOPER_MODE = false;

var USING_PHONE = false;

const HUD_LAYERS = 
{
    WORLD_BACKGROUND: 0,
    WORLD_FOREGROUND: 1,
    INTERFACE_BACKGROUND: 2,
    INTERFACE: 3,
    INTERFACE_FOREGROUND: 4,

    TOOLTIP_BACKGROUND: 5,
    TOOLTIP_FOREGROUND: 6,
}
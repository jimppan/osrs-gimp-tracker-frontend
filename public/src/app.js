import {} from "./font.js"

import { Camera} from './camera.js'
import { World } from "./world.js";
import { Input } from "./input.js";
import { RenderQueue } from "./renderqueue.js"
import { Hud } from "./hud/hud.js"

import {} from "./backend.js" // idk whats going on but if I load font after I connect socket, fonts wont load


const canvas = document.getElementById('osrscanvas');

var renderer = new PIXI.Renderer({
    view: canvas,
    width: window.innerWidth,
    height: window.innerHeight,

    antialias:false,
    resolution: 1,
    autoDensity: false,
})

var stage = new PIXI.Container();

var worldContainer = new PIXI.Container();

var mapContainer = new PIXI.Container();
var objectContainer = new PIXI.Container();
var overlayContainer = new PIXI.Container();

var devContainer = new PIXI.Container();
var hudContainer = new PIXI.Container();

worldContainer.addChild(mapContainer);
worldContainer.addChild(objectContainer);
worldContainer.addChild(overlayContainer);

stage.addChild(worldContainer);
stage.addChild(hudContainer);
stage.addChild(devContainer);

var ticker = new PIXI.Ticker();
var loader = new PIXI.Loader();

APP = {
    stage: stage,

    worldContainer: worldContainer, // z = 0

    mapContainer: mapContainer, // z = 1
    objectContainer: objectContainer, // z = 2
    overlayContainer: overlayContainer, // z = 3

    hudContainer: hudContainer, // z = 4
    devContainer: devContainer, // z = 5

    renderer: renderer,
    loader: loader,
    ticker: ticker,
    view: canvas,
}

PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;

overlayContainer.sortableChildren = true;

// Preload some assets
//APP.ticker.maxFPS = 144;

// OTHER VARS
WORLD = new World();
CAMERA = new Camera();

// move X and Y in opposite direction because its the camera
// camera will alight top left, so add window height / width divided by 2 to center it
// add 64 to Y cuz im lazy to invert the coordinates for OSRS position
// multiply by 4 since 1 tile is 4 pixels
CAMERA.setPosition(50 * -256 + (window.innerWidth / 2), (50 * -256 + (window.innerHeight / 2)) - 64 * 4);
INPUT = new Input();
RENDERQUEUE = new RenderQueue();
HUD = new Hud();


// init functions call loader.load
APP.loader.use(onTextureLoaded);
APP.loader.reset();

INPUT.init();
WORLD.init(0);
HUD.init();

// preload resources
APP.loader.load(loaderComplete);


// once we loaded resources, start the app
function loaderComplete(loader, resources)
{
    // once we finished preloading 
    console.log("Loaded assets.");

    HUD.onAssetsLoaded();

    // render loop
    ticker.add((delta) => {
        INPUT.update()
        CAMERA.update();
    
        devContainer.visible = DEVELOPER_MODE;
    
        renderer.render(stage);
    })
    
    ticker.start();
    
    document.body.appendChild(APP.view);
}

// late loading textures
function onTextureLoaded(resource, next)
{
    //e.name = resource name
    //e.error is null if success
    if(resource.error)
    {
        next();
        return;
    }

    var chunk = RENDERQUEUE.get(resource.name);
    if(chunk == null)
    {
        next();
        return;
    }

    chunk.sprite.texture = resource.texture;
}
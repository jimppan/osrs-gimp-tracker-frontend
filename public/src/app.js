import {} from "./font.js"

import {Camera} from './camera.js'
import { TILE_SIZE, CHUNK_TILE_HEIGHT, World } from "./world.js";
import { Input } from "./input.js";
import { RenderQueue } from "./renderqueue.js"

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
var objectContainer = new PIXI.Container();
var hudContainer = new PIXI.Container();

stage.addChild(worldContainer);
stage.addChild(objectContainer);

stage.addChild(hudContainer);

var ticker = new PIXI.Ticker();
var loader = new PIXI.Loader();

APP = {
    stage: stage,

    worldContainer: worldContainer, // z = 0
    objectContainer: objectContainer, // z = 1
    hudContainer: hudContainer, // z = 2

    renderer: renderer,
    loader: loader,
    ticker: ticker,
    view: canvas,
}

PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;



/* const osrsFont = new FontFace('OSRS Font', 'url(font/RuneScape-Bold-12.ttf)');

//stage.sortableChildren = true;

/* MAP_LAYER = new PIXI.display.Layer();
OBJECTS_LAYER = new PIXI.display.Layer(); */


// render loop
ticker.add(() => {
    renderer.render(stage);
})

ticker.start();



document.body.appendChild(APP.view);
//APP.ticker.maxFPS = 144;

// OTHER VARS
WORLD = new World();
CAMERA = new Camera();
CAMERA.setPosition(50 * -256, 50 * -256);
INPUT = new Input();
RENDERQUEUE = new RenderQueue();

INPUT.init();
WORLD.init(0);
APP.loader.use(onTextureLoaded);

// late loading textures
function onTextureLoaded(e)
{
    //console.log("loaded")
    //e.name = resource name
    //e.error is null if success
    if(e.error)
        return;

    var chunk = RENDERQUEUE.get(e.name);
    if(chunk == null)
        return;

    chunk.sprite.texture = e.texture;
}
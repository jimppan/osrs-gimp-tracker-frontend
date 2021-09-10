
import {Camera} from './camera.js'
import { TILE_SIZE, CHUNK_TILE_HEIGHT, World } from "./world.js";
import { Input } from "./input.js";
import { RenderQueue } from "./renderqueue.js"


const canvas = document.getElementById('osrscanvas');

var renderer = new PIXI.Renderer({
    view: canvas,
    width: window.innerWidth,
    height: window.innerHeight,

    antialias:true,
    resolution: 1,
    autoDensity: true,
})

var stage = new PIXI.Container();
var ticker = new PIXI.Ticker();
var loader = new PIXI.Loader();

APP = {
    stage: stage,
    renderer: renderer,
    loader: loader,
    ticker: ticker,
    view: canvas,
}

// render loop
ticker.add(() => {
    renderer.render(stage);
})
ticker.start();

PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

document.body.appendChild(APP.view);
//APP.ticker.maxFPS = 144;

// OTHER VARS
WORLD = new World();
CAMERA = new Camera();
CAMERA.setPosition(50 * -256, 50 * -256);
INPUT = new Input();
RENDERQUEUE = new RenderQueue();

INPUT.init();
WORLD.initMap(0);
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
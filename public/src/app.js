
import {Camera} from './camera.js'
import { TILE_SIZE, CHUNK_TILE_HEIGHT, World } from "./world.js";
import { Input } from "./input.js";
import { RenderQueue } from "./renderqueue.js"

APP = new PIXI.Application(
    {
        width: window.innerWidth,
        height: window.innerHeight,
        resizeTo:window
    }
);
document.body.appendChild(APP.view);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
//APP.ticker.maxFPS = 144;

// OTHER VARS
WORLD = new World();
CAMERA = new Camera();
CAMERA.setPosition(50 * -512, 50 * -512);
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
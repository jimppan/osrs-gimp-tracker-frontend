import {} from "./font.js"

import { Camera} from './camera.js'
import { World } from "./world.js";
import { Input } from "./input.js";
import { RenderQueue } from "./renderqueue.js"
import { AddItemComposition } from "./itemdatabase.js";
import { Hud } from "./hud/hud.js"

import { ConnectToBackend } from "./backend.js" // idk whats going on but if I load font after I connect socket, fonts wont load


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

var isAssetsLoaded = false;
var elapsedTime = 0;


APP = {
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

    elapsedTime:elapsedTime,
    isAssetsLoaded:isAssetsLoaded,
}

PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;

overlayContainer.sortableChildren = true;
hudContainer.sortableChildren = true;

// Preload some assets
//APP.ticker.maxFPS = 144;

// OTHER VARS
WORLD = new World();
CAMERA = new Camera();

CAMERA.setPosition(50 * -256 + (window.innerWidth / 2), 52 * -256);
INPUT = new Input();
RENDERQUEUE = new RenderQueue();
HUD = new Hud();

hudContainer.position.y = -window.innerHeight;
devContainer.position.y = -window.innerHeight;
stage.scale.y = -1;
//worldContainer.scale.set(-1);
// init functions call loader.load
APP.loader.use(onTextureLoaded);
APP.loader.reset();


var chunkposJsonURL = "./chunkpos.json";
var itemcompJsonURL = "./itemcomp.json";

// load json data first, needed to preload textures
$.ajax({
    type: 'GET',
    url: chunkposJsonURL,
    dataType: 'json',
    success: (chunkpos) => 
    {
        JSON_MAP_DATA = chunkpos;
        $.ajax({
            type: 'GET',
            url: itemcompJsonURL,
            dataType: 'json',
            success: (itemcomp) => 
            {
                for(var i = 0; i < itemcomp.items.length; i++)
                {
                    var item = itemcomp.items[i];
                    AddItemComposition(item.id, item.name, item.stackable, item.tradable);
                }

                APP.loader.reset();

                // init
                INPUT.init();
                WORLD.init(0);
                HUD.init();

                // preload textures
                APP.loader.load(loaderComplete);
            },
            async: false
        });
    },
    async: false
});

// once we loaded resources, start the app
function loaderComplete(loader, resources)
{
    APP.isAssetsLoaded = true;
    // once we finished preloading 
    console.log("Loaded assets.");
    
    HUD.onAssetsLoaded();
    
    // render loop
    ticker.add((delta) => {

        APP.elapsedTime += ticker.elapsedMS;

        CAMERA.update();
        HUD.update();
    
        devContainer.visible = DEVELOPER_MODE;
    
        renderer.render(stage);
    })

    ConnectToBackend();
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

    resource.texture.rotate = 8;
    var chunk = RENDERQUEUE.get(resource.name);
    if(chunk == null)
    {
        next();
        return;
    }

    chunk.sprite.texture = resource.texture;
}
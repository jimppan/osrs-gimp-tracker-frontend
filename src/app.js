import {} from "./font.js"

import { World } from "./world.js";
import { Input } from "./input.js";
import { Camera} from './camera.js'
import { AddItemComposition } from "./resource/itemdatabase.js";
import { AddMapDefinition } from "./resource/mapdefinitions.js";
import { Hud } from "./hud/hud.js"

import { ConnectToBackend } from "./backend.js" // idk whats going on but if I load font after I connect socket, fonts wont load
import { ResourceManager } from "./resource/resourcemanager.js";
import { SpawnObject } from "./object.js";

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

stage.addChild(worldContainer);
stage.addChild(hudContainer);
stage.addChild(devContainer);

var ticker = new PIXI.Ticker();
var loader = new PIXI.Loader();

var resourceManager = new ResourceManager(loader);

var isAssetsLoaded = false;
var elapsedTime = 0;


APP = {
    worldContainer: worldContainer, // z = 0
    hudContainer: hudContainer, // z = 4
    devContainer: devContainer, // z = 5

    resourceManager: resourceManager,
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
for(var i = 0; i < WORLD.planeContainers.length; i++)
    worldContainer.addChild(WORLD.planeContainers[i]);
    
CAMERA = new Camera();
INPUT = new Input();
HUD = new Hud();

hudContainer.position.y = -window.innerHeight;
devContainer.position.y = -window.innerHeight;

stage.scale.y = -1;

var regionposJsonURL = "./regionpos.json";
var itemcompJsonURL = "./itemcomp.json";
var mapdefJsonURL = "./mapdefinitions.json";

// load json data first, needed to preload textures
$.ajax({
    type: 'GET',
    url: regionposJsonURL,
    dataType: 'json',
    success: (regionpos) => 
    {
        // got region pos

        $.ajax({
            type: 'GET',
            url: itemcompJsonURL,
            dataType: 'json',
            success: (itemcomp) => 
            {
                // got item def
                for(var i = 0; i < itemcomp.items.length; i++)
                {
                    var item = itemcomp.items[i];
                    AddItemComposition(item.id, item.name, item.stackable, item.tradable);
                }

                $.ajax({
                    type: 'GET',
                    url: mapdefJsonURL,
                    dataType: 'json',
                    success: (mapdef) => 
                    {
                        // got map defs
                        for(let i = 0; i < mapdef.length; i++)
                            AddMapDefinition(mapdef[i].id, mapdef[i].name, mapdef[i].display_name, mapdef[i].layer, mapdef[i].plane, mapdef[i].hidden != null && mapdef[i].hidden);

                            
                        // init
                        INPUT.init();
                        WORLD.init(regionpos);
                        HUD.init();

                        WORLD.addMapDefinitions(mapdef);
                        
                        // preload textures
                        APP.resourceManager.load(assetsLoaded);
                    },
                    async: false
                });
            },
            async: false
        });
    },
    async: false
});

// once we loaded resources, start the app
function assetsLoaded()
{
    APP.isAssetsLoaded = true;
    // once we finished preloading 
    console.log("Loaded assets.");

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        USING_PHONE = true;

    HUD.onAssetsLoaded();

    //CAMERA.setTargetPosition(50 * 256, 50 * 256);
    CAMERA.setPosition(50 * -256 + (window.innerWidth / 2), 50 * -256 - (window.innerHeight / 2));

    CAMERA.interruptedCameraPathing = true;

    ticker.maxFPS = 144;
    // render loop
    ticker.add((delta) => 
    {

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
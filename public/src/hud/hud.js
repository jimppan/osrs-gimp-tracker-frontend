import { StageObject, SpawnObject } from "../object.js";
import { HoverTooltip } from "./hovertooltip.js";
import { MainInterface } from "./maininterface.js"

const POINTER_CLICK_EMPTY_PATH = 
[
    '299-0.png',
    '299-1.png',
    '299-2.png',
    '299-3.png',
]

const POINTER_CLICK_OBJECT_PATH = 
[
    '299-4.png',
    '299-5.png',
    '299-6.png',
    '299-7.png',
]

var POINTER_CLICK_EMPTY_TEXTURES = [];
var POINTER_CLICK_OBJECT_TEXTURES = [];

export class Hud 
{
    constructor()
    {
        this.mainInterface = new MainInterface("MainInterface");
        this.hoverTooltip = new HoverTooltip("HoverTooltip");

        SpawnObject(this.hoverTooltip);
    }

    init()
    {
        this.mainInterface.init();

        APP.loader.baseUrl = 'img/ui/';
        APP.loader.add(POINTER_CLICK_EMPTY_PATH);
        APP.loader.add(POINTER_CLICK_OBJECT_PATH);
        APP.loader.baseUrl = '';
    }

    onAssetsLoaded()
    {
        this.mainInterface.onAssetsLoaded();

        // set animation texture arrays
        for(var i = 0; i < POINTER_CLICK_EMPTY_PATH.length; i++)
        {
            POINTER_CLICK_EMPTY_TEXTURES.push(APP.loader.resources[POINTER_CLICK_EMPTY_PATH[i]].texture);
            POINTER_CLICK_OBJECT_TEXTURES.push(APP.loader.resources[POINTER_CLICK_OBJECT_PATH[i]].texture);
        }

        this.clickAnim = new StageObject("ClickAnimation");
        this.clickAnim.graphic = new PIXI.AnimatedSprite(POINTER_CLICK_EMPTY_TEXTURES);

        this.clickAnim.graphic.loop = false;
        this.clickAnim.graphic.animationSpeed = 0.15;
        this.clickAnim.graphic.anchor.set(0.5,0.5);
        this.clickAnim.graphic.onComplete = () => {this.clickAnim.graphic.visible = false;}
        this.clickAnim.keepScale = true;
        this.clickAnim.graphic.zIndex = 1;

        this.mainInterface.setVisibility(false);

        SpawnObject(this.clickAnim);
        SpawnObject(this.mainInterface);
    }

    update()
    {
        this.mainInterface.update();
    }

    playClickAnimation()
    {
        if(MOUSE_OVER_OBJECT != null)
            this.clickAnim.graphic.textures = POINTER_CLICK_OBJECT_TEXTURES;
        else
            this.clickAnim.graphic.textures = POINTER_CLICK_EMPTY_TEXTURES;

        var cursorPos = CAMERA.getCursorWorldPosition();
        this.clickAnim.graphic.position.x = cursorPos.x;
        this.clickAnim.graphic.position.y = cursorPos.y;
        this.clickAnim.graphic.visible = true;

        this.clickAnim.graphic.gotoAndPlay(0);
    }
}
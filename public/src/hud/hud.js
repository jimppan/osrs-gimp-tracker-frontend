import { StageObject, SpawnObject } from "../object.js";
import { MainInterface } from "./interface.js"

const HUD_TEXT = new PIXI.TextStyle({
    fontFamily: 'OSRS Font',
    fontSize:'16px',
    fill: ['#ffffff'],
    //strokeThickness:1,
    dropShadow : true,
    dropShadowAlpha: 1,
    dropShadowAngle:0.6,
    dropShadowDistance: 4,
})

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
        this.mainInterface = new MainInterface();

        this.hoverText = new PIXI.Text("", HUD_TEXT);
        this.hoverText.position.x += 2;
        this.hoverText.position.y += 2;
        this.hoverText.resolution = 4;
        this.hoverText.anchor.set(0, 0);

        APP.hudContainer.addChild(this.hoverText);
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
        SpawnObject(this.clickAnim);
    }

    update()
    {
        if(MOUSE_OVER_OBJECT != null)
        {
            this.hoverText.text = MOUSE_OVER_OBJECT.name;
        }
        else
        {
            this.hoverText.text = "";
        }
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
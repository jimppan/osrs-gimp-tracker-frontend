import { StageObject, SpawnObject } from "../object.js";
import { updateOverlay } from "../overlays.js";
import { ACCOUNT_TYPE, ACCOUNT_TYPE_ICONS, Player } from "../player.js";
import { World } from "../world.js";
import { HoverTooltip } from "./hovertooltip.js";
import { MainInterface } from "./maininterface.js"
import { MouseTooltip } from "./mousetooltip.js";
import { XPDropper } from "./xpdrop.js";

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

const HOVER_TOOL_TIP_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'OSRS Font',
    fontSize:'16px',
    fill: ['#ffffff'],
    //strokeThickness:1,
    dropShadow : true,
    dropShadowAlpha: 1,
    dropShadowAngle:0.6,
    dropShadowDistance: 16,
})

var POINTER_CLICK_EMPTY_TEXTURES = [];
var POINTER_CLICK_OBJECT_TEXTURES = [];

export class Hud 
{
    constructor()
    {
        this.mainInterface = new MainInterface("MainInterface");
        this.hoverTooltip = new HoverTooltip("HoverTooltip", '', HOVER_TOOL_TIP_TEXT_STYLE, 16);
        this.mouseTooltip = new MouseTooltip("MouseTooltip");
        this.xpdropper = new XPDropper();

        SpawnObject(this.hoverTooltip);
        SpawnObject(this.mouseTooltip);
    }

    init()
    {
        this.mainInterface.init();
        this.xpdropper.init();

        APP.resourceManager.add('img/ui/', POINTER_CLICK_EMPTY_PATH);
        APP.resourceManager.add('img/ui/', POINTER_CLICK_OBJECT_PATH);

        // add acc status images to cache
        for(var i = ACCOUNT_TYPE.IRONMAN; i < ACCOUNT_TYPE.MAX; i++)
            APP.resourceManager.add('img/ui/', ACCOUNT_TYPE_ICONS[i]);
    }

    onAssetsLoaded()
    {
        this.mainInterface.onAssetsLoaded();

        // set animation texture arrays
        for(var i = 0; i < POINTER_CLICK_EMPTY_PATH.length; i++)
        {
            POINTER_CLICK_EMPTY_TEXTURES.push(APP.resourceManager.getTexture(POINTER_CLICK_EMPTY_PATH[i]));
            POINTER_CLICK_OBJECT_TEXTURES.push(APP.resourceManager.getTexture(POINTER_CLICK_OBJECT_PATH[i]));
        }

        this.clickAnim = new StageObject("ClickAnimation");
        this.clickAnim.setGraphic(new PIXI.AnimatedSprite(POINTER_CLICK_EMPTY_TEXTURES));

        this.clickAnim.graphic.loop = false;
        this.clickAnim.graphic.animationSpeed = 0.15;
        this.clickAnim.graphic.anchor.set(0.5,0.5);
        this.clickAnim.graphic.onComplete = () => {this.clickAnim.graphic.visible = false;}
        this.clickAnim.keepScale = true;
        this.clickAnim.graphic.zIndex = 1;

        this.mainInterface.setVisibility(false);
        this.updateInterfacePositions();

        SpawnObject(this.clickAnim);
        SpawnObject(this.mainInterface);
    }

    updateInterfacePositions()
    {
        this.hoverTooltip.setPosition(0, window.innerHeight);
        this.mainInterface.setPosition(window.innerWidth, 0);
    }

    updateInterface()
    {
        this.mainInterface.update();
    }

    update()
    {
        HUD.mouseTooltip.update();
        HUD.hoverTooltip.update();

        // if we're in grid mode, we wanna interact with chunks/regions
        if(WORLD.grid.isVisible())
        {
            
        }
        else
        {
            // prio hud objects
            for(var i = HUD_OBJECTS.length-1; i >= 0; i--)
            {
                var object = HUD_OBJECTS[i];
                if(object.attachedTo != null)
                {
                    var attachedToPos = object.attachedTo.getScreenPosition();

                    var scale = 1;
                    if(object.scaleOffset)
                        scale = CAMERA.zoom.x;

                    attachedToPos.x += object.offset.x * scale;
                    attachedToPos.y += object.offset.y * scale;

                    // if its a player, clamp the labels so they're always visible
                    if(object.attachedTo instanceof Player && object.clampToView)
                    {
                        var box = object.getScreenRect(false);

                        //console.log(box);
                        box = CAMERA.clampToView({x:attachedToPos.x, y:attachedToPos.y, width:box.width, height:box.height});

                        attachedToPos.x = box.x;
                        attachedToPos.y = box.y;
                    }
                    
                    object.setPosition(attachedToPos.x, attachedToPos.y);
                }
                else if(object.interactable && object.isVisible())
                {
                    // no need for any weird maths or conversions for HUD
                    var box = object.getScreenRect(true);

                    var cursorPos = INPUT.getInvertedCursorPosition();

                    if( cursorPos.x > box.x && cursorPos.x <= box.x + box.width &&
                        cursorPos.y > box.y && cursorPos.y <= box.y + box.height)
                    {
                        if(!object.wasHovered)
                            INPUT.hoverObject(object);
                    }
                    else
                    {
                        if(object.wasHovered)
                            INPUT.unhoverObject(object);
                    }
                }
            }

            for(var i = OBJECTS.length-1; i >= 0; i--)
            {
                var object = OBJECTS[i];
                updateOverlay(object);
                // this is a root and its interactable
                if(object.interactable && object.parent == null && object.isVisible())
                {
                    var box = object.getScreenRect(true);
                    var cursorPos = INPUT.getInvertedCursorPosition();

                    if( cursorPos.x > box.x && cursorPos.x <= box.x + box.width &&
                        cursorPos.y > box.y && cursorPos.y <= box.y + box.height)
                    {
                        if(!object.wasHovered)
                            INPUT.hoverObject(object);
                    }
                    else
                    {
                        if(object.wasHovered)
                            INPUT.unhoverObject(object);
                    }
                }
            }
        }
    }

    playClickAnimation()
    {
        if(MOUSE_OVER_OBJECT != null)
            this.clickAnim.graphic.textures = POINTER_CLICK_OBJECT_TEXTURES;
        else
            this.clickAnim.graphic.textures = POINTER_CLICK_EMPTY_TEXTURES;

        var cursorPos = CAMERA.getCursorWorldPosition();
        this.clickAnim.setWorldPosition(cursorPos.x, cursorPos.y);
        this.clickAnim.graphic.visible = true;

        this.clickAnim.graphic.gotoAndPlay(0);
    }
}
import { Hud } from "./hud/hud.js";
import { HudObject, StageObject } from "./object.js";
import { createOverlay, deleteOverlay, getOverlay } from "./overlays.js";
import { SetDeveloperMode } from "./developer.js";
import { SKILLS } from "./player.js";
import { TILE_SIZE } from "./world.js";

export class Input
{
    constructor()
    {
        this.mouseIsDown = false;
        this.mouseDownPos = {x:0, y:0};
    }

    init()
    {
        APP.renderer.plugins.interaction.on('pointerdown', (e) => {this.onMouseDown(e)});
        APP.renderer.plugins.interaction.on('pointerup', (e) => {this.onMouseUp(e)});
        APP.renderer.plugins.interaction.on('pointermove', (e) => {this.onMouseMove(e)});

        document.addEventListener('mousewheel', (e) => {this.onMouseWheel(e.deltaY)});
        document.addEventListener('keydown', (e) => {this.onKeyPress(e)});
        document.addEventListener('contextmenu', (e) => {
            window.wasRightClick=true;
            e.preventDefault();
          });
    }

    onMouseWheel(deltaY)
    {
        const scaleBy = 2;
        const oldScale = CAMERA.zoom.x;
        const mousePointTo = {
        x: CAMERA.getCursorPosition().x / oldScale - CAMERA.position.x / oldScale,
        y: CAMERA.getCursorPosition().y / oldScale + CAMERA.position.y / oldScale
        };

        const newScale = deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        CAMERA.setZoom(newScale, newScale);
        CAMERA.setPosition(-(mousePointTo.x - CAMERA.getCursorPosition().x / newScale) * newScale, (mousePointTo.y - CAMERA.getCursorPosition().y / newScale) * newScale);
    }  

    unhoverObject(object)
    {
        if(object.createOverlay)
        {
            var overlay = getOverlay(object);
            if(overlay != null && SELECTED_OBJECT != object)
                deleteOverlay(object);
        }

        object.wasHovered = false;
        MOUSE_OVER_OBJECT = null;
    }

    hoverObject(object)
    {
        if(object.createOverlay)
        {
            var overlay = getOverlay(object);
            if(overlay == null)
                createOverlay(object);
        }
        object.wasHovered = true;
        MOUSE_OVER_OBJECT = object;
    }

    selectObject(object)
    {
        if(!object.selectable)
            return;

        if(object.createOverlay)
        {
            var overlay = getOverlay(object);
            if(overlay == null)
                createOverlay(object);
        }

        SELECTED_OBJECT = MOUSE_OVER_OBJECT;
        HUD.updateInterface();
    }

    deselectObject()
    {
        if(SELECTED_OBJECT == null)
            return;

        if(SELECTED_OBJECT.createOverlay)
        {
            var overlay = getOverlay(SELECTED_OBJECT);
            if(overlay != null)
                deleteOverlay(SELECTED_OBJECT);
        }

        SELECTED_OBJECT = null;
        HUD.updateInterface();
    }

    onKeyPress(e)
    {
        if(e.keyCode == 27)
        {
            // escape
            this.deselectObject();
        }
        console.log(e.keyCode);
    }

    onMouseDown(e)
    {
        if(e.data.buttons == 1)
        {
            // left click
            this.mouseDownPos = CAMERA.getCursorPosition();
            this.mouseIsDown = true;
            
            LAST_MOUSE_CLICKED_OBJECT = MOUSE_OVER_OBJECT;

            if(MOUSE_OVER_OBJECT != null)
            {
                if(SELECTED_OBJECT == MOUSE_OVER_OBJECT)
                {
                    HUD.playClickAnimation();
                    this.deselectObject();
                }
                else if(MOUSE_OVER_OBJECT != null)
                {
                    if(MOUSE_OVER_OBJECT.selectable)
                    {
                        this.selectObject(MOUSE_OVER_OBJECT);
                        HUD.playClickAnimation();
                    }

                    if(MOUSE_OVER_OBJECT.onClick != null)
                        MOUSE_OVER_OBJECT.onClick();
                }
            }
            else
            {
                HUD.playClickAnimation();
            }
        }
        else if(e.data.buttons == 2)
        {
            // right click
            var cursorPos = CAMERA.getCursorPosition();
            console.log("CURSOR POS")
            console.log(cursorPos);

            console.log("CURSOR SCREEN TO WORLD")
            var worldPos = CAMERA.screenToWorldPos(cursorPos.x, cursorPos.y);
            console.log(worldPos);
       
           // HUD.xpdropper.addDrop(SKILLS.ATTACK, 500342);
           // HUD.xpdropper.addDrop(SKILLS.HITPOINTS, 500342);


           // HUD.xpdropper.displayDrops(CAMERA.getInvertedCursorPosition());

        }
        else if(e.data.buttons == 4)
        {
            DEVELOPER_MODE = !DEVELOPER_MODE;
            SetDeveloperMode(DEVELOPER_MODE);
        }
    }

    onMouseUp(e)
    {
        this.mouseIsDown = false;
    }

    onMouseMove()
    {
        if(this.mouseIsDown && LAST_MOUSE_CLICKED_OBJECT == null)
        {
            var currMouse = CAMERA.getCursorPosition();
                
            var newX = CAMERA.position.x + (currMouse.x - this.mouseDownPos.x);
            var newY = CAMERA.position.y - (currMouse.y - this.mouseDownPos.y);

            CAMERA.setPosition(newX, newY);

            this.mouseDownPos = currMouse;
        }
    }
}
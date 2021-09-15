import { Hud } from "./hud/hud.js";
import { HudObject, StageObject } from "./object.js";
import { createOverlay, deleteOverlay, getOverlay } from "./overlays.js";
import { SetDeveloperMode } from "./developer.js";

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
        y: CAMERA.getCursorPosition().y / oldScale - CAMERA.position.y / oldScale
        };

        const newScale = deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        console.log(newScale);
        CAMERA.setZoom(newScale, newScale);
        CAMERA.setPosition(-(mousePointTo.x - CAMERA.getCursorPosition().x / newScale) * newScale, -(mousePointTo.y - CAMERA.getCursorPosition().y / newScale) * newScale);
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
        HUD.hoverTooltip.update();
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
        HUD.hoverTooltip.update();
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
        HUD.update();
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
        HUD.update();
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

    update()
    {
        // prio hud objects
        for(var i = HUD_OBJECTS.length-1; i >= 0; i--)
        {
            var object = HUD_OBJECTS[i];
            if(object.interactable && object.isVisible())
            {
                // no need for any weird maths or conversions for HUD
                var box = object.getInteractableRect();
                var cursorPos = CAMERA.getCursorPosition();

                if( cursorPos.x > box.x && cursorPos.x <= box.x + box.width &&
                    cursorPos.y > box.y && cursorPos.y <= box.y + box.height)
                {
                    if(!object.wasHovered)
                        this.hoverObject(object);
                    return;
                }
                else
                {
                    if(object.wasHovered)
                        this.unhoverObject(object);

                }
            }
        }

        for(var i = OBJECTS.length-1; i >= 0; i--)
        {
            var object = OBJECTS[i];

            // this is a root and its interactable
            if(object.interactable && object.parent == null && object.isVisible())
            {
                var box = object.getInteractableRect();
                var cursorPos = CAMERA.getCursorWorldPosition();

                if( cursorPos.x > box.x && cursorPos.x <= box.x + box.width &&
                    cursorPos.y <= box.y && cursorPos.y > box.y + box.height)
                {
                    if(!object.wasHovered)
                        this.hoverObject(object);
                    return;
                }
                else
                {
                    if(object.wasHovered)
                        this.unhoverObject(object);
                }
            }
        } 
    }

    onMouseMove()
    {
        if(this.mouseIsDown && LAST_MOUSE_CLICKED_OBJECT == null)
        {
            var currMouse = CAMERA.getCursorPosition();
                
            var newX = CAMERA.position.x + (currMouse.x - this.mouseDownPos.x);
            var newY = CAMERA.position.y + (currMouse.y - this.mouseDownPos.y);

            CAMERA.setPosition(newX, newY);

            this.mouseDownPos = currMouse;
        }
    }
}
import { createOverlay, deleteOverlay, getOverlay } from "./overlays.js";
import { SetDeveloperMode } from "./developer.js";

export class Input
{
    constructor()
    {
        this.mouseIsDown = false;
        this.mouse2IsDown = false;
        this.spaceIsDown = false;
        this.mouseDownPos = {x:0, y:0};

        this.touchPos = {x:0, y:0};
    }

    init()
    {
        APP.renderer.plugins.interaction.on('pointermove', (e) => {this.onMouseMove(e)});

        APP.renderer.plugins.interaction.on('touchmove', (e) => {this.onTouchMove(e)});
        APP.renderer.plugins.interaction.on('touchstart', (e) => {this.onTouchStart(e)});
        APP.renderer.plugins.interaction.on('touchend', (e) => {this.onTouchEnd(e)});

        window.addEventListener('mousedown', (e) => {this.onMouseDown(e)});
        window.addEventListener('mouseup', (e) => {this.onMouseUp(e)});

        window.addEventListener('resize', (e) => {this.onWindowResize(e)});

        document.addEventListener("wheel", (e) => {this.onMouseWheel(e.deltaY)});
        document.addEventListener('keydown', (e) => {this.onKeyPress(e)});
        document.addEventListener('keyup', (e) => {this.onKeyRelease(e)});
        document.addEventListener('contextmenu', (e) => {
            window.wasRightClick=true;
            e.preventDefault();
          });
    }

    onWindowResize(e)
    {
        HUD.updateInterfacePositions();
        APP.renderer.resize(window.innerWidth, window.innerHeight);

        APP.hudContainer.position.y = -window.innerHeight;
        APP.devContainer.position.y = -window.innerHeight;

        WORLD.updateMap();
    }

    onMouseWheel(deltaY)
    {
        const scaleBy = 2;

        var worldPos = CAMERA.getCursorWorldPosition();
        const newScale = deltaY < 0 ? CAMERA.zoom.x * scaleBy : CAMERA.zoom.x / scaleBy;

        CAMERA.setZoom(newScale, newScale);
        CAMERA.setPosition(-(worldPos.x - this.getCursorPosition().x / newScale) * newScale, (-worldPos.y - this.getCursorPosition().y / newScale) * newScale);
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
        // if we called hover on some other object, make sure to unhover previous object
        if(MOUSE_OVER_OBJECT != null)
            this.unhoverObject(MOUSE_OVER_OBJECT);

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
        // first deselect current object
        this.deselectObject();

        if(!object.selectable)
            return;

        if(object.createOverlay)
        {
            var overlay = getOverlay(object);
            if(overlay == null)
                createOverlay(object);
        }

        SELECTED_OBJECT = MOUSE_OVER_OBJECT;
        CAMERA.setFollowObject(SELECTED_OBJECT);
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
        CAMERA.setFollowObject(null);
        HUD.updateInterface();
    }

    onKeyPress(e)
    {
        switch(e.keyCode)
        {
            case 27: // escape
                this.deselectObject();
                break;
            case 32: // space
                if(WORLD.grid.isVisible())
                    this.spaceIsDown = true;
                else
                    CAMERA.followCurrentObject();
                break;
            case 81: // q
                
                break;
            case 49: // 1
            case 50: // 2
            case 51: // 3
            case 52: // 4
                CAMERA.interruptedCameraPathing = true;
                var plane = e.keyCode - 49;
                WORLD.setPlane(plane);
                break;
            case 71: // g
                WORLD.grid.setVisibility(!WORLD.grid.isVisible());
                break;
        }
        console.log(e.keyCode);
    }

    onKeyRelease(e)
    {
        switch(e.keyCode)
        {
            case 32:
                this.spaceIsDown = false;
                break;
        }
    }

    // since UI is flipped, lets make it simple on our brains and use inverted cursor position
    // to check for UI collision
    getInvertedCursorPosition()
    {
        if(USING_PHONE)
            return {x:this.touchPos.x, y:(this.touchPos.y - window.innerHeight) * -1};

        return {x:APP.renderer.plugins.interaction.mouse.global.x, y:(APP.renderer.plugins.interaction.mouse.global.y - window.innerHeight) * -1};
    }

    getCursorPosition()
    {
        if(USING_PHONE)
            return {x:this.touchPos.x, y:this.touchPos.y};

        return {x:APP.renderer.plugins.interaction.mouse.global.x, y:APP.renderer.plugins.interaction.mouse.global.y};
    }

    onPointerDown(x, y)
    {
        this.mouseDownPos = this.touchPos = {x:x, y:y};
        this.mouseIsDown = true;

        if(WORLD.grid.isVisible())
        {
            
        }
        else
        {
            // Normal user interaction
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
                CAMERA.interruptedCameraPathing = true;
                HUD.playClickAnimation();
            }
        }
    }

    onPointerUp(button)
    {
        if(button == 0)
        {
            this.mouseIsDown = false;
        }

        if(button == 2)
        {
            this.mouse2IsDown = false;
        }
    }

    onPointerMove(x, y)
    {
        if(WORLD.grid.isVisible())
        {
            if(this.mouseIsDown)
            {
                if(this.spaceIsDown)
                {
                    var currMouse = this.getCursorPosition();
                    
                    var newX = CAMERA.position.x + (currMouse.x - this.mouseDownPos.x);
                    var newY = CAMERA.position.y - (currMouse.y - this.mouseDownPos.y);
        
                    CAMERA.setPosition(newX, newY);
        
                    this.mouseDownPos = currMouse;
                }
                else
                {
                    var cursorPos = CAMERA.getCursorWorldPosition();
                    var chunkPos = WORLD.getChunkWorldPosition(cursorPos.x, cursorPos.y);
                    chunkPos.x /= 4;
                    chunkPos.y /= 4;

                    var selectedChunk = WORLD.grid.getSelectedChunk(chunkPos);
                    if(selectedChunk == null)
                        WORLD.grid.selectChunk(chunkPos);
                }
            }
            else if(this.mouse2IsDown)
            {
                var cursorPos = CAMERA.getCursorWorldPosition();
                var chunkPos = WORLD.getChunkWorldPosition(cursorPos.x, cursorPos.y);
                chunkPos.x /= 4;
                chunkPos.y /= 4;

                var selectedChunk = WORLD.grid.getSelectedChunk(chunkPos);
                if(selectedChunk != null)
                    WORLD.grid.deselectChunk(chunkPos);
            }
        }
        else
        {
            if(this.mouseIsDown && LAST_MOUSE_CLICKED_OBJECT == null)
            {
                var currMouse = this.touchPos = {x:x, y:y};
                    
                var newX = CAMERA.position.x + (currMouse.x - this.mouseDownPos.x);
                var newY = CAMERA.position.y - (currMouse.y - this.mouseDownPos.y);
    
                CAMERA.setPosition(newX, newY);
    
                this.mouseDownPos = currMouse;
            }
        }
    }

    onTouchStart(e)
    {
        this.onPointerDown(e.data.global.x, e.data.global.y);
        this.onTouchMove(e);
    }

    onTouchEnd(e)
    {
        this.onPointerUp(0);
    }

    onTouchMove(e)
    {
        this.onPointerMove(e.data.global.x, e.data.global.y);
    }

    onMouseDown(e)
    {
        if(e.button == 0)
        {
            var pos = this.getCursorPosition();
            this.onPointerDown(pos.x, pos.y);
            this.mouseIsDown = true;
        }
        else if(e.button == 2)
        {
            this.mouse2IsDown = true;

            // right click
            var cursorPos = this.getCursorPosition();
            console.log("CURSOR POS")
            console.log(cursorPos);

            console.log("CURSOR SCREEN TO WORLD")
            var worldPos = CAMERA.screenToWorldPos(cursorPos.x, cursorPos.y);
            //console.log(worldPos);

            var worldPos = WORLD.getChunkWorldPosition(worldPos.x, worldPos.y)
            worldPos.x /= 4;
            worldPos.y /= 4;

            console.log(worldPos);

        }
        else if(e.button == 1)
        {
            DEVELOPER_MODE = !DEVELOPER_MODE;
            SetDeveloperMode(DEVELOPER_MODE);
        }
        this.onMouseMove()
    }

    onMouseUp(e)
    {
        this.onPointerUp(e.button);
    }

    onMouseMove()
    {
        var cursorPos = this.getCursorPosition();
        this.onPointerMove(cursorPos.x, cursorPos.y);
    }
}
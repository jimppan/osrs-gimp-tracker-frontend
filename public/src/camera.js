import { getChunkWidth, getChunkHeight } from "./world.js";
import { updateOverlay } from "./overlays.js";
import { XPDrop } from "./hud/xpdrop.js";

export class Camera
{
    constructor()
    {
        this.position = {x:0.0, y:0.0};
        this.zoom = {x:1.0, y:1.0};

        this.tickCounter = 0;
        this.needsUpdate = false;
    }

    update()
    {
        this.tickCounter++;
        // update every 20 ticks sounds fine
        if(this.tickCounter > 20)
        {
            this.tickCounter = 0;
            if(this.needsUpdate)
            {
                WORLD.updateMap();
                this.needsUpdate = false;
            }
        }
    }

    setPosition(x, y)
    {
        x = Math.round(x);
        y = Math.round(y);

        this.position.x = x;
        this.position.y = y;

        APP.worldContainer.position.x = this.position.x;
        APP.worldContainer.position.y = this.position.y;

        this.needsUpdate = true;
    }

    setZoom(x, y)
    {
        this.zoom.x = APP.worldContainer.scale.x = x;
        this.zoom.y = APP.worldContainer.scale.y = y;

        //console.log(this.zoom);

        for(var i = 0; i < OBJECTS.length; i++)
        {
            var object = OBJECTS[i];
            object.onZoom(x, y);
            updateOverlay(object);
        }

        this.needsUpdate = true;
    }

    clampToView(rect)
    {
        var ret = {x:rect.x, y:rect.y};
        if(rect.x + rect.width > window.innerWidth)
            ret.x = window.innerWidth - rect.width;
        else if(rect.x < 0)
            ret.x = 0;

        if(rect.y + rect.height > window.innerHeight)
            ret.y = window.innerHeight - rect.height;
        else if(rect.y < 0)
            ret.y = 0;
        return ret;
    }

    // since UI is flipped, lets make it simple on our brains and use inverted cursor position
    // to check for UI collision
    getInvertedCursorPosition()
    {
        var x = APP.renderer.plugins.interaction.mouse.global.x;
        var y = (APP.renderer.plugins.interaction.mouse.global.y - window.innerHeight) * -1;

        return {x:x, y:y};
    }

    getCursorPosition()
    {
        var x = APP.renderer.plugins.interaction.mouse.global.x;
        var y = APP.renderer.plugins.interaction.mouse.global.y;

        return {x:x, y:y};
    }

    getCursorWorldPosition()
    {
        var cursorPos = this.getCursorPosition();
        return this.screenToWorldPos(cursorPos.x, cursorPos.y);
    }

    screenToWorldPos(x, y)
    {
        const oldScale = this.zoom.x;
        const point = {
            x: x / oldScale - this.position.x / oldScale,
            y: y / oldScale + this.position.y / oldScale,
            };

        return {x: point.x, y: -point.y};
        //return  point;
    }

    isWorldPositionInView(x, y)
    {
        var topLeft = this.screenToWorldPos(0, 0); // screenpos Y:0 is top
        var bottomRight = this.screenToWorldPos(window.innerWidth, window.innerHeight);

        if(x < topLeft.x || x > bottomRight.x)
            return false;
        
        if(y > topLeft.y || y < bottomRight.y)
            return false;

        return true;
    }

    isXInView(x)
    {
        var topLeft = this.screenToWorldPos(0, 0); // screenpos Y:0 is top
        var bottomRight = this.screenToWorldPos(window.innerWidth, window.innerHeight);

        if(x < topLeft.x || x > bottomRight.x)
            return false;

        return true;
    }

    isYInView(y)
    {
        var topLeft = this.screenToWorldPos(0, 0); // screenpos Y:0 is top
        var bottomRight = this.screenToWorldPos(window.innerWidth, window.innerHeight);

        if(y > topLeft.y || y < bottomRight.y)
            return false;

        return true;
    }

    // gets an array of chunks that are currently in the view
    // starting from top left to bottom right
    getChunksInView()
    {
        var bottomLeftPos = this.screenToWorldPos(0, window.innerHeight);
        var bottomLeftChunk = WORLD.getChunkPositionFromWorldPosition(bottomLeftPos.x, bottomLeftPos.y);

        var xChunkMax = Math.floor(((bottomLeftChunk.x + window.innerWidth) / getChunkWidth()) / this.zoom.x) + 2;
        var yChunkMax = Math.floor(((bottomLeftChunk.y + window.innerHeight) / getChunkHeight()) / this.zoom.y) + 2;

        var chunkPosList = [];
        for(var x = bottomLeftChunk.x; x < bottomLeftChunk.x + xChunkMax; x++)
        {
            for(var y = bottomLeftChunk.y; y < bottomLeftChunk.y + yChunkMax; y++)
            {
                chunkPosList.push({x:x, y:y});
            }
        }
        //console.log(count);
        return chunkPosList;
    }
}
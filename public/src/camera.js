import { WorldObject } from "./object.js";
import { REGION_WIDTH, REGION_HEIGHT, TILE_SIZE, X_CHUNKS_PER_REGION, Y_CHUNKS_PER_REGION } from "./world.js";

export class Camera
{
    constructor()
    {
        this.targetPosition = {x:0.0, y:0.0}
        this.position = {x:0.0, y:0.0};
        this.zoom = {x:1.0, y:1.0};

        this.tickCounter = 0;
        this.needsUpdate = false;
        this.interruptedCameraPathing = false;
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

        // update camera movement
        if(!this.interruptedCameraPathing)
        {
            if(CAMERA_FOLLOW_OBJECT != null && CAMERA_FOLLOW_OBJECT instanceof WorldObject)
            {
                if(CAMERA_FOLLOW_OBJECT.plane != WORLD.currentPlane)
                    WORLD.setPlane(CAMERA_FOLLOW_OBJECT.plane);

                var worldPos = CAMERA_FOLLOW_OBJECT.getWorldPosition();
                this.setTargetPosition(worldPos.x, worldPos.y);
            }

            // TODO: if we get close enough to target, stop following

            // lerp to target pos
            var targetPositionOffset = {x:this.targetPosition.x, y:this.targetPosition.y};

            targetPositionOffset.x -= (window.innerWidth / 2) / CAMERA.zoom.x;
            targetPositionOffset.y += (window.innerHeight / 2) / CAMERA.zoom.y;
    
            var cameraWorldPos = this.getCameraWorldPosition();
    
            var diff = {x:0, y:0};
            diff.x = (targetPositionOffset.x - cameraWorldPos.x);
            diff.y = (targetPositionOffset.y - cameraWorldPos.y);
    
            if(this.isWorldPositionInView(this.targetPosition.x, this.targetPosition.y))
            {
                
                // if the point is in view, we can keep lerping, else just TP the camera
                cameraWorldPos.x += diff.x * 0.05;
                cameraWorldPos.y += diff.y * 0.05;
            }
            else
            {
                cameraWorldPos.x = targetPositionOffset.x;
                cameraWorldPos.y = targetPositionOffset.y;
            }
    
            cameraWorldPos.x *= this.zoom.x;
            cameraWorldPos.y *= this.zoom.y;
    
            this.setPosition(-cameraWorldPos.x, -cameraWorldPos.y);
        }
    }
    
    getCameraWorldPosition()
    {
        return {x:(-this.position.x / this.zoom.x), y:(-this.position.y) / this.zoom.y};
    }

    followCurrentObject()
    {
        this.interruptedCameraPathing = CAMERA_FOLLOW_OBJECT == null;
    }

    setFollowObject(object)
    {
        // if the object is on another plane, swap the plane to his plane
        if(object != null && object.plane != WORLD.currentPlane)
            WORLD.setPlane(object.plane);

        CAMERA_FOLLOW_OBJECT = object;
        this.interruptedCameraPathing = object == null;
    }

    setTargetPosition(x, y)
    {
        this.interruptedCameraPathing = false;
        this.targetPosition = {x:x, y:y};
    }

    setPosition(x, y)
    {
        var newPos = {x:x, y:y};
        
        newPos.x = Math.round(newPos.x);
        newPos.y = Math.round(newPos.y);

        this.position.x = newPos.x;
        this.position.y = newPos.y;

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

    getCursorWorldPosition()
    {
        var cursorPos = INPUT.getCursorPosition();
        return this.screenToWorldPos(cursorPos.x, cursorPos.y);
    }

    screenToWorldPos(x, y)
    {
        var newX = x / this.zoom.x - this.position.x / this.zoom.x;
        var newY = y / this.zoom.y + this.position.y / this.zoom.y;

        return {x: newX, y: -newY};
    }

    worldToScreenPos(x, y)
    {
        var newX = (x + this.position.x / this.zoom.x) * this.zoom.x;
        var newY = -((y + this.position.y / this.zoom.y) * this.zoom.y);

        return {x: newX, y: (newY - window.innerHeight) * -1}; 
    } 

    isWorldPositionInView(x, y)
    {
        var topLeft = this.screenToWorldPos(0, 0); // screenpos Y:0 is top
        var bottomRight = this.screenToWorldPos(window.innerWidth, window.innerHeight);

        if(x < topLeft.x || x > bottomRight.x)
            return false;
        
        if(y < bottomRight.y || y > topLeft.y)
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
    
    // a region is a 64x64 tile region (256x256 pixels)
    getMouseRegion()
    {
        var cursorWorldPos = this.getCursorWorldPosition();

        var x = Math.floor(cursorWorldPos.x / REGION_WIDTH);
        var y = Math.floor(cursorWorldPos.y / REGION_HEIGHT);

        return WORLD.getRegion(x, y);
    }

    // a chunk is a 8x8 tile region (64x64 pixels)
    getMouseChunk()
    {
        var cursorWorldPos = this.getCursorWorldPosition();
        return WORLD.getChunk(cursorWorldPos.x, cursorWorldPos.y);
    }

    // gets an array of regions that are currently in the view
    // starting from top left to bottom right
    getRegionsInView()
    {
        var bottomLeftPos = this.screenToWorldPos(0, window.innerHeight);
        var bottomLeftRegion = WORLD.getRegionPositionFromWorldPosition(bottomLeftPos.x, bottomLeftPos.y);

        var xRegionMax = Math.floor(((bottomLeftRegion.x + window.innerWidth) / REGION_WIDTH) / this.zoom.x) + 2;
        var yRegionMax = Math.floor(((bottomLeftRegion.y + window.innerHeight) / REGION_HEIGHT) / this.zoom.y) + 2;

        var regionPosList = [];
        for(var x = bottomLeftRegion.x; x < bottomLeftRegion.x + xRegionMax; x++)
        {
            for(var y = bottomLeftRegion.y; y < bottomLeftRegion.y + yRegionMax; y++)
            {
                regionPosList.push({x:x, y:y});
            }
        }
        //console.log(count);
        return regionPosList;
    }
}
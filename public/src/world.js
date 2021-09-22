import { StageObject, WorldObject } from "./object.js";

export var MAP_ID = 0;
export var MAP_ZOOM_LEVEL = 2;

export function getRegionWidth() {return Math.pow(2, 6+MAP_ZOOM_LEVEL);} // in pixels, 256 by default zoom LVL 2
export function getRegionHeight() {return Math.pow(2, 6+MAP_ZOOM_LEVEL);} // in pixels, 256 by default zoom LVL 2

export const REGION_TILE_WIDTH = Math.pow(2, 6);  // 64 tiles
export const REGION_TILE_HEIGHT = Math.pow(2, 6); // 64 tiles

export const TILE_SIZE = getRegionWidth() / REGION_TILE_WIDTH; //
export const START_TILE = {x:3221, y:3218}; // starting pos for camera (lumbridge)

export const MAX_REGION_WIDTH = 70;
export const MAX_REGION_HEIGHT = 200;

export const MAX_PLANE = 4; // 0 - 3 levels

export const LAYERS = 
{
    MAP: [0, 1, 2, 3],
    OBJECT: 4,
    PLAYER: 5,
}


function BuildRegionTexturePath(x, y, z)
{
    return `img/map/${z}_${x}_${y}.png`;
}

// plane (Z level of a region)
export class Plane
{
    constructor(region, planeId)
    {
        this.planeId = planeId;
        this.sprite = new PIXI.Sprite();
        this.textureLoaded = false;

        this.region = region;
    }

    setSprite()
    {
        this.textureLoaded = true;
        // invert Y position
        var spritePath = BuildRegionTexturePath(this.region.position.x, this.region.position.y, this.planeId);
        APP.resourceManager.lateLoadTexture(spritePath, this.sprite);

        this.sprite.zIndex = this.planeId;
    }

    setVisibility(val)
    {
        this.sprite.visible = val;
    }
}

// a 64x64 tile region of a map
export class Region
{
    constructor(world)
    {
        this.world = world;
        this.planes = new Array(MAX_PLANE);
        this.position = {x:0, y:0}; // region pos, not world pos
    }
    
    addPlane(plane)
    {
        this.planes[plane.planeId] = plane;
        plane.sprite.x = this.position.x * getRegionWidth();
        plane.sprite.y = this.position.y * getRegionHeight();

        this.world.getPlaneContainer(plane.planeId).add(plane)
    }

    getPlane(plane)
    {
        return this.planes[plane];
    }

    setSprite(plane)
    {
        this.getPlane(plane).setSprite();
    }

    setPosition(x, y)
    {
        this.position.x = x;
        this.position.y = y;
        
        for(var i = 0; i < MAX_PLANE; i++)
        {
            var plane = this.getPlane(i);
            if(plane == null)
                continue;
            plane.sprite.x = x * getRegionWidth();
            plane.sprite.y = y * getRegionHeight();
        }
    }

    setVisibility(val)
    {
        for(var i = 0; i < MAX_PLANE; i++)
        {
            var plane = this.getPlane(i);
            if(plane == null)
                continue;

            plane.setVisibility((i == 0 || this.world.currentPlane == i) && val);
        }
    }
}

class PlaneContainer extends PIXI.Container
{
    constructor()
    {
        super();

        this.map = new PIXI.Container();
        this.objects = new PIXI.Container();

        this.addChild(this.map);
        this.addChild(this.objects);
    }

    add(object)
    {
        if(object instanceof Plane)
        {
            // if its a plane, add it ot map
            this.map.addChild(object.sprite);
        }
        else if(object instanceof StageObject)
        {
            // add it to object container if its a world object
            this.objects.addChild(object.graphic);
        }
    }

    remove(object)
    {
        if(object instanceof Plane)
        {
            // if its a plane, add it ot map
            this.map.removeChild(object.sprite);
        }
        else if(object instanceof StageObject)
        {
            // add it to object container if its a world object
            this.objects.removeChild(object.graphic);
        }
    }
}

export class World
{
    constructor()
    {
        this.id = 0; // mapID
        this.regions = this.initializeMap(MAX_REGION_WIDTH, MAX_REGION_HEIGHT) // 2d array
        this.currentPlane = 0;
        this.regionData = null;

        this.planeContainers = Array(MAX_PLANE);

        for(var i = 0; i < MAX_PLANE; i++)
            this.planeContainers[i] = new PlaneContainer();
    }

    changePlane(object, plane)
    {
        var currPlane = this.getPlaneContainer(object.plane);
        currPlane.remove(object);

        object.plane = plane;
        var nextPlane = this.getPlaneContainer(plane);
        nextPlane.add(object);
    }

    getPlaneContainer(plane)
    {
        return this.planeContainers[plane];
    }

    isRegionPosInRange(x, y)
    {
        return x > 0 && y > 0 && x < MAX_REGION_WIDTH && y < MAX_REGION_HEIGHT;
    }

    createRegion(x, y)
    {
        var region = this.getRegion(x, y);
        if(region != null)
            return region;
        
        var region = new Region(this);
        region.setPosition(x, y);
        this.addRegion(region);
        return region;
    }

    addRegion(region)
    {
        this.regions[region.position.x][region.position.y] = region;
    }

    removeRegion(region)
    {
        this.regions[region.position.x][region.position.y] = null;
    }

    getRegion(x, y)
    {
        if(!this.isRegionPosInRange(x, y))
            return null;

        return this.regions[x][y];
    }

    initializeMap(d1, d2)
    {
        var arr = [];
        for(var i = 0; i < d2; i++)
            arr.push(new Array(d1));
        return arr;
    }

    init()
    {
        this.regionData = JSON_MAP_DATA;

        for(var j = 0; j < this.regionData.length; j++)
        {
            var x = this.regionData[j].x;
            var y = this.regionData[j].y;
            var plane = this.regionData[j].plane;

            // create region slots for this map
            var region = this.createRegion(x, y);
            
            var plane = new Plane(region, plane);
            region.addPlane(plane);
        }

        this.setPlane(0);
    }

    // 3200, 3200 to 50, 50 (50 * 64)
    getRegionPositionFromWorldPosition(x, y)
    {
        return {x: Math.floor(x / getRegionWidth()), y: Math.floor(y / getRegionHeight())};
    }

    // 50, 50 to 3200, 3200 (50 * 64)
    getWorldPositionFromRegionPosition(x, y)
    {
        return {x: x * getRegionWidth(), y: y * getRegionHeight()};
    }

    getTilePositionFromWorldPosition(x, y)
    {
        var newX = Math.floor(x / TILE_SIZE);
        var newY = Math.floor(y / TILE_SIZE);
        
        return {x: newX, y: newY};
    }

    clearMap()
    {
        for(var x = 0; x < MAX_REGION_WIDTH; x++)
        {
            for(var y = 0; y < MAX_REGION_HEIGHT; y++)
            {
                var region = this.getRegion(x, y);
                if(region == null)
                    continue;
                    
                region.setVisibility(false);
            }
        }
    }

    setPlane(planeId)
    {
        this.currentPlane = planeId;
        
        for(var i = 0; i < MAX_PLANE; i++)
        {
            var container = this.getPlaneContainer(i);
            container.alpha = i == planeId?1.0:0.3;
        }

        // lets go through all hud objects that are attached to a player, and disable them
        // as we do not wanna render hud objects on planes we're not currently viewing
        for(var i = 0; i < HUD_OBJECTS.length; i++)
        {
            var root = HUD_OBJECTS[i].getAttachedRoot();
            if(root != null && root instanceof WorldObject)
            {
                if(root.plane != null)
                {
                    
                    if(root.plane < planeId) 
                    {
                        // if the object is under our current plane, dont show anything
                        HUD_OBJECTS[i].setVisibility(false);
                    }
                    else if(root.plane == planeId) 
                    {
                        // if the object is on same plane, show it all full alpha
                        HUD_OBJECTS[i].setAlpha(1.0);
                        HUD_OBJECTS[i].setVisibility(true);
                    }
                    else
                    {
                        // if the object is above us, show it but with alpha
                        HUD_OBJECTS[i].setAlpha(0.5);
                        HUD_OBJECTS[i].setVisibility(true);
                    }
                }    
            }
        }

        this.updateMap();
    }

    updateMap()
    {
        this.clearMap();
        var regionsInView = CAMERA.getRegionsInView();
        for(let i = 0; i < regionsInView.length; i++)
        {
            var region = this.getRegion(regionsInView[i].x, regionsInView[i].y);
            if(region == null)
                continue;

            // always load base plane sprites
            var basePlane = region.getPlane(0);
            var currentPlane = region.getPlane(this.currentPlane);
            if(basePlane != null)
            {
                if(!basePlane.textureLoaded)
                    basePlane.setSprite();
            }

            if(currentPlane != null)
            {
                if(!currentPlane.textureLoaded)
                    currentPlane.setSprite();
            }

            region.setVisibility(true);
        } 
    }

    // always show map
    /* updateMap()
    {
        for(var x = 0; x < 100; x++)
        {
            for(var y = 0; y < 100; y++)
            {
                var region = this.getRegion({x:x, y:y});
                if(region == null)
                    continue;

                region.setSprite(0);

                APP.mapContainer.addChild(region.sprite);
                region.setVisibility(true);
            }
        }
    } */
}
import { Grid } from "./hud/devtools/grid.js";
import { SpawnObject, StageObject, WorldObject } from "./object.js";
import { GetMapDefinition } from "./resource/mapdefinitions.js";

export var MAP_ID = 0;
export var MAP_ZOOM_LEVEL = 2;

export const REGION_WIDTH = 256;
export const REGION_HEIGHT = 256;

export const REGION_TILE_WIDTH = 64;
export const REGION_TILE_HEIGHT = 64;

export const TILE_SIZE = 4;
export const START_TILE = {x:3221, y:3218}; // starting pos for camera (lumbridge)

export const MAX_REGION_WIDTH = 70;
export const MAX_REGION_HEIGHT = 200;

export const X_CHUNKS_PER_REGION = 8;
export const Y_CHUNKS_PER_REGION = 8;

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

// a 8x8 tile region of a region 
export class Chunk
{
    constructor(x, y, region)
    {
        this.mapDefinitions = [];
        for(var i = 0; i < MAX_PLANE; i++)
            this.mapDefinitions.push(new Array());
    }

    mapDefinitionExists(mapdef)
    {
        for(var i = 0; i < this.mapDefinitions[mapdef.plane].length; i++)
        {
            if(mapdef.layer == this.mapDefinitions[mapdef.plane][i].layer)
                return true;
        }
        return false;
    }

    // sort these by plane first, then layers
    // the array should look something like this
    // 0 [plane:0, layer:0]
    // 1 [plane:0, layer:1]
    // 2 [plane:0, layer:2]
    // 3 [plane:1, layer:0]
    // 4 [plane:1, layer:1]

    addMapDefinition(mapdef)
    {
        if(this.mapDefinitionExists(mapdef))
        {
            console.log("map definition collision");
            return;
        }
        
        for(var i = 0; i < this.mapDefinitions[mapdef.plane].length; i++)
        {
            var sortMapDef = this.mapDefinitions[mapdef.plane][i];
            if(sortMapDef.layer > mapdef.layer)
            {
                this.mapDefinitions[mapdef.plane].splice(i, 0, mapdef);
                return;
            }
        }

        this.mapDefinitions[mapdef.plane].push(mapdef);
    }

    getHighestLayerMapDefinition(plane)
    {
        if(this.mapDefinitions[plane].length <= 0)
            return null;

        return this.mapDefinitions[plane][this.mapDefinitions[plane].length-1];
    }

    // returns full display name for this chunk (Example: Grand Exchange @ Varrock)
    getDisplayName(plane)
    {
        var highestMapDef = this.getHighestLayerMapDefinition(plane);
        if(highestMapDef == null)
            return null;

        if(highestMapDef.layer > 1)
            return highestMapDef.displayName + " - " + this.mapDefinitions[plane][highestMapDef.layer-1].displayName;

        return highestMapDef.displayName; 
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

        // create a 2d array of 8x8 tile chunks in a region
        this.chunks = [];
        for(var i = 0; i < X_CHUNKS_PER_REGION; i++)
            this.chunks.push(new Array(Y_CHUNKS_PER_REGION));
        
        // pre create chunks
        // pretty bad as it creates for every region, ends up wasting MBs of ram
        // so just create chunks as they're needed
        /* for(var x = 0; x < X_CHUNKS_PER_REGION; x++)
        {
            for(var y = 0; y < Y_CHUNKS_PER_REGION; y++)
            {
                this.chunks[x][y] = new Chunk(x, y, this);
            }
        } */
    }
    
    addPlane(plane)
    {
        this.planes[plane.planeId] = plane;
        plane.sprite.x = this.position.x * REGION_WIDTH;
        plane.sprite.y = this.position.y * REGION_HEIGHT;

        this.world.getPlaneContainer(plane.planeId).add(plane)
    }

    isChunkPosInRange(x, y)
    {
        return x >= 0 && y >= 0 && x < X_CHUNKS_PER_REGION && y < Y_CHUNKS_PER_REGION;
    }

    getChunk(x, y)
    {
        if(!this.isChunkPosInRange(x, y))
            return null;

        return this.chunks[x][y];
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
            plane.sprite.x = x * REGION_WIDTH;
            plane.sprite.y = y * REGION_HEIGHT;
        }

        this.regionID = World.XYToRegionID(x, y);
    }

    getWorldPosition()
    {
        return {x: this.position.x * REGION_WIDTH, y:this.position.y * REGION_HEIGHT};
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
        this.grid = new Grid();
        this.grid.setVisibility(false);

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

    static regionIDToXY(regionID)
    {
        // x y from region formula
        // X = regionID / region_tile_width * tile_size
        // Y = regionID % region_tile_width * tile_size

        var worldUnitsPerRegion = REGION_WIDTH;
        return {x: regionID / worldUnitsPerRegion, y: regionID % worldUnitsPerRegion}
    }

    static XYToRegionID(x, y)
    {
        // region from x y forumla
        // chunkPos.X * region_tile_width * tile_size + chunkPos.y

        return (x * REGION_WIDTH) + y;
    }

    isRegionPosInRange(x, y)
    {
        return x >= 0 && y >= 0 && x < MAX_REGION_WIDTH && y < MAX_REGION_HEIGHT;
    }

    isRegionIDInRange(regionID)
    {
        var pos = World.regionIDToXY(regionID);
        return pos.x >= 0 && pos.y >= 0 && pos.x < MAX_REGION_WIDTH && pos.y < MAX_REGION_HEIGHT;
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

    getRegionByID(regionID)
    {
        var pos = World.regionIDToXY(regionID);
        if(!this.isRegionPosInRange(pos.x, pos.y))
            return null;

        return this.regions[pos.x][pos.y];
    }

    initializeMap(d1, d2)
    {
        var arr = [];
        for(var i = 0; i < d2; i++)
            arr.push(new Array(d1));
        return arr;
    }

    init(regionData)
    {
        for(var j = 0; j < regionData.length; j++)
        {
            var x = regionData[j].x;
            var y = regionData[j].y;
            var plane = regionData[j].plane;

            // create region slots for this map
            var region = this.createRegion(x, y);
            
            var plane = new Plane(region, plane);
            region.addPlane(plane);
        }

        this.setPlane(0);
        SpawnObject(this.grid);
    }

    // gets an array of chunks ranging from world point 1, to world point 2
    getChunksInRange(point1, point2)
    {
        var chunks = [];
        
        for(var x = point1.x, xi = 0; x <= point2.x; x += X_CHUNKS_PER_REGION * TILE_SIZE, xi++) // add 32 each iteration
        {
            var addedIndex = false;

            for(var y = point1.y; y <= point2.y; y += Y_CHUNKS_PER_REGION * TILE_SIZE) // same here, 32 per iteration
            {
                var chunk = WORLD.getChunk(x, y);
                if(chunk == null)
                    continue;
                
                if(!addedIndex)
                {
                    addedIndex = true;
                    chunks.push(new Array());
                }

                chunks[xi].push(chunk);
            }
        }
        return chunks;
    }

    // world position
    getChunk(x, y)
    {
        var regionPos = this.getRegionPositionFromWorldPosition(x, y);
        
        var region = this.getRegion(regionPos.x, regionPos.y);
        if(region == null)
            return null;

        var localX = x % REGION_WIDTH;
        var localY = y % REGION_HEIGHT;
        
        localX = Math.floor(localX / (X_CHUNKS_PER_REGION * TILE_SIZE)); // 256 is pixel width, so divide by chunk pixel width which is 32 (8 * 4)
        localY = Math.floor(localY / (Y_CHUNKS_PER_REGION * TILE_SIZE));

        var chunk = region.getChunk(localX, localY);
        if(chunk == null)
        {
            // if there was no chunk at the position for this region, create it
            chunk = region.chunks[localX][localY] = new Chunk();
            //console.log("created chunk")
        }
        return chunk;
    }

    // takes any floating point world position and returns the chunks rounded world position
    getChunkWorldPosition(x, y)
    {
        var regionPos = this.getRegionPositionFromWorldPosition(x, y);
        
        var region = this.getRegion(regionPos.x, regionPos.y);
        if(region == null)
            return null;

        var localX = x % REGION_WIDTH;
        var localY = y % REGION_HEIGHT;

        localX = Math.floor(localX / (X_CHUNKS_PER_REGION * TILE_SIZE)); // 256 is pixel width, so divide by chunk pixel width which is 32 (8 * 4)
        localY = Math.floor(localY / (Y_CHUNKS_PER_REGION * TILE_SIZE));

        var regionWorldPos = region.getWorldPosition();
        
        return {x:regionWorldPos.x + (localX * TILE_SIZE * X_CHUNKS_PER_REGION), y:regionWorldPos.y + (localY * TILE_SIZE * Y_CHUNKS_PER_REGION)};
    }

    addMapDefinitions(mapdef)
    {
        for(var i = 0; i < mapdef.length; i++)
        {
            // loop all areas
            var chunksArr = mapdef[i].chunks;
            for(var j = 0; j < chunksArr.length; j++)
            {
                var start = {x:chunksArr[j].s_x, y:chunksArr[j].s_y}; // chunk pos are stored as tile position
                var end = {x:chunksArr[j].e_x, y:chunksArr[j].e_y};

                if(end.x != null && end.y != null)
                {
                    // if the end values are set, we can get all the chunks within this range and apply the definition
                    var chunksInRange = this.getChunksInRange({x:start.x * TILE_SIZE,y:start.y * TILE_SIZE}, {x:end.x * TILE_SIZE, y:end.y * TILE_SIZE});
                    for(var x = 0; x < chunksInRange.length; x++)
                    {
                        for(var y = 0; y < chunksInRange[x].length; y++)
                        {
                            var chunk = chunksInRange[x][y];
                            chunk.addMapDefinition(GetMapDefinition(i)); // set the map def for the chunk
                            //if(GetMapDefinition(i).layer == 0)
                            //    this.grid.selectChunk({x:start.x + (x * X_CHUNKS_PER_REGION), y:start.y + (y * Y_CHUNKS_PER_REGION)});
                        }
                    }
                }
                else
                {
                    var chunk = this.getChunk(start.x * TILE_SIZE, start.y * TILE_SIZE);
                    if(chunk == null)
                        continue;

                    chunk.addMapDefinition(GetMapDefinition(i)); // set the map def for the chunk
                    //if(GetMapDefinition(i).layer == 0)
                     //   this.grid.selectChunk(start);
                }
            }
        }
    }

    // 3200, 3200 to 50, 50 (50 * 64)
    getRegionPositionFromWorldPosition(x, y)
    {
        return {x: Math.floor(x / REGION_WIDTH), y: Math.floor(y / REGION_HEIGHT)};
    }

    // 50, 50 to 3200, 3200 (50 * 64)
    getWorldPositionFromRegionPosition(x, y)
    {
        return {x: x * REGION_WIDTH, y: y * REGION_HEIGHT};
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
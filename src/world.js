import { clamp } from "./helpers.js";
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

export const MAX_REGION_WIDTH = 80;
export const MAX_REGION_HEIGHT = 210;

export const X_CHUNKS_PER_REGION = 8;
export const Y_CHUNKS_PER_REGION = 8;

export const MAX_PLANE = 4; // 0 - 3 levels

export const LAYERS = 
{
    MAP: [0, 1, 2, 3],
    OBJECT: 4,
    PLAYER: 5,
}

function BuildRegionTexturePath(zoom, x, y, z)
{
    return `img/map/${zoom}/${z}_${x}_${y}.png`;
}

// the map zoom level from camera zoom
// -3 is 32x    (0.03125)
// -2 is 16x    (0.0625)
// -1 is 8x     (0.125)
//  0 is 4x     (0.25)
//  1 is 2x     (0.50)
//  2 is normal (1)
//  anything higher is also normal
function getZoomFolderLevel(zoom)
{
    if(zoom >= 1)
    {
        return 2;
    }
    else if(zoom >= 0.50)
    {
        return 1;
    }
    else if(zoom >= 0.25)
    {
        return 0;
    }
    else if(zoom >= 0.125)
    {
        return -1;
    }
    else if(zoom >= 0.0625)
    {
        return -2;
    }
    
    return -3;
}

// plane (Z level of a region)
export class Plane
{
    constructor(region, planeId)
    {
        this.planeId = planeId;
        this.sprite = new PIXI.Sprite();
        //this.textureLoaded = false;

        this.region = region;
    }

    setSprite()
    {
        //this.textureLoaded = true;

        var zoomFolder = getZoomFolderLevel(CAMERA.zoom.x);

        var zoomAmount = clamp(1 / CAMERA.zoom.x, 1, 32);

        var xPath = Math.floor(this.region.position.x / zoomAmount);
        var yPath = Math.floor(this.region.position.y / zoomAmount);

        var newSpriteRegionPosX = xPath * zoomAmount;
        var newSpriteRegionPosY = yPath * zoomAmount;
        //console.log(zoomFolder + " - " + xPath + " / " + yPath);

        var spritePath = BuildRegionTexturePath(zoomFolder, xPath, yPath, this.planeId);
        APP.resourceManager.lateLoadTexture(spritePath, (texture) =>
        {
            // texture downloaded and uploaded to GPU

            this.sprite.texture = texture;

            this.sprite.scale.x = zoomAmount;
            this.sprite.scale.y = zoomAmount;

            // example:
            // if xPath was 50 (which is lumbirdge chunk)
            // divide it by the zoom amount, lets say we're on zoomed out by 4 times
            // floor(50 / 4) is 12
            // 12 * 4 is 46 which is where the zoomed map image should be rendered
            // 46 * 64 * 4 is the world position (chunkPos * region_tile_width * tile_pixel_width)

            
            this.sprite.position.x = newSpriteRegionPosX * REGION_TILE_WIDTH * TILE_SIZE;
            this.sprite.position.y = newSpriteRegionPosY * REGION_TILE_HEIGHT * TILE_SIZE;

            this.sprite.zIndex = this.planeId;

            // once we have loaded this sprite, we wanna disable older resolutions of this sprite
            for(var x = newSpriteRegionPosX; x < newSpriteRegionPosX + zoomAmount; x++)
            {
                for(var y = newSpriteRegionPosY; y < newSpriteRegionPosY + zoomAmount; y++)
                {
                    // disable the visibility of all planes this sprite is gonna cover
                    // then enable the visibility of this one
                    var region = WORLD.getRegion(x, y);
                    if(region != null)
                    {
                        var plane = region.getPlane(this.planeId);
                        if(plane != null)
                        {
                            plane.setVisibility(false);
                            plane.parent = this;
                        }
                    }
                }
            }
 
            //if(this.parent != null)
                //this.parent.setVisibility(false);
            this.setVisibility(true);
        });

        
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

    hasPlane(planeId)
    {
        return this.planes[planeId] != null;
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

    // 12800, 12800 to 50, 50 (50 * 64)
    getRegionPositionFromWorldPosition(x, y)
    {
        return {x: Math.floor(x / REGION_WIDTH), y: Math.floor(y / REGION_HEIGHT)};
    }

    // 50, 50 to 12800, 12800 (50 * 64)
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

    /* clearMap()
    {
        var regionsInView = CAMERA.getRegionsInView()
        for(var x = 0; x < MAX_REGION_WIDTH; x++)
        {
            for(var y = 0; y < MAX_REGION_HEIGHT; y++)
            {
                var region = this.getRegion(x, y);
                if(region == null)
                    continue;

                var foundRegion = false;
                for(var i = 0; i < regionsInView.length; i++)
                {
                    if(region.position.x == regionsInView[i].x &&
                        region.position.y == regionsInView[i].y)
                    {
                        foundRegion = true;
                        break;
                    }
                }

                if(foundRegion)
                {
                    for(var z = 0; z < MAX_PLANE; z++)
                    {
                        if(z != 0 && z != this.currentPlane)
                        {
                            var plane = region.getPlane(z);
                            if(plane != null)
                                plane.setVisibility(false);
                        }
                    }
                }
                else
                {
                    region.setVisibility(false);
                }
            }
        }
    } */

    clearMap()
    {
        var regionRect = CAMERA.getRegionRect();
        for(var x = 0; x < MAX_REGION_WIDTH; x++)
        {
            for(var y = 0; y < MAX_REGION_HEIGHT; y++)
            {
                var region = this.getRegion(x, y);
                if(region == null)
                    continue;

                var outOfBoundsPlanes = [];
                // if the region is within the camera bounds
                if(x > regionRect.x && x <= regionRect.x + regionRect.width &&
                    y > regionRect.y && y <= regionRect.y + regionRect.height)
                {

                    // lets see if the parent of this plane (the plane that actually draws over this area if its a zoomed out region)
                    // is outside of our view, if it is, add it to a list to later on enable
                    
                    for(var z = 0; z < MAX_PLANE; z++)
                    {
                        var plane = region.getPlane(z);
                        if(plane != null)
                        {
                            if(z != 0 && z != this.currentPlane)
                            {
                                plane.setVisibility(false);
                            }
                            else
                            {
                                // this can only happen for planes left or bottom
                                if(plane.parent != null && (plane.parent.region.position.x < x || plane.parent.region.position.y < y))
                                    outOfBoundsPlanes.push(plane.parent);
                            }
                        }
                    }
                }
                else
                {
                    region.setVisibility(false);
                }

                // set their visibility back to true for a smoother transition
                // disable their visibility once the real texture loads later on in setSprite
                //for(var i = 0; i < outOfBoundsPlanes.length; i++)
                //    outOfBoundsPlanes[i].setVisibility(true);
            }
        }
    }

    setPlane(planeId)
    {
        this.currentPlane = planeId;
        
        for(var i = 0; i < MAX_PLANE; i++)
        {
            var container = this.getPlaneContainer(i);
            container.alpha = ((i == planeId)?1.0:0.3);
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
        var regionsInView = CAMERA.getScaledRegionsInView();

        var zoomAmount = clamp(1 / CAMERA.zoom.x, 1, 32);

        for(let i = 0; i < regionsInView.length; i++)
        {
            var region = null;
            var regionsFound = [];

            // if scale is 1, then everything is fine, if we're scaled up, we want to check
            // surrounding regions, if there exists any valid regions around us
            // grab all regions so we can grab a region that we need for a specific plane
            // that means that we're supposed to draw a region at this position, so lets use
            // the sprite object of the first region we find, and place it there to draw it
            
            for(var x = regionsInView[i].x; x < regionsInView[i].x + zoomAmount; x++)
            {
                for(var y = regionsInView[i].y; y < regionsInView[i].y + zoomAmount; y++)
                {
                    region = this.getRegion(x, y);
                    if(region != null)
                        regionsFound.push(region);
                }
            }

            // if no surrounding regions was found, then theres nothing to render for this area
            if(regionsFound.length <= 0)
                continue;

            // lets find a region with baseplane (0)
            // lets also find a region that has the same plane as the current plane

            var baseRegion = null;
            var currentPlaneRegion = null;

            for(var j = 0; j < regionsFound.length; j++)
            {
                if(baseRegion == null && regionsFound[j].hasPlane(0))
                {
                    baseRegion = regionsFound[j];

                    // always load base plane sprites
                    var basePlane = baseRegion.getPlane(0); 
                    basePlane.setSprite();
                }

                if(currentPlaneRegion == null && regionsFound[j].hasPlane(this.currentPlane))
                {
                    currentPlaneRegion = regionsFound[j];

                    // if the current plane is not the base plane
                    if(this.currentPlane != 0)
                    {
                        var currentPlane = currentPlaneRegion.getPlane(this.currentPlane);
                        currentPlane.setSprite();
                    }
                }
            }
        } 
    }
}
import {RenderQueue} from './renderqueue.js'

export var MAP_ID = 0;
export var MAP_ZOOM_LEVEL = 3;

export function getChunkWidth() {return Math.pow(2, 6+MAP_ZOOM_LEVEL);} // in pixels, 512 by default zoom LVL 3
export function getChunkHeight() {return Math.pow(2, 6+MAP_ZOOM_LEVEL);} // in pixels, 512 by default zoom LVL 3

export const CHUNK_TILE_WIDTH = Math.pow(2, 6);  // 64 tiles
export const CHUNK_TILE_HEIGHT = Math.pow(2, 6); // 64 tiles

export const TILE_SIZE = 8.0;
export const START_TILE = {x:3221, y:3218}; // starting pos for camera (lumbridge)

const MAX_CHUNK_WIDTH = 100;
const MAX_CHUNK_HEIGHT = 100;

function BuildChunkTexturePath(mapId, cacheVersion, zoomLevel, x, y, z)
{
    return `img/maps${mapId}_${cacheVersion}/${zoomLevel}/${z}_${x}_${y}.png`;
}

var renderQueue = new RenderQueue();

// a 64x64 tile chunk of a map
export class Chunk
{
    constructor()
    {
        this.position = {x:0, y:0}; // chunk pos, not world pos
        this.sprite = new PIXI.Sprite();
        this.isRendered = false;
    }

    init(chunkX, chunkY)
    {
        this.setPosition(chunkX, chunkY);
    }

    setSprite(mapId, zoomLevel, plane)
    {
        // invert Y position
        var newY = (this.position.y - MAX_CHUNK_HEIGHT) * -1;
        var spritePath = BuildChunkTexturePath(mapId, GIMP_TRACKER_CACHE_VERSION, zoomLevel, this.position.x, newY, plane);
        
        // this texture have not loaded, and we're waiting for it to load, add it to render queue
         if(APP.loader.resources[spritePath].texture == null)
            RENDERQUEUE.add(spritePath, this);
        else
            this.sprite.texture = APP.loader.resources[spritePath].texture; 

        // old way of rendering
        //this.sprite.texture = PIXI.Sprite.from(spritePath).texture

        this.sprite.x = this.position.x * getChunkWidth();
        this.sprite.y = this.position.y * getChunkHeight();
    }

    setPosition(x, y)
    {
        this.position.x = x;
        this.position.y = y;

        if(this.sprite != null)
        {
            this.sprite.x = x * getChunkWidth();
            this.sprite.y = y * getChunkHeight();
        }
    }

    setRendered(val)
    {
        this.isRendered = val;
    }
}

// an entire map, like runescape surface
export class WorldMap
{
    constructor()
    {
        this.id = 0; // mapID
        this.chunks = this.initializeMap(MAX_CHUNK_WIDTH, MAX_CHUNK_HEIGHT) // 2d array
        this.name = 'NULL';
    }

    isChunkPosInRange(x, y)
    {
        return x > 0 && y > 0 && x < MAX_CHUNK_WIDTH && y < MAX_CHUNK_HEIGHT;
    }

    addChunk(chunk)
    {
        this.chunks[chunk.position.x][chunk.position.y] = chunk;
    }

    removeChunk(chunk)
    {
        this.chunks[chunk.position.x][chunk.position.y] = null;
    }

    getChunk(position)
    {
        if(!this.isChunkPosInRange(position.x, position.y))
            return null;

        return this.chunks[position.x][position.y];
    }

    initializeMap(d1, d2)
    {
        var arr = [];
        for(var i = 0; i < d2; i++)
            arr.push(new Array(d1));
        return arr;
    }
}

export class World
{
    constructor()
    {
        this.map = new WorldMap();
        this.chunkData = null;
        this.loadChunkData();
    }

    loadChunkData()
    {
        var chunkDataURL = "./chunkpos.json";
        $.ajax({
            type: 'GET',
            url: chunkDataURL,
            dataType: 'json',
            success: (data) => {this.chunkData = data;},
            async: false
        });
    }

    initMap(mapID)
    {
        var mapChunkData = this.chunkData.chunkPos[mapID];
        this.map.name = mapChunkData.name;
        this.map.id = mapID;

        var chunks = mapChunkData.chunks;
        var texturePaths = [];

        for(var j = 0; j < chunks.length; j++)
        {
            // only create 1 layer of chunks
            if(chunks[j].z != 0)
                continue;

            // create chunk slots for this map
            var chunk = new Chunk();

            // revert y chunks
            chunk.init(chunks[j].x, (chunks[j].y - MAX_CHUNK_HEIGHT) *-1);
            this.map.addChunk(chunk);

            var path = BuildChunkTexturePath(mapID, GIMP_TRACKER_CACHE_VERSION, 3, chunks[j].x, chunks[j].y, chunks[j].z);
            texturePaths.push(path);
        }
        APP.loader.add(texturePaths);
        APP.loader.load();
    }

    // 3200, 3200 to 50, 50 (50 * 64)
    getChunkPositionFromWorldPosition(x, y)
    {
        return {x: Math.floor(x / getChunkWidth()), y: Math.floor(y / getChunkHeight())};
    }

    // 50, 50 to 3200, 3200 (50 * 64)
    getWorldPositionFromChunkPosition(x, y)
    {
        return {x: x * getChunkWidth(), y: y * getChunkHeight()};
    }

    getTilePositionFromWorldPosition(x, y)
    {
        var newX = Math.floor(x / TILE_SIZE);
        var newY = Math.floor(y / TILE_SIZE);
        
        return {x: newX, y: newY};
    }

    clearMap()
    {
        for(var x = 0; x < MAX_CHUNK_WIDTH; x++)
        {
            for(var y = 0; y < MAX_CHUNK_HEIGHT; y++)
            {
                var chunk = this.map.chunks[x][y];
                if(chunk == null)
                    continue;
                    
                APP.stage.removeChild(chunk.sprite);
                chunk.setRendered(false);
            }
        }
    }

    updateMap()
    {
        this.clearMap();
        var chunksInView = CAMERA.getChunksInView();
        for(var i = 0; i < chunksInView.length; i++)
        {
            var chunk = this.map.getChunk({x:chunksInView[i].x, y:chunksInView[i].y});
            if(chunk == null)
                continue;

            chunk.setSprite(this.map.id, 3, 0);
            APP.stage.addChild(chunk.sprite);
            chunk.setRendered(true);
        } 
    }
}
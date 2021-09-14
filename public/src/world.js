import { RenderQueue } from './renderqueue.js'
import { Player } from './player.js'
import { StageObject, WorldObject, WorldText, SpawnObject, DeleteObject } from './object.js';

export var MAP_ID = 0;
export var MAP_ZOOM_LEVEL = 2;

export function getChunkWidth() {return Math.pow(2, 6+MAP_ZOOM_LEVEL);} // in pixels, 256 by default zoom LVL 2
export function getChunkHeight() {return Math.pow(2, 6+MAP_ZOOM_LEVEL);} // in pixels, 256 by default zoom LVL 2

export const CHUNK_TILE_WIDTH = Math.pow(2, 6);  // 64 tiles
export const CHUNK_TILE_HEIGHT = Math.pow(2, 6); // 64 tiles

export const TILE_SIZE = getChunkWidth() / CHUNK_TILE_WIDTH; //
export const START_TILE = {x:3221, y:3218}; // starting pos for camera (lumbridge)

export const MAX_CHUNK_WIDTH = 100;
export const MAX_CHUNK_HEIGHT = 100;

export const LAYERS = 
{
    MAP: 0,
    OBJECT: 1,
    PLAYER: 2,
}

export function ConnectPlayer(name, pos)
{
    var player = new Player(name, pos);
    player.init();
    PLAYERS.set(name, player);
    SpawnObject(player);

    return player;
}

export function GetPlayer(name)
{
    return PLAYERS.get(name);
}

export function DisconnectPlayer(name)
{
    var player = PLAYERS.get(name);
    if(player == null)
        return;

    PLAYERS.delete(name);
    DeleteObject(player);
}

function BuildChunkTexturePath(mapId, cacheVersion, zoomLevel, x, y, z)
{
    return `maps${mapId}_${cacheVersion}/${zoomLevel}/${z}_${x}_${y}.png`;
}

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

        this.sprite.zIndex = LAYERS.MAP;

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

    init(mapID)
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

            var path = BuildChunkTexturePath(mapID, GIMP_TRACKER_CACHE_VERSION, MAP_ZOOM_LEVEL, chunks[j].x, chunks[j].y, chunks[j].z);
            texturePaths.push(path);
        }
        APP.loader.baseUrl = 'img/';
        APP.loader.add(texturePaths);
        APP.loader.baseUrl = '';
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

    // perform voodoo to convert pixi space to osrs space
    invertWorldPosY(y)
    {
        return -y + (MAX_CHUNK_HEIGHT * getChunkHeight()) + (CHUNK_TILE_HEIGHT * TILE_SIZE);
    }

    invertTilePosY(y)
    {
        return -y + (MAX_CHUNK_HEIGHT * CHUNK_TILE_HEIGHT) + CHUNK_TILE_HEIGHT - 1;
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
                    
                APP.mapContainer.removeChild(chunk.sprite);
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

            chunk.setSprite(this.map.id, MAP_ZOOM_LEVEL, 0);
            APP.mapContainer.addChild(chunk.sprite);
            chunk.setRendered(true);
        } 
    }

    // always show map
    /* updateMap()
    {
        for(var x = 0; x < 100; x++)
        {
            for(var y = 0; y < 100; y++)
            {
                var chunk = this.map.getChunk({x:x, y:y});
                if(chunk == null)
                    continue;

                chunk.setSprite(this.map.id, MAP_ZOOM_LEVEL, 0);

                APP.mapContainer.addChild(chunk.sprite);
                chunk.setRendered(true);
            }
        }
    } */
}
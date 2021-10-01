import { CoordinateMap } from "../../coordinatemap.js";
import { DeleteObject, SpawnObject, WorldObject } from "../../object.js";
import { MAX_REGION_HEIGHT, MAX_REGION_WIDTH, REGION_HEIGHT, REGION_WIDTH, TILE_SIZE, X_CHUNKS_PER_REGION, Y_CHUNKS_PER_REGION } from "../../world.js";

export class Grid extends WorldObject
{
    constructor(name)
    {
        super(name);

        this.lineWidth = 2;

        this.setGraphic(new PIXI.Graphics());
        this.updateGrid();

        this.selectedChunks = new CoordinateMap();
    }

    selectChunk(tilePosition)
    {
        var chunkOverlay = this.getSelectedChunk(tilePosition);
        if(chunkOverlay != null)
            return;

        var chunkOverlay = new WorldObject("ChunkOverlay");

        chunkOverlay.setGraphic(new PIXI.Graphics());
        chunkOverlay.graphic.beginFill(0xF00000);
        chunkOverlay.graphic.drawRect(0, 0, X_CHUNKS_PER_REGION * TILE_SIZE, Y_CHUNKS_PER_REGION * TILE_SIZE);
        chunkOverlay.graphic.endFill();
        chunkOverlay.graphic.alpha = 0.5;
        chunkOverlay.setParent(this);

        chunkOverlay.setWorldPosition(tilePosition.x * TILE_SIZE, tilePosition.y * TILE_SIZE);

        this.selectedChunks.set(tilePosition.x, tilePosition.y, chunkOverlay);
        SpawnObject(chunkOverlay);
        
        //chunkOverlay.setZIndex(LAYERS.PLAYER);
    }

    deselectChunk(tilePosition)
    {
        var chunkOverlay = this.getSelectedChunk(tilePosition);
        if(chunkOverlay == null)
            return;

        this.selectedChunks.delete(tilePosition.x, tilePosition.y);
        DeleteObject(chunkOverlay);
    }

    getSelectedChunk(tilePosition)
    {
        return this.selectedChunks.get(tilePosition.x, tilePosition.y);
    }

    onZoom(x, y)
    {
        var lineWidth = 1 / x;
        if(lineWidth < 1)
            lineWidth = 1;

        this.setLineWidth(lineWidth);
    }

    setLineWidth(width)
    {
        this.lineWidth = width;
        this.updateGrid();
    }

    updateGrid()
    {
        this.graphic.clear();
        this.graphic.lineStyle(this.lineWidth, 0xFF0000, 1.0, 0.5);

        for(var x = 0; x < MAX_REGION_WIDTH; x++)
        {
            this.graphic.moveTo(x * REGION_WIDTH, 0);
            this.graphic.lineTo(x * REGION_WIDTH, MAX_REGION_HEIGHT * REGION_HEIGHT - REGION_HEIGHT); //   |      |     |
        }

        for(var y = 0; y < MAX_REGION_HEIGHT; y++)
        {
            this.graphic.moveTo(0,                                              y * REGION_HEIGHT);   // ---
            this.graphic.lineTo(MAX_REGION_WIDTH * REGION_WIDTH - REGION_WIDTH, y * REGION_HEIGHT);   // ---
        }
    }
}
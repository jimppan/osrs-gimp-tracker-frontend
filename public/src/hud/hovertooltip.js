import { HudText, WorldObject } from "../object.js";
import { TILE_SIZE } from "../world.js";

export class HoverTooltip extends HudText
{
    constructor(name, text, textStyle, resolution)
    {
        super(name, text, textStyle, resolution);
        this.graphic.resolution = 16;
        this.graphic.anchor.set(0, 0);
    }

    update()
    {
        var text = ``;

        if(MOUSE_OVER_OBJECT != null)
        {
            text = MOUSE_OVER_OBJECT.name;
            if(MOUSE_OVER_OBJECT instanceof WorldObject)
            {
                var tile = MOUSE_OVER_OBJECT.getWorldPosition();
                tile.x = Math.floor(tile.x / TILE_SIZE);
                tile.y = Math.floor(tile.y / TILE_SIZE);

                text += ` [${tile.x},${tile.y}]`;
            }
        }
        else
        {
            var tile = CAMERA.getCursorWorldPosition();
            tile.x = Math.floor(tile.x / TILE_SIZE);
            tile.y = Math.floor(tile.y / TILE_SIZE);
            text = `[${tile.x},${tile.y}]`;
        }
        this.setText(text)
    }
}
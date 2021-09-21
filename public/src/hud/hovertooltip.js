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
                tile.plane = MOUSE_OVER_OBJECT.plane;

                text += ` [${tile.x}, ${tile.y}, ${tile.plane}]`;
            }
        }
        else
        {
            // keep showing selected object info if we're not hovering something else
            if(SELECTED_OBJECT != null)
            {
                if(SELECTED_OBJECT instanceof WorldObject)
                {
                    var tile = SELECTED_OBJECT.getWorldPosition();
                    tile.x = Math.floor(tile.x / TILE_SIZE);
                    tile.y = Math.floor(tile.y / TILE_SIZE);
                    tile.plane = SELECTED_OBJECT.plane;
    
                    text += ` [${tile.x}, ${tile.y}, ${tile.plane}]`;
                }
            }
            else
            {
                var tile = CAMERA.getCursorWorldPosition();
                tile.x = Math.floor(tile.x / TILE_SIZE);
                tile.y = Math.floor(tile.y / TILE_SIZE);
                text = `[${tile.x}, ${tile.y}]`;
            }
        }
        this.setText(text)
    }
}
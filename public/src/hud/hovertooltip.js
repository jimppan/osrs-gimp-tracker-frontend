import { HudObject, StageObject, WorldObject } from "../object.js";
import { TILE_SIZE } from "../world.js";

const HUD_TEXT = new PIXI.TextStyle({
    fontFamily: 'OSRS Font',
    fontSize:'16px',
    fill: ['#ffffff'],
    //strokeThickness:1,
    dropShadow : true,
    dropShadowAlpha: 1,
    dropShadowAngle:0.6,
    dropShadowDistance: 16,
})

export class HoverTooltip extends HudObject
{
    constructor(name)
    {
        super(name);
        this.graphic = new PIXI.Text("", HUD_TEXT);

        this.graphic.position.x = 2;
        this.graphic.position.y = 2;
        this.graphic.scale.y = -1;

        this.graphic.resolution = 16;
        this.graphic.anchor.set(0, 0);
    }

    setText(text)
    {
        this.graphic.text = text;
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
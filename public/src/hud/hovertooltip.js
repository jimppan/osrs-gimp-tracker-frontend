import { HudObject } from "../object.js";

const HUD_TEXT = new PIXI.TextStyle({
    fontFamily: 'OSRS Font',
    fontSize:'16px',
    fill: ['#ffffff'],
    //strokeThickness:1,
    dropShadow : true,
    dropShadowAlpha: 1,
    dropShadowAngle:0.6,
    dropShadowDistance: 4,
})

export class HoverTooltip extends HudObject
{
    constructor(name)
    {
        super(name);
        this.graphic = new PIXI.Text("", HUD_TEXT);

        this.graphic.position.x = 2;
        this.graphic.position.y = 2;
        this.graphic.resolution = 4;
        this.graphic.anchor.set(0, 0);
    }

    setText(text)
    {
        this.graphic.text = text;
    }

    update()
    {
        if(MOUSE_OVER_OBJECT != null)
        {
            this.setText(MOUSE_OVER_OBJECT.name)
        }
        else
        {
            this.setText("")
        }
    }
}
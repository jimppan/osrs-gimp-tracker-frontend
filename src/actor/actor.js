import { HudText, SpawnObject, WorldObject, WorldText } from "../object.js";
import { LAYERS, TILE_SIZE } from "../world.js";

const ACTOR_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'OSRS Font',
    fontSize:'16px',
    fill: ['#00ff00'],
    strokeThickness:2,
    dropShadow : false,
    trim:true
})

export class Actor extends WorldObject
{
    constructor(name, color, position)
    {
        super(name);


        this.createOverlay = true;
        this.selectable = true;
        this.interactable = true;

        this.setGraphic(new PIXI.Graphics());
        this.graphic.beginFill(color);
        this.graphic.drawRect(0, 0, TILE_SIZE, TILE_SIZE);
        this.graphic.endFill();
        this.setZIndex(LAYERS.PLAYER);

        this.label = new HudText("ActorText", name, ACTOR_TEXT_STYLE, 16);
        this.label.attachTo(this, true, 0, 4);
        this.label.setAnchor(0, 1);
        this.label.interactable = true;
        this.label.clampToView = true;
        this.label.setZIndex(HUD_LAYERS.WORLD_FOREGROUND);

        this.setTilePosition(position.x, position.y, 0)
    }

    onClick()
    {
        //HUD.mainInterface.update();
    }

    init()
    {

    }

    parsePacket(packet, firstPacket)
    {
        if(packet.name != null)
            this.name = this.label.graphic.text = packet.name;

        if(packet.pos != null)
            this.setTilePosition(packet.pos.x, packet.pos.y, packet.pos.z);
    }
}
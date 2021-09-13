import { TILE_SIZE, LAYERS} from "./world.js";
import { WorldObject, WorldText } from "./entity.js";

const PLAYER_TEXT_OFFSET = {x:0, y:20}

const PLAYER_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'OSRS Font',
    fontSize:'16px',
    fill: ['#00ff00'],
    strokeThickness:2,
    dropShadow : false,
})

export class Player extends WorldObject
{
    constructor(name, tilePos)
    {
        super(name);

        this.playerText = new WorldText("PlayerText", name, PLAYER_TEXT_STYLE);
        //this.position = {x:tilePos.x * TILE_SIZE, y:tilePos.y * TILE_SIZE + TILE_SIZE}
        this.gamePosition = {x:tilePos.x, y:tilePos.y}
    }

    init()
    {
        this.graphic = new PIXI.Graphics();
        this.graphic.beginFill(0x00ff00);
        this.graphic.drawRect(0, 0, TILE_SIZE, TILE_SIZE);
        this.graphic.endFill();

        this.graphic.zIndex = LAYERS.PLAYER;

        this.playerText.keepScale = true;
        this.playerText.setPosition(this.gamePosition.x, this.gamePosition.y);
        this.addChild(this.playerText);
        this.setPosition(this.gamePosition.x, this.gamePosition.y)
    }

    /* setPosition(x, y)
    {
        super.setPosition(x, y);

        // perform black magic to not scale player nameplate and also move it properly with the player
         this.playerText.graphic.position.x = this.graphic.position.x + Math.round(PLAYER_TEXT_OFFSET.x);
        this.playerText.graphic.position.y = this.graphic.position.y + Math.round(-PLAYER_TEXT_OFFSET.y);

        this.playerText.graphic.scale.x = 1 / CAMERA.zoom.x;
        this.playerText.graphic.scale.y = 1 / CAMERA.zoom.y;

        this.playerText.graphic.position.y = WORLD.invertWorldPosY(y * TILE_SIZE + TILE_SIZE) - ((1 / CAMERA.zoom.y) * 20)
    } */
}


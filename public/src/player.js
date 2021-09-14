import { TILE_SIZE, LAYERS} from "./world.js";
import { WorldObject, WorldText } from "./object.js";

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
        //this.playerTest = new WorldText("debugtext", "another piece of text", PLAYER_TEXT_STYLE);
        this.gamePosition = {x:tilePos.x, y:tilePos.y}
    }

    init()
    {
        this.interactable = true;

        this.graphic = new PIXI.Graphics();
        this.graphic.beginFill(0x00ff00);
        this.graphic.drawRect(0, 0, TILE_SIZE, -TILE_SIZE);
        this.graphic.endFill();

        this.width = TILE_SIZE;
        this.height = -TILE_SIZE;

        this.graphic.zIndex = LAYERS.PLAYER;
        this.playerText.keepScale = true;
        this.playerText.setPosition(this.gamePosition.x, this.gamePosition.y + 1);
        this.playerText.interactable = true;
        this.addChild(this.playerText);
        
        /* this.playerTest.keepScale = true;
        this.playerTest.interactable = true;
        this.playerTest.setPosition(this.gamePosition.x - 5, this.gamePosition.y - 5);
        this.addChild(this.playerTest); */

        this.setPosition(this.gamePosition.x, this.gamePosition.y)
        
    }
}


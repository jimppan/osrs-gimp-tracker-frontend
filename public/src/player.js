import { START_TILE, TILE_SIZE, LAYERS} from "./world.js";

const PLAYER_TEXT_OFFSET = {x:0, y:20}

const PLAYER_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'OSRS Font',
    fontSize:'16px',
    fill: ['#00ff00'],
    strokeThickness:2,
    dropShadow : false,
})

export class Player
{
    constructor(name, tilePos)
    {
        this.name = name

        this.playerText = null;
        this.playerGraphic = null;
        this.position = {x:tilePos.x * TILE_SIZE, y:tilePos.y * TILE_SIZE + TILE_SIZE}
    }

    init()
    {
        this.playerGraphic = new PIXI.Graphics();
        this.playerGraphic.beginFill(0x00ff00);
        this.playerGraphic.drawRect(0, 0, TILE_SIZE, TILE_SIZE);
        this.playerGraphic.endFill();

        this.playerGraphic.zIndex = LAYERS.PLAYER;
        
        this.playerText = new PIXI.Text(this.name, PLAYER_TEXT_STYLE);
        this.playerText.resolution = 64;
        this.playerText.zIndex = LAYERS.PLAYER;

        APP.objectContainer.addChild(this.playerGraphic)
        APP.hudContainer.addChild(this.playerText);

        this.setPosition(this.position.x, this.position.y)
    }

    setPosition(x, y)
    {
        this.position.x = x;
        this.position.y = y;

        this.playerGraphic.position.x = Math.round(x);
        this.playerGraphic.position.y = Math.round(WORLD.invertWorldPosY(y));

        // perform black magic to not scale player nameplate and also move it properly with the player
        this.playerText.position.x = this.playerGraphic.position.x + Math.round(PLAYER_TEXT_OFFSET.x);
        this.playerText.position.y = this.playerGraphic.position.y + Math.round(-PLAYER_TEXT_OFFSET.y);

        this.playerText.scale.x = 1 / CAMERA.zoom.x;
        this.playerText.scale.y = 1 / CAMERA.zoom.y;

        this.playerText.position.y = WORLD.invertWorldPosY(this.position.y) - ((1 / CAMERA.zoom.y) * 20)
    }
}


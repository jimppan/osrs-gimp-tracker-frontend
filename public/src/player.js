import { TILE_SIZE, LAYERS} from "./world.js";
import { WorldObject, WorldText, SpawnObject, DeleteObject} from "./object.js";
import { INVALID_ITEM, INVENTORY_SIZE } from "./hud/inventory.js";

const PLAYER_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'OSRS Font',
    fontSize:'16px',
    fill: ['#00ff00'],
    strokeThickness:2,
    dropShadow : false,
})

export class InventorySlot
{
    constructor(itemId, quantity)
    {
        this.itemId = itemId;
        this.quantity = quantity;
    }
}

export class Player extends WorldObject
{
    constructor(name)
    {
        super(name);

        this.playerText = new WorldText("PlayerText", name, PLAYER_TEXT_STYLE);
        this.gamePosition = {x:0,y:0};
        this.createOverlay = true;
        this.selectable = true;

        this.inventory = new Array(INVENTORY_SIZE);
        for(var i = 0; i < INVENTORY_SIZE; i++)
            this.inventory[i] = new InventorySlot(INVALID_ITEM, 0);
    }

    onClick()
    {
        HUD.mainInterface.update();
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

        this.setPosition(this.gamePosition.x, this.gamePosition.y)
    }

    parsePacket(packet)
    {
        console.log(packet);
        if(packet.name != null)
            this.name = this.playerText.graphic.text = packet.name;

        if(packet.pos != null)
            this.setPosition(packet.pos.x, packet.pos.y);

        if(packet.inventory != null)
        {
            for(var i = 0; i < INVENTORY_SIZE; i++)
            {
                if(packet.inventory[`${i}`] != null)
                {
                    var item = this.inventory[i];
                    item.itemId = packet.inventory[`${i}`].id;
                    item.quantity = packet.inventory[`${i}`].quantity;
                }
            }
            HUD.mainInterface.update();
        }
    }
}

export function IsValidPacket(packet)
{
    return packet.name != null;
}

export function ConnectPlayer(packet)
{
    if(!IsValidPacket(packet))
        return false;

    console.log("Player connected: ", packet.name);

    var player = new Player();
    player.init();
    player.parsePacket(packet);
    PLAYERS.set(packet.name, player);

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

    console.log("Player disconnected: ", name);
    PLAYERS.delete(name);
    DeleteObject(player);
}

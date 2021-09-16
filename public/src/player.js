import { TILE_SIZE, LAYERS} from "./world.js";
import { WorldObject, WorldText, SpawnObject, DeleteObject} from "./object.js";
import { INVALID_ITEM, INVENTORY_SIZE } from "./hud/maininterface/inventory.js";
import { InterfaceSkillSlot } from "./hud/maininterface/skills.js";

const PLAYER_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'OSRS Font',
    fontSize:'16px',
    fill: ['#00ff00'],
    strokeThickness:2,
    dropShadow : false,
})

export const SKILLS =
{
    ATTACK: 0,
    DEFENCE: 1,
    STRENGTH: 2,
    HITPOINTS: 3,
    RANGED: 4,
    PRAYER: 5,
    MAGIC: 6,
    COOKING: 7,
    WOODCUTTING: 8,
    FLETCHING: 9,
    FISHING: 10,
    FIREMAKING: 11,
    CRAFTING: 12,
    SMITHING: 13,
    MINING: 14,
    HERBLORE: 15,
    AGILITY: 16,
    THIEVING: 17,
    SLAYER: 18,
    FARMING: 19,
    RUNECRAFT: 20,
    HUNTER: 21,
    CONSTRUCTION: 22,

    TOTAL: 23,
}


export const SKILL_NAMES =
[
    "Attack", "Defence","Strength","Hitpoints","Ranged","Prayer","Magic",
    "Cooking", "Woodcutting", "Fletching",  "Fishing", "Firemaking",
    "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", 
    "Slayer", "Farming", "Runecrafting", "Hunter", "Construction", 
    
    "Total", // total
]

export const LEVELS = 
[
    //1-91   2-92     3-93     4-94     5-95     6-96     7-97      8-98      9-99     10-100
    0,       83,      174,     276,     388,     512,     650,      801,      969,     1154,    // 1 - 10
    1358,    1584,    1833,    2107,    2411,    2746,    3115,     3523,     3974,    4470,    // 11 - 20
    5018,    5624,    6291,    7028,    7842,    8740,    9730,     10824,    12031,   13363,   // 21 - 30
    14833,   16456,   18247,   20224,   22406,   24815,   27473,    30408,    33648,   37224,   // 31 - 40
    41171,   45529,   50339,   55649,   61512,   67983,   75127,    83014,    91721,   101333,  // 41 - 50
    111945,  123660,  136594,  150872,  166636,  184040,  203254,   224466,   247886,  273742,  // 51 - 60
    302288,  333804,  368599,  407015,  449428,  496254,  547953,   605032,   668051,  737627,  // 61 - 70
    814445,  899257,  992895,  1096278, 1210421, 1336443, 1475581,  1629200,  1798808, 1986068, // 71 - 80
    2192818, 2421087, 2673114, 2951373, 3258594, 3597792, 3972294,  4385776,  4842295, 5349332, // 81 - 90
    5902831, 6517253, 7195629, 7944614, 8771558, 9684557, 10692629, 11805606, 13034431          // 91 - 99

]

export class InventorySlot
{
    constructor(itemId, quantity)
    {
        this.itemId = itemId;
        this.quantity = quantity;
    }
}

export class SkillSlot
{
    constructor(skillId, experience)
    {
        this.skillId = skillId;
        this.experience = experience;
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

        this.skills = new Array(SKILLS.TOTAL);
        for(var i = 0; i < SKILLS.TOTAL; i++)
            this.skills[i] = new SkillSlot()
    }

    onClick()
    {
        //HUD.mainInterface.update();
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

        if(packet.skills != null)
        {
            for(var i = 0; i < SKILLS.TOTAL; i++)
            {
                if(packet.skills[`${i}`] != null)
                {
                    var skill = this.skills[i];
                    skill.itemId = packet.skills[`${i}`].id;
                    skill.experience = packet.skills[`${i}`].experience;
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

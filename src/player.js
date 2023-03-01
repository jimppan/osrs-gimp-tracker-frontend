import { TILE_SIZE, LAYERS} from "./world.js";
import { WorldText, SpawnObject, DeleteObject, HudText, HudObject} from "./object.js";
import { INVALID_ITEM, INVENTORY_SIZE } from "./hud/maininterface/inventory.js";
import { Actor } from "./actor/actor.js";

export const SKILLS =
{
    ATTACK:       0,
    DEFENCE:      1,
    STRENGTH:     2,
    HITPOINTS:    3,
    RANGED:       4,
    PRAYER:       5,
    MAGIC:        6,
    COOKING:      7,
    WOODCUTTING:  8,
    FLETCHING:    9,
    FISHING:      10,
    FIREMAKING:   11,
    CRAFTING:     12,
    SMITHING:     13,
    MINING:       14,
    HERBLORE:     15,
    AGILITY:      16,
    THIEVING:     17,
    SLAYER:       18,
    FARMING:      19,
    RUNECRAFT:    20,
    HUNTER:       21,
    CONSTRUCTION: 22,

    TOTAL:        23,
}

export const SKILL_NAMES =
[
    "Attack",   "Defence",  "Strength",     "Hitpoints", "Ranged",      "Prayer",
    "Magic",    "Cooking",  "Woodcutting",  "Fletching", "Fishing",     "Firemaking",
    "Crafting", "Smithing", "Mining",       "Herblore",  "Agility",     "Thieving", 
    "Slayer",   "Farming",  "Runecrafting", "Hunter",    "Construction", 
    
    "Total", // total
]

export const EQUIPMENT_NAMES =
[
    "Head", "Cape", "Amulet", "Weapon", "Body", "Shield", "Unknown1",
    "Legs", "Unknown2", "Gloves", "Boots", "Unknown3", "Ring", "Ammo"
]

export const EQUIPMENT =
{
    HEAD:     0,
    CAPE:     1,
    AMULET:   2,
    WEAPON:   3,
    BODY:     4,
    SHIELD:   5,
    UNKNOWN1: 6, // idk
    LEGS:     7,
    UNKNOWN2: 8, // idk
    GLOVES:   9,
    BOOTS:    10,
    UNKNOWN3: 11, // idk
    RING:     12,
    AMMO:     13,

    MAX:      14,
}

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

export const ACCOUNT_TYPE =
{
    NORMAL: 0,
    IRONMAN: 1,
    ULTIMATE_IRONMAN: 2,
    HARDCORE_IRONMAN: 3,
    GROUP_IRONMAN: 4,
    HARDCORE_GROUP_IRONMAN: 5,

    MAX: 6,
}

export const ACCOUNT_TYPE_ICONS =
[
    '',
    '423-2.png',
    '423-3.png',
    '423-10.png',
    '423-41.png',
    '423-42.png'
]

const WORLD_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: 'OSRS Font Plain',
    fontSize:'16px',
    fill: ['#00ccff'],
    strokeThickness:2,
    dropShadow : false,
    trim:true
})

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

export class Player extends Actor
{
    constructor(name, accountType, color, position)
    {
        super(name, color, position);

        this.worldLabel = new HudText("PlayerTextWorld", '', WORLD_TEXT_STYLE, 4);
        this.worldLabel.attachTo(this.label, false, 0, this.label.getWorldBounds().height);
        this.worldLabel.setAnchor(0, 1);
        this.worldLabel.interactable = true;
        this.worldLabel.clampToView = true;
        this.worldLabel.setZIndex(HUD_LAYERS.WORLD_FOREGROUND);

        if(accountType != null && accountType != ACCOUNT_TYPE.NORMAL)
        {
            this.accTypeIcon = new HudObject("PlayerAccTypeIcon");
            this.accTypeIcon.setGraphic(new PIXI.Sprite(APP.resourceManager.getTexture(ACCOUNT_TYPE_ICONS[accountType])));
            this.accTypeIcon.attachTo(this.worldLabel, false, this.worldLabel.getWorldBounds().width, 0);
            this.accTypeIcon.setAnchor(0, 0);
            this.accTypeIcon.interactable = true;
            this.accTypeIcon.clampToView = true;
            this.accTypeIcon.setZIndex(HUD_LAYERS.WORLD_FOREGROUND);
        }
        
        this.inventory = new Array(INVENTORY_SIZE);
        for(var i = 0; i < INVENTORY_SIZE; i++)
            this.inventory[i] = new InventorySlot(INVALID_ITEM, 0);

        this.skills = new Array(SKILLS.TOTAL);
        for(var i = 0; i < SKILLS.TOTAL; i++)
            this.skills[i] = new SkillSlot()

        this.equipment = new Array(EQUIPMENT.MAX);
        for(var i = 0; i < EQUIPMENT.MAX; i++)
            this.equipment[i] = new InventorySlot(INVALID_ITEM, 0)
    }

    onClick()
    {
    
    }

    parsePacket(packet, firstPacket)
    {
        var updateInterface = false;

        console.log(packet);
        if(packet.name != null)
            this.name = this.label.graphic.text = packet.name;

        if(packet.world != null)
        {
            this.world = this.worldLabel.graphic.text = `W${packet.world}`;

            // update the offset of the account type icon
            if(this.accTypeIcon != null)
                this.accTypeIcon.updateAttachment(false, this.worldLabel.getWorldBounds().width, 0)
        }

        if(packet.pos != null)
            this.setTilePosition(packet.pos.x, packet.pos.y, packet.pos.plane);

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
            updateInterface = true;
        }

        if(packet.skills != null)
        {
            for(var i = 0; i < SKILLS.TOTAL; i++)
            {
                if(packet.skills[`${i}`] != null)
                {
                    var skill = this.skills[i];
                    var nextExperience = packet.skills[`${i}`].experience;

                    if(!firstPacket)
                    {
                        // if it was an update by the client, lets start displaying xp drops
                        HUD.xpdropper.addDrop(skill.skillId, nextExperience - skill.experience);
                    }

                    skill.skillId = packet.skills[`${i}`].id;
                    skill.experience = nextExperience;
                }
            }
            HUD.xpdropper.displayDrops(this);
            updateInterface = true;
        }

        if(packet.equipment != null)
        {
            for(var i = 0; i < EQUIPMENT.MAX; i++)
            {
                if(packet.equipment[`${i}`] != null)
                {
                    var item = this.equipment[i];
                    item.itemId = packet.equipment[`${i}`].id;
                    item.quantity = packet.equipment[`${i}`].quantity;
                }
            }
            updateInterface = true;
        }

        if(updateInterface)
            HUD.updateInterface();
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

    var player = new Player(packet.name, packet.accountType, 0x00ff00, {x:0, y:0});
    player.parsePacket(packet, true);
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

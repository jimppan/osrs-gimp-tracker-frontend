import { HudObject } from "../../object.js";
import { Interface } from "../interface.js";
import { EQUIPMENT, EQUIPMENT_NAMES, InventorySlot, Player } from "../../player.js";
import { INVALID_ITEM } from "./inventory.js";
import { GetItemComposition } from "../../resource/itemdatabase.js";

export const EQUIPMENT_ICON_TEXTURES = 
[
    '156-0.png', // head
    '157-0.png', // cape
    '158-0.png', // amulet
    '159-0.png', // weapon
    '161-0.png', // body
    '162-0.png', // shield
    '',          // unknown1
    '163-0.png', // legs
    '',          // unknown2
    '164-0.png', // gloves
    '165-0.png', // boots
    '',          // unknown3
    '160-0.png', // ring
    '166-0.png', // ammo 
]

const EQUIPMENT_OFFSETS = 
[
    {x:-120, y:277}, // head
    {x:-160, y:237}, // cape
    {x:-120, y:237}, // amulet
    {x:-175, y:197}, // weapon
    {x:-120, y:197}, // body
    {x:-65,  y:197}, // shield
    {x: 0,   y: 0},  // unknown1
    {x:-120, y:156}, // legs
    {x: 0,   y: 0},  // unknown2
    {x:-175, y:115}, // gloves
    {x:-120, y:115}, // boots
    {x: 0,   y: 0},  // unknown3
    {x:-65,  y:115}, // ring
    {x:-80,  y:237}, // ammo
]

export const EQUIPMENT_BASE =
{
    BACKGROUND: 0
}

export const EQUIPMENT_BASE_TEXTURES = 
[
    '170-0.png',
]

export class InterfaceEquipmentSlot extends HudObject
{
    constructor(name, equipmentId)
    {
        super(name);

        this.equipmentId = equipmentId;
        this.itemSlot    = new InventorySlot(-1, 0);

        this.background  = new HudObject("InterfaceEquipmentSlotBG");
        this.foreground  = new HudObject("InterfaceEquipmentSlotFG");
        this.itemIcon    = new HudObject("InterfaceEquipmentSlotItem");

        this.interactable = true;
    }

    setVisibility(value)
    {
        this.background.setVisibility(value);
        this.foreground.setVisibility(this.itemSlot.itemId == -1 && value);
        this.itemIcon.setVisibility(value);

        // TODO: SET THE COUNT FOR QUIVER
        //var comp = GetItemComposition(this.itemSlot.itemId);
        //this.text.graphic.visible = this.quantity > 0 && comp.stackable && value;
    }

    getScreenRect()
    {
        return this.itemIcon.getScreenRect();
    }

    isVisible()
    {
        return this.parent.isVisible() && this.itemSlot.itemId != INVALID_ITEM;
    }

    onAssetsLoaded()
    {
        this.background.setGraphic(new PIXI.Sprite(APP.resourceManager.getTexture(EQUIPMENT_BASE_TEXTURES[EQUIPMENT_BASE.BACKGROUND])));
        this.foreground.setGraphic(new PIXI.Sprite(APP.resourceManager.getTexture(EQUIPMENT_ICON_TEXTURES[this.equipmentId])));
        this.itemIcon.setGraphic(new PIXI.Sprite());

        this.background.setZIndex(HUD_LAYERS.INTERFACE);
        this.foreground.setZIndex(HUD_LAYERS.INTERFACE_FOREGROUND);
        this.itemIcon.setZIndex(HUD_LAYERS.INTERFACE_FOREGROUND);

        this.background.setZIndex(1);
        this.foreground.setZIndex(2);
        this.itemIcon.setZIndex(3);

        this.background.setParent(this);
        this.foreground.setParent(this);
        this.itemIcon.setParent(this);

        this.setVisibility(false);
        this.setAnchor(0.5, 0.5);
        this.itemIcon.setPosition(2, 0);
    }

    loadSprite()
    {
        if(this.itemSlot.itemId == INVALID_ITEM)
        {
            this.foreground.setVisibility(this.parent.isVisible());
            this.itemIcon.setVisibility(false);
            this.itemIcon.graphic.texture = null;
        }
        else
        {
            var comp = GetItemComposition(this.itemSlot.itemId);

            this.name = comp.name;

            var itemIconId = this.itemSlot.itemId;

            this.itemIcon.graphic.texture = PIXI.Texture.from(`img/items/${itemIconId}.png`);
            this.itemIcon.graphic.texture.rotate = 8;
            
            this.itemIcon.setVisibility(this.parent.isVisible());
            this.foreground.setVisibility(false);
        }
    }
}

export class EquipmentInterface extends Interface
{
    constructor(name)
    {
        super(name);

        this.equipmentSlots = new Array(EQUIPMENT.MAX);
        for(var i = 0; i < EQUIPMENT.MAX; i++)
        {
            if(!this.isValidSlot(i))
                continue;

            this.equipmentSlots[i] = new InterfaceEquipmentSlot(EQUIPMENT_NAMES[i], i);
        }
    }

    init()
    {
        for(var i = 0; i < EQUIPMENT_ICON_TEXTURES.length; i++)
        {
            if(EQUIPMENT_ICON_TEXTURES[i] == '')
                continue;
            APP.resourceManager.add('img/ui/', EQUIPMENT_ICON_TEXTURES[i]);
        }
        APP.resourceManager.add('img/ui/', EQUIPMENT_BASE_TEXTURES);
    }

    isValidSlot(slot)
    {
        return slot != EQUIPMENT.UNKNOWN1 &&
               slot != EQUIPMENT.UNKNOWN2 &&
               slot != EQUIPMENT.UNKNOWN3;
    }

    setSlot(slot, itemId, quantity)
    {
        this.equipmentSlots[slot].itemSlot.itemId = itemId;
        this.equipmentSlots[slot].itemSlot.quantity = quantity;
    }

    emptySlot(slot)
    {
        this.equipmentSlots[slot].itemSlot.itemId = INVALID_ITEM;
        this.equipmentSlots[slot].itemSlot.quantity = 0;
    }

    getSlot(slot)
    {
        return this.equipmentSlots[slot];
    }

    loadSprites()
    {
        for(var i = 0; i < EQUIPMENT.MAX; i++)
        {
            if(!this.isValidSlot(i))
                continue;
                
            this.equipmentSlots[i].loadSprite();
        }
    }

    onAssetsLoaded()
    {
        for(var i = 0; i < EQUIPMENT.MAX; i++)
        {
            if(!this.isValidSlot(i))
                continue;

            this.equipmentSlots[i].onAssetsLoaded();
            this.equipmentSlots[i].setParent(this);
            this.equipmentSlots[i].setPosition(EQUIPMENT_OFFSETS[i].x, EQUIPMENT_OFFSETS[i].y);
        }
    }

    update()
    {
        if(SELECTED_OBJECT == null)
            return;

        if(!(SELECTED_OBJECT instanceof Player))
            return;

        for(var i = 0; i < EQUIPMENT.MAX; i++)
        {
            if(!this.isValidSlot(i))
                continue;

            this.setSlot(i, SELECTED_OBJECT.equipment[i].itemId, SELECTED_OBJECT.equipment[i].quantity);
        }

        this.loadSprites();
    }
}
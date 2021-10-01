import { GetItemComposition } from "../../resource/itemdatabase.js";
import { HudObject, HudText } from "../../object.js";
import { Player } from "../../player.js";
import { Interface } from "../interface.js";

export const INVENTORY_SIZE = 28;
export const INVALID_ITEM = -1;
const INVENTORY_ROWS = 4;

const ITEM_ICON_TEXT = new PIXI.TextStyle({
    fontFamily: 'OSRS Font Plain',
    fontSize:'16px',
    fill: ['#ffff00'],
    //strokeThickness:1,
    dropShadow : true,
    dropShadowAlpha: 1,
    dropShadowAngle:0.6,
    dropShadowDistance: 16,
})

const INVENTORY_OFFSET = {x:-180, y:275};

export class InterfaceItemSlot extends HudObject
{
    constructor(name, itemId, quantity)
    {
        super(name);

        this.itemId = itemId;
        this.quantity = 0;
        this.icon = new HudObject("InterfaceItemSlotIcon");
        this.text = new HudText("InterfaceItemSlotText", `${quantity}`, ITEM_ICON_TEXT, 16);

        this.icon.setGraphic(new PIXI.Sprite());

        this.icon.interactable = true;

        this.icon.setVisibility(false);
        this.text.setVisibility(false);

        this.icon.setAnchor(0.5, 0.5);
        this.text.setAnchor(0, 0.5);

        this.text.setPosition(-18, 4);
        this.text.setParent(this.icon);
        this.icon.setParent(this);

        this.icon.setZIndex(HUD_LAYERS.INTERFACE);
        this.text.setZIndex(HUD_LAYERS.INTERFACE_FOREGROUND);
    }

    setVisibility(value)
    {
        this.icon.setVisibility(value);

        var comp = GetItemComposition(this.itemId);
        this.text.graphic.visible = this.quantity > 0 && comp.stackable && value;
    }

    loadSprite()
    {
        if(this.itemId == INVALID_ITEM)
        {
            if(this.icon != null)
            {
                this.icon.graphic.texture = null;
                this.icon.setVisibility(false);
                this.text.setVisibility(false);
            }
        }
        else
        {
            var comp = GetItemComposition(this.itemId);

            this.icon.name = comp.name;
            
            var itemIconId = this.itemId;

            switch(this.itemId)
            {
                // theres 10 icons for coins, depending on quantity
                case 995:
                    if(this.quantity >= 10000) itemIconId = 1004;
                    else if(this.quantity >= 1000) itemIconId = 1003;
                    else if(this.quantity >= 250) itemIconId = 1002;
                    else if(this.quantity >= 100) itemIconId = 1001;
                    else if(this.quantity >= 25) itemIconId = 1000;
                    else if(this.quantity >= 5) itemIconId = 999;
                    else if(this.quantity >= 4) itemIconId = 998;
                    else if(this.quantity >= 3) itemIconId = 997;
                    else if(this.quantity >= 2) itemIconId = 996;
                    break;
            }

            this.icon.graphic.texture = PIXI.Texture.from(`img/items/${itemIconId}.png`);
            this.icon.graphic.texture.rotate = 8;
            this.text.setText(`${this.quantity}`);
            
            this.text.setVisibility(this.quantity > 0 && comp.stackable && this.parent.isVisible());
            this.icon.setVisibility(this.parent.isVisible());
        }
    }
}

export class InventoryInterface extends Interface
{
    constructor(name)
    {
        super(name);

        this.inventorySlots = new Array(INVENTORY_SIZE);
        for(var i = 0; i < INVENTORY_SIZE; i++)
        {
            this.inventorySlots[i] = new InterfaceItemSlot("InterfaceItemSlot", INVALID_ITEM, 0);
            this.inventorySlots[i].setParent(this);

            var x = i % INVENTORY_ROWS;
            var y = Math.floor(i / INVENTORY_ROWS);

            this.inventorySlots[i].setPosition(INVENTORY_OFFSET.x + (40 * x), INVENTORY_OFFSET.y - (36 * y));
        }
    }

    setSlot(slot, itemId, quantity)
    {
        this.inventorySlots[slot].itemId = itemId;
        this.inventorySlots[slot].quantity = quantity;
    }

    emptySlot(slot)
    {
        this.inventorySlots[slot].itemId = INVALID_ITEM;
        this.inventorySlots[slot].quantity = 0;
    }

    getSlot(slot)
    {
        return this.inventorySlots[slot];
    }

    loadSprites()
    {
        for(var i = 0; i < INVENTORY_SIZE; i++)
            this.inventorySlots[i].loadSprite();
    }

    update()
    {
        if(SELECTED_OBJECT == null)
            return;

        if(!(SELECTED_OBJECT instanceof Player))
            return;

        for(var i = 0; i < INVENTORY_SIZE; i++)
        {
            var itemInterfaceSlot = this.getSlot(i);
            itemInterfaceSlot.itemId = SELECTED_OBJECT.inventory[i].itemId;
            itemInterfaceSlot.quantity = SELECTED_OBJECT.inventory[i].quantity;
        }

        this.loadSprites();
    }
}
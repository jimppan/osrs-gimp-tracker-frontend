import { GetItemComposition, ItemComposition } from "../itemdatabase.js";
import { HudObject, SpawnObject } from "../object.js";
import { Player } from "../player.js";

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

const INVENTORY_OFFSET = {x:-180, y:-275};

export class InterfaceItemSlot extends HudObject
{
    constructor(name, itemId, quantity)
    {
        super(name);

        this.itemId = itemId;
        this.quantity = 0;
        this.icon = new HudObject("InterfaceItemSlotIcon");
        this.text = new HudObject("InterfaceItemSlotText");

        this.icon.graphic = new PIXI.Sprite();
        this.text.graphic = new PIXI.Text(`${quantity}`, ITEM_ICON_TEXT);
        this.text.graphic.resolution = 16;
        this.icon.interactable = true;

        this.icon.graphic.visible = false;
        this.text.graphic.visible = false;
        
        this.icon.graphic.anchor.set(0.5, 0.5);
        this.text.graphic.anchor.set(0.5, 0.5);

        this.text.setPosition(-8, -4);
        this.text.setParent(this.icon);
        this.icon.setParent(this);
        
        this.text.graphic.zIndex = 1;
    }

    loadSprite()
    {
        if(this.itemId == INVALID_ITEM)
        {
            if(this.icon != null)
            {
                this.icon.graphic.texture = null;
                this.icon.graphic.visible = false;
                this.text.graphic.visible = false;
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
            this.text.graphic.text = `${this.quantity}`;
            
            this.text.graphic.visible = this.quantity > 0 && comp.stackable;
            this.icon.graphic.visible = true;
            console.log(this.quantity);
        }
    }
}

export class InventoryInterface extends HudObject
{
    constructor(name)
    {
        super(name);

        this.inventorySlots = new Array(INVENTORY_SIZE);
        for(var i = 0; i < INVENTORY_SIZE; i++)
        {
            this.inventorySlots[i] = new InterfaceItemSlot("InterfaceItemSlot", INVALID_ITEM, 0);
            this.inventorySlots[i].setParent(this);

            var x = i % 4;
            var y = Math.floor(i / 4);

            this.inventorySlots[i].setPosition(INVENTORY_OFFSET.x + (40 * x), INVENTORY_OFFSET.y + (36 * y));
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
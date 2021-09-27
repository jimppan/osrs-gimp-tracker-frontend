export var ITEM_COMPOSITIONS = [];

export function GetItemComposition(id)
{
    return ITEM_COMPOSITIONS[id];
}

export function AddItemComposition(id, name, stackable, tradeable)
{
    ITEM_COMPOSITIONS.push(new ItemComposition(id, name, stackable, tradeable));
}

export class ItemComposition
{
    constructor(id, name, stackable, tradeable)
    {
        this.id = id;
        this.name = name;
        this.stackable = stackable;
        this.tradeable = tradeable;
    }
}
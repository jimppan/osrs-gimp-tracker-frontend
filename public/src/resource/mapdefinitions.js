export var MAP_DEFINITIONS = [];

export function GetMapDefinition(id)
{
    return MAP_DEFINITIONS[id];
}

export function AddMapDefinition(id, name, displayName, layer, plane, hidden)
{
    MAP_DEFINITIONS.push(new MapDefinition(id, name, displayName, layer, plane, hidden));
}

export class MapDefinition
{
    constructor(id, name, displayName, layer, plane, hidden)
    {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.layer = layer;
        this.plane = plane;
        this.hidden = hidden;
    }
}
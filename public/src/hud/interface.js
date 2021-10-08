import { HudObject } from "../object.js";

export class Interface extends HudObject
{
    constructor(name)
    {
        super(name);
        this.visible = false;
    }

    isVisible()
    {
        return this.visible;
    }

    setVisibility(value)
    {
        super.setVisibility(value);
        this.visible = value;
    }

    init()
    {
        
    }

    onAssetsLoaded()
    {
        
    }
}
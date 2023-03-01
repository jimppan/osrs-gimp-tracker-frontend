import { HudObject } from "../object.js";

export class ImageButton extends HudObject
{
    constructor(name)
    {
        super(name);

        this.interactable = true;
    }
}

export class ToggleButton extends ImageButton
{
    constructor(name)
    {
        super(name);

        this.value = false;
    }

    onClick()
    {
        this.value = !this.value;
    }
}

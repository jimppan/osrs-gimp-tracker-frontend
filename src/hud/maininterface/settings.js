import { HudObject } from "../../object.js";
import { Interface } from "../interface.js";
import { Player } from "../../player.js";

export class SettingsInterface extends Interface
{
    constructor(name)
    {
        super(name);

    }

    update()
    {
        if(SELECTED_OBJECT == null)
            return;

        if(!(SELECTED_OBJECT instanceof Player))
            return;
    }
}
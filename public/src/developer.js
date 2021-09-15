import { DeleteObject, DevObject, HudObject, SpawnObject } from "./object.js";

export function SetDeveloperMode(value)
{
    console.log("DEV MODE: ", value);
    if(value)
    {
        for(var i = 0; i < HUD_OBJECTS.length; i++)
        {
            var object = HUD_OBJECTS[i];
            if(!object.interactable)
                continue;

            var rect = object.getInteractableRect();
            
            var hudObject = new DevObject("DevMode");
            
            hudObject.graphic = new PIXI.Graphics();

            hudObject.graphic.clear();
            hudObject.graphic.beginFill(0xffff00);
            hudObject.graphic.alpha = 0.2;

            hudObject.graphic.drawRect(rect.x, rect.y, rect.width, rect.height);
            hudObject.graphic.endFill();

            SpawnObject(hudObject);
        }
    }
    else
    {
        for(var i = 0; i < DEV_OBJECTS; i++)
        {
            DeleteObject(DEV_OBJECTS[i]);
        }
    }
}

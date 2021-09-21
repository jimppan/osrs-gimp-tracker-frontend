import { DeleteObject, DevObject, HudObject, SpawnObject } from "./object.js";

export function SetDeveloperMode(value)
{
    console.log("DEV MODE: ", value);
    if(value)
    {
        for(var i = 0; i < HUD_OBJECTS.length; i++)
        {
            var object = HUD_OBJECTS[i];
            if(!object.interactable || !object.isVisible())
                continue;

            var rect = object.getScreenRect(true);
            console.log(object.name)
            console.log(rect);
            var hudObject = new DevObject("DevMode");
            
            hudObject.graphic = new PIXI.Graphics();

            hudObject.graphic.clear();
            hudObject.graphic.beginFill(0xffff00);
            hudObject.graphic.alpha = 0.3;

            hudObject.graphic.drawRect(rect.x, rect.y, rect.width, rect.height);
            hudObject.graphic.endFill();

            SpawnObject(hudObject);
        }
    }
    else
    {
        for(var i = DEV_OBJECTS.length-1; i >= 0; i--)
            DeleteObject(DEV_OBJECTS[i]);
    }
}

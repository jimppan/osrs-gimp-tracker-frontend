import { Overlay, SpawnObject, DeleteObject } from "./object.js";


// used if the camera zoom changes or if the object position/scale changes
export function updateOverlay(object)
{
    var overlay = getOverlay(object);
    if(overlay == null)
        return;

    overlay.graphic.clear();
    overlay.graphic.beginFill(0xffff00);
    overlay.graphic.alpha = 0.3;
    
    var box = object.getScreenRect(true);

    overlay.setPosition(box.x, box.y);
    overlay.graphic.drawRect(0, 0, box.width, box.height);
    overlay.graphic.endFill();
}

export function createOverlay(object)
{
    var overlay = new Overlay("HighlightObject");
    overlay.graphic = new PIXI.Graphics();

    overlay.graphic.beginFill(0xffff00);
    overlay.graphic.alpha = 0.3;
    overlay.setZIndex(HUD_LAYERS.WORLD_BACKGROUND);

    var box = object.getScreenRect(true);

    overlay.graphic.drawRect(0, 0, box.width, box.height);
    overlay.graphic.endFill();
    
    overlay.setPosition(box.x, box.y);
    overlay.attachTo(object, false, 0, 0);

    overlay.interactable = false;

    OVERLAYS.set(object, overlay);
    SpawnObject(overlay);

    return overlay;
}

export function deleteOverlay(object)
{
    DeleteObject(getOverlay(object));
    OVERLAYS.delete(object);
}

export function getOverlay(object)
{
    return OVERLAYS.get(object);
}
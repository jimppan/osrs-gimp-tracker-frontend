import { CHUNK_TILE_HEIGHT, TILE_SIZE } from "./world.js";

export class GameObject
{
    constructor(name)
    {
        this.name = name;
        this.gamePosition = {x:0, y:0};
        this.children = [];
        this.parent = null;
        this.keepScale = false;  // should this object keep its scale upon zooming
    }

    setPosition(x, y)
    {
        for(var i = 0; i < this.children.length; i++)
        {
            var diffPos = this.children[i].getRelativeGamePosition();
            this.children[i].setPosition(x + diffPos.x, y + diffPos.y);
        }

        this.gamePosition.x = x;
        this.gamePosition.y = y;
    }

    // relative to parent
    // so if parent sits at 3200 3200, and this sits at 3205 3205
    // then this returns 5, 5
    getRelativeGamePosition() 
    {
        if(parent == null)
            return {x: 0, y:0};

        return {x:this.gamePosition.x - this.parent.gamePosition.x, y:this.gamePosition.y - this.parent.gamePosition.y}
    }

    setParent(parent)
    {
        parent.addChild(this);
    }

    addChild(child)
    {
        if(this.children.indexOf(child) > -1)
            return;

        child.parent = this;
        this.children.push(child);
    }
    
    removeChild(child)
    {
        var index = entities.indexOf(child);
        if(index > -1)
        {
            children[i].parent = null;
            this.children.splice(index, 1);
        }
    }
}

// an overlay, button, UI etc..
export class StageObject extends GameObject
{
    constructor(name)
    {
        super(name);
 
        this.graphic = null;
        this.stage = null;

        this.interactable = false;
        this.wasHovered = false;
        this.createOverlay = false;
        this.selectable = false;

        this.width = 0;
        this.height = 0;
    }

    onClick()
    {

    }

    getBounds()
    {
        var bounds = this.graphic.getBounds();
        if(bounds.width == 0 && bounds.height == 0)
        {
            return {x: 0, y: 0, width: this.width, height: this.height};
        }
        else
        {
            return bounds;
        }
    }

    setAnchor(x, y)
    {
        for(var i = 0; i < this.children.length; i++)
            this.children[i].setAnchor(x, y);

        if(this.graphic != null && this.graphic.anchor != null)
            this.graphic.anchor.set(x, y);
    }

    // automatically calculates bounds of an object, including all its children
    getInteractableRect()
    {
        var rootParent = this.getRootParent();

        var pos = rootParent.graphic.position;
        //pos.x *= 1 / CAMERA.zoom.x;
        //pos.y *= 1 / CAMERA.zoom.y;

        var bl = rootParent.getBottomLeft(pos);

        var pos2 = {};
        pos2.x = rootParent.graphic.position.x;
        pos2.y = rootParent.graphic.position.y;
        
        var zoom = this.keepScale?1/CAMERA.zoom.x:1.0;

        pos2.x += rootParent.getBounds().width * zoom;
        pos2.y += rootParent.getBounds().height * zoom;

        var tr = rootParent.getTopRight(pos2);

        return new PIXI.Rectangle(bl.x, bl.y, tr.x - bl.x, tr.y - bl.y)
    }

    getRootParent()
    {
        var parent = this;
        while(parent.parent != null)
            parent = parent.parent;

        return parent;
    }

    getBottomLeft(checkAgainstBL)
    {
        var bottomLeft = checkAgainstBL;

        // make easy copy
        var ret = {};
        ret.x = bottomLeft.x;
        ret.y = bottomLeft.y;

        for(var i = 0; i < this.children.length; i++)
        {
            // ignore children that are not interactable
            if(!this.children[i].interactable)
                continue;

            if(this.children[i].graphic.position.x < ret.x)
                ret.x = this.children[i].graphic.position.x;

            if(this.children[i].graphic.position.y >= ret.y) // y is inverted, >=
                ret.y = this.children[i].graphic.position.y;
        }

        // keep looking deep for interactable children
        for(var i = 0; i < this.children.length; i++)
            ret = this.children[i].getBottomLeft(ret);

        return ret;
    }

    getTopRight(checkAgainstTR)
    {
        var topRight = checkAgainstTR;

        // make easy copy
        var ret = {};
        ret.x = topRight.x;
        ret.y = topRight.y;

        for(var i = 0; i < this.children.length; i++)
        {
            // ignore children that are not interactable
            if(!this.children[i].interactable)
                continue;

            var zoom = 1 / CAMERA.zoom.x;

            if(this.children[i].graphic.position.x + this.children[i].getBounds().width * zoom > ret.x)
                ret.x = this.children[i].graphic.position.x + this.children[i].getBounds().width * zoom;

            if(this.children[i].graphic.position.y - this.children[i].getBounds().height * zoom <= ret.y) // y is inverted, <=
                ret.y = this.children[i].graphic.position.y - this.children[i].getBounds().height * zoom;
        }

        for(var i = 0; i < this.children.length; i++)
            ret = this.children[i].getTopRight(ret);

        return ret;
    }

    setGraphic(graphic)
    {
        this.graphic = graphic;
    }

    setPosition(x, y)
    {
        for(var i = 0; i < this.children.length; i++)
        {
            var diffPos = this.children[i].getRelativeGamePosition();
            this.children[i].setPosition(x + diffPos.x, y + diffPos.y);
        }

        this.gamePosition.x = x;
        this.gamePosition.y = y;

        var realX = this.gamePosition.x * TILE_SIZE;
        var realY = this.gamePosition.y * TILE_SIZE;

        if(this.graphic != null)
        {
            this.graphic.position.x = Math.round(realX);
            this.graphic.position.y = Math.round(WORLD.invertWorldPosY(realY));
        }
        else
        {
            // most likely a hud object, use gamePosition as screenpos
            this.gamePosition.x = Math.round(realX);
            this.gamePosition.y = Math.round(WORLD.invertWorldPosY(realY));
        }
        
        if(this.keepScale)
        {
            this.graphic.scale.x = 1 / CAMERA.zoom.x;
            this.graphic.scale.y = 1 / CAMERA.zoom.y;
        }
    }
}

// object in the world
export class WorldObject extends StageObject
{
    constructor(name)
    {
        super(name);


    } 
}

// object in the world
export class HudObject extends StageObject
{
    constructor(name)
    {
        super(name);
    } 

    getInteractableRect()
    {
        return this.graphic.getBounds();
    }

    setPosition(x, y)
    {
        for(var i = 0; i < this.children.length; i++)
        {
            var diffPos = this.children[i].getRelativeGamePosition();
            this.children[i].setPosition(x + diffPos.x, y + diffPos.y);
        }

        
        if(this.graphic != null)
        {
            this.graphic.position.x = this.gamePosition.x = x;
            this.graphic.position.y = this.gamePosition.y = y;
        }
        else
        {
            // most likely a hud object, use gamePosition as screenpos
            this.gamePosition.x = x;
            this.gamePosition.y = y;
        }
    }
}

export class WorldText extends StageObject
{
    constructor(name, textString, textStyle)
    {
        super(name);
        
        this.setGraphic(new PIXI.Text(textString, textStyle))
        this.graphic.resolution = 64;
        this.graphic.anchor.set(0, 1); // set anchor bottom left to scale properly with object children and what not
    }
}

export class Overlay extends StageObject
{
    constructor(name, textString, textStyle)
    {
        super(name);

    }
}

export function SpawnObject(object)
{
    for(var i = 0; i < object.children.length; i++)
        SpawnObject(object.children[i]);

    if(object instanceof HudObject)
    {
        HUD_OBJECTS.push(object);
        if(object.graphic == null)
            return;

         APP.hudContainer.addChild(object.graphic);
        return;
    }

    OBJECTS.push(object);
    if(object.graphic == null)
    {
        // if the graphic was null, then its just an empty parent
        // used to group stuff up
        return;
    }

    if(object instanceof WorldText)
        APP.overlayContainer.addChild(object.graphic);
    else if(object instanceof Overlay)
        APP.overlayContainer.addChild(object.graphic);
    else if(object instanceof WorldObject)
        APP.objectContainer.addChild(object.graphic);
    else if(object instanceof StageObject)
        APP.overlayContainer.addChild(object.graphic);
    else
        APP.objectContainer.addChild(object.graphic);
}

export function DeleteObject(object)
{
    for(var i = 0; i < object.children.length; i++)
        DeleteObject(object.children[i]);

    if(object instanceof HudObject)
    {
        var index = HUD_OBJECTS.indexOf(object);
        if(index > -1)
            HUD_OBJECTS.splice(index, 1);

        HUD_OBJECTS.push(object);
        if(object.graphic == null)
            return;

        APP.hudContainer.delete(object.graphic);
        return;
    }

    var index = OBJECTS.indexOf(object);
    if(index > -1)
        OBJECTS.splice(index, 1);

    if(SELECTED_OBJECT == object)
        INPUT.deselectObject();

    if(object.graphic == null)
    {
        // if the graphic was null, then its just an empty parent
        // used to group stuff up
        return;
    }

    if(object instanceof WorldText)
        APP.overlayContainer.removeChild(object.graphic);
    else if(object instanceof Overlay)
        APP.overlayContainer.removeChild(object.graphic);
    else if(object instanceof WorldObject)
        APP.objectContainer.removeChild(object.graphic);
    else if(object instanceof StageObject)
        APP.overlayContainer.removeChild(object.graphic);
    else
        APP.objectContainer.removeChild(object.graphic);
}
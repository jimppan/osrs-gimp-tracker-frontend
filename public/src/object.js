import { TILE_SIZE } from "./world.js";

// any renderable on the stage, wether its UI or a player
export class StageObject
{
    constructor(name)
    {
        this.name = name;                // name of this object
        this.gamePosition = {x:0, y:0};  // position ingame (if it has one)
        this.children = [];              // array of StageObjects
        this.hudObjects = [];            // array of HudObjects
        this.parent = null;              // StageObject parent
        this.keepScale = false;          // should this object keep its scale upon zooming

        this.graphic = null;

        this.interactable = false;       // can we interact with this object as a user
        this.wasHovered = false;         // was cursor on this object
        this.createOverlay = false;      // create overlay on this object upon cursor entering this object
        this.selectable = false;         // can we select this object
        this.position = {}

        this.position = {x:0, y:0};      // position of this object
        this.plane = 0;

       // this.scale = {x:1, y:1}          // scale of this object
    }

    // relative to parent
    // so if parent sits at 3200 3200, and this sits at 3205 3205
    // then this returns 5, 5
    getLocalGamePosition() 
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

    onClick()
    {

    }

    onZoom(x, y)
    {
        if(this.keepScale)
        {
            this.graphic.scale.x = (1 / x);
            this.graphic.scale.y = (this.graphic.scale.y > 0?(1 / y):(-1 / y));
        }
    }

    isVisible()
    {
        return this.graphic != null && this.graphic.visible;
    }

    setVisibility(value)
    {
        for(var i = 0; i < this.children.length; i++)
            this.children[i].setVisibility(value);

        if(this.graphic != null)
            this.graphic.visible = value;
    }

    setAnchor(x, y)
    {
        for(var i = 0; i < this.children.length; i++)
            this.children[i].setAnchor(x, y);

        if(this.graphic != null && this.graphic.anchor != null)
            this.graphic.anchor.set(x, y);
    }

    setAlpha(alpha)
    {
        for(var i = 0; i < this.children.length; i++)
            this.children[i].setAlpha(alpha);

        if(this.graphic != null && this.graphic.alpha != null)
            this.graphic.alpha = alpha;
    }

    getRootParent()
    {
        var parent = this;
        while(parent.parent != null)
            parent = parent.parent;

        return parent;
    }

    setGraphic(graphic)
    {
        this.graphic = graphic;
        this.graphic.position.x = this.position.x;
        this.graphic.position.y = this.position.y;
    }

    setWorldPosition(x, y)
    {
        var diff = this.getWorldPosition()
        diff.x = x - diff.x;
        diff.y = y - diff.y;

        for(var i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];
            var childPos = child.getWorldPosition();
            
            this.children[i].setWorldPosition(childPos.x + diff.x, childPos.y + diff.y);
        }

        this.position.x = x;
        this.position.y = y;

        if(this.graphic == null)
            return;

        this.graphic.position.x = x;
        this.graphic.position.y = y;
    }

    getScreenPosition() 
    {
        return CAMERA.worldToScreenPos(this.position.x, this.position.y);
    }

    getWorldPosition() 
    {
        return {x:this.position.x, y:this.position.y};
    }

    // gets local position relative to parent, where 0, 0 is parents X & Y
    getLocalPosition() 
    {
        if(this.parent == null)
            return this.getWorldPosition();

        var parentPos = this.parent.getWorldPosition();
        return {x:parentPos.x - this.position.x, y:parentPos.y - this.position.y};
    }

    setPlane(planeId)
    {
        for(var i = 0; i < this.children.length; i++)
            this.children[i].setPlane(planeId);

        for(var i = 0; i < this.hudObjects.length; i++)
            this.hudObjects[i].setPlane(planeId);

        if(this instanceof WorldObject && this.plane != planeId)
            WORLD.changePlane(this, planeId);
        
        this.plane = planeId;

        for(var i = 0; i < this.hudObjects.length; i++)
        {
            if(planeId < WORLD.currentPlane) 
            {
                // if the object is under our current plane, dont show anything
                this.hudObjects[i].setVisibility(false);
            }
            else if(planeId == WORLD.currentPlane) 
            {
                // if the object is on same plane, show it all full alpha
                this.hudObjects[i].setAlpha(1.0);
                this.hudObjects[i].setVisibility(true);
            }
            else
            {
                // if the object is above us, show it but with alpha
                this.hudObjects[i].setAlpha(0.5);
                this.hudObjects[i].setVisibility(true);
            }
        }
    }

    setTilePosition(x, y, plane)
    {
        this.setPlane(plane);
        var translation = {x:x*TILE_SIZE, y:y * TILE_SIZE}
        this.setWorldPosition(translation.x, translation.y);
    }

    // gets osrs tile coordinates (inverts Y)
    getTilePosition()
    {
        var pos = this.getWorldPosition();
        return {x:pos.x / TILE_SIZE, y:pos.y / TILE_SIZE}
    }

    // bounds on screen, position and width/height
    getScreenBounds()
    {
        var x = this.graphic.getBounds();
        return {x:x.x, y:(x.y-window.innerHeight)*-1-x.height, width:x.width, height:x.height};
    }

    getWorldBounds()
    {
        var localBounds = this.getScreenBounds();
        var worldBounds = {};
        
        var newPos = CAMERA.screenToWorldPos(localBounds.x, localBounds.y);
        worldBounds.x = newPos.x;
        worldBounds.y = newPos.y;
        worldBounds.width = localBounds.width * (1 / CAMERA.zoom.x);
        worldBounds.height = localBounds.height * (1 / CAMERA.zoom.y);

        return worldBounds;
    }

    setZIndex(val)
    {
        if(this.graphic != null)
            this.graphic.zIndex = val;
    }

    // automatically calculates bounds of an object, including all its children (screen)
    getScreenRect(interactables)
    {
        var bounds = this.getScreenBounds();

        var bl = this.getBottomLeftScreen({x:bounds.x, y:bounds.y}, interactables);
        var tr = this.getTopRightScreen({x:bounds.x + bounds.width, y:bounds.y + bounds.height}, interactables);

        return new PIXI.Rectangle(bl.x, bl.y, tr.x - bl.x, tr.y - bl.y)
    }

    getBottomLeftScreen(checkAgainstBL, interactables)
    {
        var bottomLeft = checkAgainstBL;

        // make easy copy
        var ret = {};
        ret.x = bottomLeft.x;
        ret.y = bottomLeft.y;

        for(var i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];
            // ignore children that are not interactable if param set
            if(!child.interactable && interactables)
                continue;

            if(child.getScreenBounds().x < ret.x)
                ret.x = child.getScreenBounds().x;

            if(child.getScreenBounds().y < ret.y)
                ret.y = child.getScreenBounds().y;

            ret = child.getBottomLeftScreen(ret, interactables);
        }

        // check hudobjects too
        for(var i = 0; i < this.hudObjects.length; i++)
        {
            var hudObject = this.hudObjects[i];
            if(!hudObject.interactable && interactables)
                continue;

            if(!hudObject.isVisible())
                continue;

            var hudPos = hudObject.getScreenBounds();
            if(hudPos.x < ret.x)
                ret.x = hudPos.x;

            if(hudPos.y < ret.y)
                ret.y = hudPos.y;

            ret = hudObject.getBottomLeftScreen(ret, interactables);
        }

        return ret;
    }

    getTopRightScreen(checkAgainstTR, interactables)
    {
        var topRight = checkAgainstTR;

        // make easy copy
        var ret = {};
        ret.x = topRight.x;
        ret.y = topRight.y;

        for(var i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];

            // ignore children that are not interactable if param set
            if(!child.interactable && interactables)
                continue;

            var bounds = child.getScreenBounds();

            var xPos = child.getScreenBounds().x + bounds.width;
            var yPos = child.getScreenBounds().y + bounds.height;
            
            if(xPos > ret.x)
                ret.x = xPos;

            if(yPos > ret.y)
                ret.y = yPos;

            ret = child.getTopRightScreen(ret, interactables);
        }

        // check hudobjects too
        for(var i = 0; i < this.hudObjects.length; i++)
        {
            var hudObject = this.hudObjects[i];
            if(!hudObject.interactable && interactables)
                continue;

            if(!hudObject.isVisible())
                continue;

            var hudBounds = hudObject.getScreenBounds();
            var pos = hudObject.getPosition();

            var xPos = hudBounds.x + hudBounds.width;
            var yPos = hudBounds.y + hudBounds.height;

            if(xPos > ret.x)
                ret.x = xPos;

            if(yPos > ret.y)
                ret.y = yPos;

            ret = hudObject.getTopRightScreen(ret, interactables);
        }

        return ret;
    }

    // automatically calculates bounds of an object, including all its children (world)
    getWorldRect(interactables)
    {
        var bounds = this.getWorldBounds();
        
        var bl = this.getBottomLeftWorld({x:bounds.x, y:bounds.y}, interactables);
        var tr = this.getTopRightWorld({x:bounds.x + bounds.width, y:bounds.y + bounds.height}, interactables);

        return new PIXI.Rectangle(bl.x, bl.y, tr.x - bl.x, tr.y - bl.y)
    }

    getBottomLeftWorld(checkAgainstBL, interactables)
    {
        var bottomLeft = checkAgainstBL;

        // make easy copy
        var ret = {};
        ret.x = bottomLeft.x;
        ret.y = bottomLeft.y;

        for(var i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];
            // ignore children that are not interactable if param set
            if(!child.interactable && interactables)
                continue;

            if(child.getWorldBounds().x < ret.x)
                ret.x = child.getWorldBounds().x;

            if(child.getWorldBounds().y < ret.y)
                ret.y = child.getWorldBounds().y;

            ret = child.getBottomLeftWorld(ret, interactables, screen);
        }

        // check hudobjects too
        for(var i = 0; i < this.hudObjects.length; i++)
        {
            var hudObject = this.hudObjects[i];
            if(!hudObject.interactable && interactables)
                continue;

            if(!hudObject.isVisible())
                continue;

            var worldBounds = hudObject.getWorldBounds();
            if(worldBounds.x < ret.x)
                ret.x = worldBounds.x;

            if(worldBounds.y < ret.y)
                ret.y = worldBounds.y;

            ret = hudObject.getBottomLeftWorld(ret, interactables, screen);
        }

        return ret;
    }

    getTopRightWorld(checkAgainstTR, interactables, screen)
    {
        var topRight = checkAgainstTR;

        // make easy copy
        var ret = {};
        ret.x = topRight.x;
        ret.y = topRight.y;

        for(var i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];

            // ignore children that are not interactable if param set
            if(!child.interactable && interactables)
                continue;

           // var bounds = screen?child.getScreenBounds():child.getWorldBounds();
            var bounds = child.getWorldBounds();

            var xPos = bounds.x + bounds.width;
            var yPos = bounds.y + bounds.height;
            
            if(xPos > ret.x)
                ret.x = xPos;

            if(yPos > ret.y)
                ret.y = yPos;

            ret = child.getTopRightWorld(ret, interactables, screen);
        }

        // check hudobjects too
        for(var i = 0; i < this.hudObjects.length; i++)
        {
            var hudObject = this.hudObjects[i];
            if(!hudObject.interactable && interactables)
                continue;

            if(!hudObject.isVisible())
                continue;

            var bounds = hudObject.getWorldBounds();
            var xPos = bounds.x + bounds.width;
            var yPos = bounds.y + bounds.height;

            if(xPos > ret.x)
                ret.x = xPos;

            if(yPos > ret.y)
                ret.y = yPos;

            ret = hudObject.getTopRightWorld(ret, interactables, screen);
        }

        return ret;
    }

    onAssetsLoaded()
    {

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

        this.offset = {x:0, y:0};
        this.scaleOffset = false;
        this.attachedTo = null;
        this.clampToView = false;
    }

    setPosition(x, y)
    {
        var diff = this.getPosition()
        diff.x = x - diff.x;
        diff.y = y - diff.y;

        for(var i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];
            var childPos = child.getPosition();
            
            this.children[i].setPosition(childPos.x + diff.x, childPos.y + diff.y);
        }

        this.position.x = x;
        this.position.y = y;

        if(this.graphic == null)
            return;

        this.graphic.position.x = x;
        this.graphic.position.y = y;
    }

    getPosition()
    {
        return super.getWorldPosition();
    }

    getWorldPosition() 
    {
        return CAMERA.screenToWorldPos(this.position.x, this.position.y);
    }

    getWorldBounds()
    {
        var localBounds = this.getScreenBounds();
        var worldBounds = {};
        
        var newPos = CAMERA.screenToWorldPos(localBounds.x, localBounds.y);
        worldBounds.x = newPos.x;
        worldBounds.y = newPos.y;
        worldBounds.width = localBounds.width;
        worldBounds.height = localBounds.height;

        return worldBounds;
    }

    getScreenPosition() 
    {
        return this.getPosition();
    }

    getInvertedYPosition()
    {
        var pos = this.getPosition();
        return {x: pos.x, y:(pos.y - window.innerHeight) * -1};
    }

    attachTo(object, scaleOffset, offsetX, offsetY)
    {
        this.attachedTo = object;
        this.scaleOffset = scaleOffset;
        this.offset.x = offsetX;
        this.offset.y = offsetY;

        object.hudObjects.push(this);
    }

    updateAttachment(scaleOffset, offsetX, offsetY)
    {
        this.scaleOffset = scaleOffset;
        this.offset.x = offsetX;
        this.offset.y = offsetY;
    }

    detachFrom(object)
    {
        this.attachedTo = null;

        var index = object.hudObjects.indexOf(object);
        if(index > -1)
            object.hudObjects.splice(index, 1);
    }

    // gets the root of what these hud objects are attached to
    // as we may chain attach things to eachother like texts, to keep them aligned properly
    getAttachedRoot()
    {
        var parent = this;
        while(parent.attachedTo != null)
            parent = parent.attachedTo;

        return parent;
    }
}

export class HudText extends HudObject
{
    constructor(name, text, textStyle, resolution)
    {
        super(name);
        this.setGraphic(new PIXI.Text(text, textStyle));
        this.graphic.scale.y = -1;
        this.graphic.resolution = resolution;
        this.graphic.zIndex = 1;
    }

    setStyle(style)
    {
        this.graphic.style = style;
    }

    setText(text)
    {
        this.graphic.text = text;
    }
}

export class DevObject extends HudObject
{
    constructor(name)
    {
        super(name);
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
        this.graphic.scale.y = -1;
    }
}

export class Overlay extends HudObject
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

    for(var i = 0; i < object.hudObjects.length; i++)
        SpawnObject(object.hudObjects[i]);

    if(object instanceof DevObject)
    {
        DEV_OBJECTS.push(object);
        if(object.graphic == null)
            return;

        APP.devContainer.addChild(object.graphic);
        return;
    }

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
        WORLD.getPlaneContainer(object.plane).add(object);
    else if(object instanceof WorldObject)
        WORLD.getPlaneContainer(object.plane).add(object);
    else if(object instanceof StageObject)
        WORLD.getPlaneContainer(object.plane).add(object);
    else
        WORLD.getPlaneContainer(object.plane).add(object);
}

export function DeleteObject(object)
{
    if(MOUSE_OVER_OBJECT == object)
        INPUT.unhoverObject(object);

    if(SELECTED_OBJECT == object)
        INPUT.deselectObject();

    for(var i = 0; i < object.children.length; i++)
        DeleteObject(object.children[i]);

    for(var i = 0; i < object.hudObjects.length; i++)
        DeleteObject(object.hudObjects[i]);

    if(object instanceof DevObject)
    {
        var index = DEV_OBJECTS.indexOf(object);
        if(index > -1)
            DEV_OBJECTS.splice(index, 1);

        if(object.graphic == null)
            return;

        APP.devContainer.removeChild(object.graphic);
        return;
    }

    if(object instanceof HudObject)
    {
        var index = HUD_OBJECTS.indexOf(object);
        if(index > -1)
            HUD_OBJECTS.splice(index, 1);

        if(object.graphic == null)
            return;

        APP.hudContainer.removeChild(object.graphic);
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
        WORLD.getPlaneContainer(object.plane).remove(object);
    else if(object instanceof WorldObject)
        WORLD.getPlaneContainer(object.plane).remove(object);
    else if(object instanceof StageObject)
        WORLD.getPlaneContainer(object.plane).remove(object);
    else
        WORLD.getPlaneContainer(object.plane).remove(object);
}
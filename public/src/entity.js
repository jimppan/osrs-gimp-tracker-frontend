import { TILE_SIZE } from "./world.js";

export class Entity
{
    constructor(name)
    {
        this.name = "NULL";
        this.gamePosition = {x:0, y:0};
        this.children = [];
        this.parent = null;
        this.keepScale = false;  // should this entity keep its scale upon zooming
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

export class WorldObject extends Entity
{
    constructor(name)
    {
        super(name);
        
        this.graphic = null;
        this.stage = null;
    }

    setGraphic(graphic)
    {
        this.graphic = graphic;
    }

    addToStage()
    {
        this.stage = APP.objectContainer;
        this.stage.addChild(this.graphic);
    }

    removeFromStage()
    {
        if(this.stage != null)
            this.stage.removeChild(this.graphic);
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
        var realY = this.gamePosition.y * TILE_SIZE + TILE_SIZE;

        this.graphic.position.x = Math.round(realX);
        this.graphic.position.y = Math.round(WORLD.invertWorldPosY(realY));
        
        if(this.keepScale)
        {
            this.graphic.scale.x = 1 / CAMERA.zoom.x;
            this.graphic.scale.y = 1 / CAMERA.zoom.y;
        }
    }
}

export class WorldText extends WorldObject
{
    constructor(name, textString, textStyle)
    {
        super(name);
        
        this.setGraphic(new PIXI.Text(textString, textStyle))
        this.graphic.resolution = 64;
        this.graphic.anchor.set(0, 1); // set anchor bottom left to scale properly with entity children and what not
    }

    addToStage()
    {
        this.stage = APP.hudContainer;
        this.stage.addChild(this.graphic);
    }
}
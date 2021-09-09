export class Input
{
    constructor()
    {
        this.mouseIsDown = false;
        this.mouseDownPos = {x:0, y:0};
    }

    init()
    {
        APP.renderer.plugins.interaction.on('pointerdown', (e) => {this.onMouseDown(e)});
        APP.renderer.plugins.interaction.on('pointerup', (e) => {this.onMouseUp(e)});
        APP.renderer.plugins.interaction.on('pointermove', (e) => {this.onMouseMove(e)});

        APP.view.addEventListener('mousewheel', (e) => {this.onMouseWheel(e.deltaY)});
        APP.view.addEventListener('contextmenu', (e) => {
            window.wasRightClick=true;
            e.preventDefault();
          });
    }

    onMouseWheel(deltaY)
    {
        const scaleBy = 1.2;
        const oldScale = CAMERA.zoom.x;
        const mousePointTo = {
        x: CAMERA.getCursorPosition().x / oldScale - CAMERA.position.x / oldScale,
        y: CAMERA.getCursorPosition().y / oldScale - CAMERA.position.y / oldScale
        };

        const newScale = deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        CAMERA.setZoom(newScale, newScale);
        CAMERA.setPosition(-(mousePointTo.x - CAMERA.getCursorPosition().x / newScale) * newScale, -(mousePointTo.y - CAMERA.getCursorPosition().y / newScale) * newScale);
    }

    onMouseDown(e)
    {
        if(e.data.buttons == 1)
        {
            // left click

            this.mouseDownPos = CAMERA.getCursorPosition();
            this.mouseIsDown = true;

            //this.world.clearMap();
            //console.log(this.mouseDownPos);

            //console.log(this.camera.getCursorPosition());
            

            /* if(this.camera.isWorldPositionInView(0, 0))
                console.log("In view");
            else
                console.log("Not in view"); */

            WORLD.updateMap();
        }
        else if(e.data.buttons == 2)
        {
            // right click
            console.log(WORLD.getChunkPositionFromWorldPosition(CAMERA.getCursorWorldPosition().x, CAMERA.getCursorWorldPosition().y));
            WORLD.clearMap();
        }
    }

    onMouseUp(e)
    {
        this.mouseIsDown = false;
    }

    onMouseMove()
    {
        if(this.mouseIsDown)
        {
            var currMouse = CAMERA.getCursorPosition();
                
            var newX = CAMERA.position.x + (currMouse.x - this.mouseDownPos.x);
            var newY = CAMERA.position.y + (currMouse.y - this.mouseDownPos.y);

            CAMERA.setPosition(newX, newY);

            this.mouseDownPos = CAMERA.getCursorPosition();
        }
    }
}
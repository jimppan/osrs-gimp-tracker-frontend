export const RESOURCE_STATUS =
{
    NOT_FOUND: -1,
    NONE: 0,
    DOWNLOADING_URL: 1,
    UPLOADING_GPU: 2,
    READY: 3,
}

export class ResourceManager
{
    constructor(loader)
    {
        this.loader = loader;
        this.resourceStatus = new Map();

        this.resourceQueue = [];
        this.downloading = false;

        this.loader.use(this.onTextureLoaded);

        //this.loader.use(this.onTextureLoaded);
    }

    // loads a texture onto a sprite as soon as its downloaded and uploaded to GPU
    lateLoadTexture(path, sprite)
    {
        var status = this.getResourceStatus(path);
        switch(status)
        {
            case RESOURCE_STATUS.NOT_FOUND:
                
                this.loadTexture(path, (resource) =>
                {
                    this.setResourceStatus(path, RESOURCE_STATUS.UPLOADING_GPU);
                    
                    APP.renderer.plugins.prepare.upload(resource.texture, () =>
                    {
                        this.setResourceStatus(path, RESOURCE_STATUS.READY);
                        sprite.texture = resource.texture;
                    });
                })

                // === USE THIS LOAD FAST BUT LAGGY ===
                /* PIXI.Texture.fromURL(path).then((texture) =>
                {
                    texture.rotate = 8;
                    this.setResourceStatus(path, RESOURCE_STATUS.UPLOADING_GPU);
                    sprite.texture = texture;
                }) */

                break;
            case RESOURCE_STATUS.READY:
                sprite.texture = this.loader.resources[path].texture;

                // == USE THIS LOAD FAST BUT LAGGY ===
                //sprite.texture = PIXI.loader.resources[path].texture;
                break;
            default:
                break;
        }
    }

    setBaseURL(url)
    {
        APP.loader.baseUrl = url;
    }

    add(baseUrl, path, complete)
    {
        this.setResourceStatus(path, RESOURCE_STATUS.DOWNLOADING_URL);
        this.resourceQueue.push({baseUrl:baseUrl, path:path, complete:complete});
    }

    loadTexture(path, complete)
    {
        this.add('', path, complete);
        if(!this.downloading)
            this.load();
    }

    load(onComplete)
    {
        var copy = new Array(this.resourceQueue.length);
        for(var i = 0; i < this.resourceQueue.length; i++)
            copy[i] = {baseUrl:this.resourceQueue[i].baseUrl, path:this.resourceQueue[i].path, complete:this.resourceQueue[i].complete};

        this.resourceQueue = []; // reset current queue

        this.downloading = true;

        for(var i = 0; i < copy.length; i++)
        {
            this.setBaseURL(copy[i].baseUrl);
            this.loader.add(copy[i].path);
        }

        this.loader.load((loader, resources) => 
        {
            this.downloading = false;
            for(let i = 0; i < copy.length; i++)
            {
                if(copy[i].complete != null)
                    copy[i].complete(resources[copy[i].path]);
            }

            // if more items were added to resource queue, go again
            if(this.resourceQueue.length > 0)
                this.load(onComplete);
            else
            {
                if(onComplete != null)
                    onComplete();
            }
        });
    }

    setResourceStatus(path, status)
    {
        this.resourceStatus[path] = status;
    }

    getResourceStatus(path)
    {
        var status = this.resourceStatus[path];
        return status == null?RESOURCE_STATUS.NOT_FOUND:status;
    }

    getTexture(path)
    {
        return this.loader.resources[path].texture;
    }

    // preloading some textures, like UI
    onTextureLoaded(resource, next)
    {
        //e.name = resource name
        //e.error is null if success
        if(resource.error)
        {
            next();
            return;
        }

        resource.texture.rotate = 8;
        next();
    }
}
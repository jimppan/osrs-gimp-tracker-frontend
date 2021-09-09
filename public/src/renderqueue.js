export class RenderQueue
{
    constructor()
    {
        this.queue = new Map();
    }

    add(assetName, chunk)
    {
        this.queue.set(assetName, chunk);
    }

    remove(assetName)
    {
        this.queue.delete(assetName);
    }

    get(assetName)
    {
        return this.queue.get(assetName);
    }
}
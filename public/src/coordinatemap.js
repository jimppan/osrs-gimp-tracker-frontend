const MAX_16BIT_SIGNED = 32767

export class CoordinateMap
{
    constructor()
    {
        this.map = new Map();
    }

    genKey(x, y)
    {
        return ((x + MAX_16BIT_SIGNED) << 16) | (MAX_16BIT_SIGNED + y);
    }

    set(x, y, value)
    {
        this.map.set(this.genKey(x,y), value);
    }

    get(x, y)
    {
        return this.map.get(this.genKey(x,y));
    }

    delete(x, y)
    {
        this.map.delete(this.genKey(x, y));
    }
}
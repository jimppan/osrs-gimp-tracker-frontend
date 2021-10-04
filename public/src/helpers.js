export function numberWithCommas(x) 
{
    // actually chinese
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// example would be multiple of 4
// 0, 4, 8, 12, 16, 20, 24, 28, 32
//
// if number is set to 23, and multiple is set to 4
// it will floor it to 20
export function floorToNearestMultiple(number, multiple)
{
    return Math.floor(number/multiple)*multiple;
}

export function clamp(num, min, max)
{
    return Math.min(Math.max(num, min), max);
}
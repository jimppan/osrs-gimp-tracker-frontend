export function numberWithCommas(x) 
{
    // actually chinese
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
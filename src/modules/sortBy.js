/**
 * Function to sort array by given key
 * @param  array : Array<any> array/list to be sorted
 * @param  key - key by which we sort
 * @param  inverse - inverse sort
 * @todo @param  secondaryKey - secondary key
 * @returns sorted array
 */
export default function sortByKey(array, key, inverse=false, secondaryKey="") {
    return array.sort(function(a, b) {
        let x = a[key];
        let y = b[key];

        if (typeof x == "string")
        {
            x = (""+x).toLowerCase();
        }
        if (typeof y == "string")
        {
            y = (""+y).toLowerCase();
        }
        if (inverse) return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

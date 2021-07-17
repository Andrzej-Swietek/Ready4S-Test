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

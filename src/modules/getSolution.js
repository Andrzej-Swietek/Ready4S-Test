/**
 * 
 * @param F : Array<meal> - Array with meal objects
 * @param W - knapsack Weights of Products
 * @param P - knapsack Products
 * @param i - size of F - 1
 * @param w - max weight
 * @param response : Array<Number> - response referense
 * @returns 
 */
const getSolution = ( F, W, P, i, w, response) => {
    if ( i === 0 ){
        if ( w >= W[0] ) { response.push(0); return; }
        return []
    }
    if ( w >= W[i] && F[i][w] === F[ i-1 ][ w-W[i] ] + P[i] ){
        response.push(i);
        return getSolution( F, W, P, i-1, w-W[i], response )
    }

    return getSolution( F, W, P, i-1, w, response )
}


export default getSolution

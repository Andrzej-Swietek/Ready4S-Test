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

// const getSolution = ( F, W, P, i, w) => {
//     if ( i === 0 ){
//         if ( w >= W[0] ) return [0]
//         return []
//     }
//     if ( w >= W[i] && F[i][w] === F[ i-1 ][ w-W[i] ] + P[i] ){
//         return   ( getSolution( F, W, P, i-1, w-W[i] ) ).push(i)
//     }
//
//     return getSolution( F, W, P, i-1, w )
// }

export default getSolution

/**
 * Knapsack problem     0(n*maxW)
 * @param W - WEIGHTS
 * @param P  - PRODUCTS
 * @param maxW - MAX-WEIGHT
 */
import getSolution from "./getSolution";

const knapsack = ( W, P, maxW ) =>{

    let n = W.length;

    let F =[]
    for (let i = 0; i < n; i++) {
        let tmp =[]
        for (let i = 0; i < maxW+1; i++) {
            tmp.push(0)
        }
        F.push(tmp)
    }

    for ( let i = W[0]; i < maxW+1; i++ ) F[0][i] = P[0];


    for ( let i = 1; i <n ;i++ )
    {
        for ( let w = 1; w < maxW+1 ;w++ )
        {
            F[i][w] = F[i-1][w];
            if (w >= W[i])
                F[i][w] = Math.max(  F[ i ][ w ] ,  F[ i-1 ][ w-W[i] ] + P[i]  )
        }
    }
    const notChosen = [];
    getSolution(F, W, P,n-1, maxW, notChosen);
    const response = []
    for (let i=0; i < n; i++)
        if ( !notChosen.includes(i) ) response.push(i)

    return { value: F[n-1][maxW], arr: response }
}


export default knapsack

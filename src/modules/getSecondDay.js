/**
 * Calculate the meals for day 2
 * @param P - Profit -  Array of weights
 * @param W - Cost - Array of kcal
 * @param Day1 : Array<number> - chosen meals
 * @param Day1weight : number - Total weight of Meals omn Day 1
 * @param kcal : number - Minimal kcal
 * @param names : string - meal names
 * @return Array<meal> - Array of meals
 *
 */
import knapsack from "./knapsack";

const getSecondDay = ( P, W ,Day1 ,Day1weight , kcal, names) => {

    const day1Names = []
    Day1.forEach( (item,i) => {
        if (  day1Names.filter( el => el.name === names[Day1[i]] ).length === 0 ) day1Names.push( { name: names[Day1[i]], amount: 0 } )
        let index = day1Names.findIndex( n => n.name === names[item] )
        day1Names[ index ].amount+=1;
    })

    let scores = [];
    let maxScore = 0;
    let tmp;

    // For each name of product we remove items of this kind so that there is one less than in day 1 eating schedule and check if it gives better result
    day1Names.forEach( name => {

        let changedCounter = 1;
        const newW = [...W];
        const newP = [...P];
        const newNames = [...names];

        let i = 0;

        while ( changedCounter < name.amount ){
            if ( names[i] === name.name ) changedCounter++;
            i++;
        }
        for (let j = newW.length; j >= i; j--){
            if ( names[j] === name.name ) {
                newW.splice(j, 1);
                newP.splice(j,1);
                newNames.splice(j,1);
            }
        }

        const newMaxW = newW.reduce( (acc,i) => acc+i  ) - kcal;
        const res = knapsack(newW,newP, newMaxW);
        if ( res.value > maxScore) { scores = [...res.arr]; maxScore = res.value; tmp = [...newNames] }

    })


    const day2Names = []

    scores.forEach( (item,i) => {
        if (  day2Names.filter( el => el.name === tmp[scores[i]] ).length === 0 ) day2Names.push( { name: tmp[scores[i]], amount: 0 } )
        let index = day2Names.findIndex( n => n.name === tmp[item] )
        day2Names[ index ].amount+=1;
    })

    return { day1: day1Names, day2: day2Names }

}



export default getSecondDay;

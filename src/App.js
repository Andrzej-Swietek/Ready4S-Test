import './styles/App.scss';
import { useState } from "react";

// MODULES
// eslint-disable-next-line
import knapsack from "./modules/knapsack";
import sortByKey from "./modules/sortBy";

// DATA
import meals from './data/dishes.json'
import ingredients from './data/ingredients.json'

// COMPONENTS
import Search from "./components/Search";
import Day from './components/Day'
import Theme from "./components/Theme";

import img from './img.png'


function App() {
  const [foodList, setFoodList] = useState([])

    /**
     *
     * @param numberOfDays: number
     */
  const prepareFoodForUnexpectedJourney = ( numberOfDays ) => {
      if (numberOfDays) {
          try {
              const mealsWeights = [];
              const ratio = []

              meals.forEach(meal => {
                  let sum = meal.ingredients.reduce( (acc, current) => acc + ingredients[current].weight, 0 )
                  mealsWeights.push(sum)
              })

              meals.forEach( (meal, i) =>  ratio.push(meal.kcal/mealsWeights[i]) )
              meals.forEach( (meal,i) => meal["weight"] = mealsWeights[i])
              meals.forEach( (meal,i) => meal["ratio"] = ratio[i])


              // SORTING BY PRIMARY KEY: RATIO AND SECONDARY KEY: WEIGHT
              const r = sortByKey(meals, "ratio", true);
              for ( let i = r.length -1; i > 0; i-- ){
                  let k=0
                  let swap = false
                  while ( r[i-1-k].ratio === r[i].ratio && r[i-1-k].weight > r[i].weight) {
                      swap = true;
                      if (i-1-k === 0) { break; }
                      k++;
                  }

                  if ( swap ){
                      let tmp = r[i-1-k];
                      r[i-1-k] = r[i];
                      r[i] = tmp;
                      i++;
                  }
              }

              // let maxW_Dwarf = (  Math.floor( (2900 - r[r.findIndex( i=> i.name === "Balin's Spiced Beef" )].kcal - 1)/r[0].kcal ) + 1 ) * r[0].kcal;
              let maxW_Dwarf = 2900 - r[r.findIndex( i=> i.name === "Balin's Spiced Beef" )].kcal;
              console.log(maxW_Dwarf)
              const howManyTimesShouldDwarfEatThis = r.map( meal=> Math.floor( ( maxW_Dwarf-1) / meal.kcal  ) +1 );


              const kcal = Array( howManyTimesShouldDwarfEatThis.reduce( (acc,i)=> acc + i ) ).fill(0)
              const weight = Array( howManyTimesShouldDwarfEatThis.reduce( (acc,i)=> acc + i ) ).fill(0)


              let t = 0;
              for ( let i =0; i < kcal.length; i++ ) {
                  kcal[i] = r[t].kcal
                  weight[i] = r[t].weight
                  if ( i === howManyTimesShouldDwarfEatThis[t] -1  && t+1 < r.length) {
                      t++;
                      howManyTimesShouldDwarfEatThis[t] += howManyTimesShouldDwarfEatThis[t-1]
                  }
              }
              console.log(kcal, weight)
              const total = kcal.reduce( (acc,i) => acc+i  )
              let totalCost = weight.reduce( (acc, i)=> acc+i )

              // ===========================< DEBUG >============================
              console.log(r)
              console.log(howManyTimesShouldDwarfEatThis)
              console.log(kcal, weight)
              console.log(total, maxW_Dwarf)
              console.log("totalCost", totalCost)
              // ===========================</ DEBUG >===========================

             const res = knapsack(kcal,weight,total-maxW_Dwarf)
              console.log( "knapsack", res )
              totalCost -= res;
              console.log(totalCost)

              // Setting Values
              let tmp = Array(numberOfDays).fill(0)
              // console.log(tmp)
              setFoodList([...tmp])
              console.log( numberOfDays )

          } catch (e) {
              console.log(e)
          }
      }
    }
  return (
    <div className="App">
        {/*<img src={img} alt="img"/>*/}
        <Search onChange={ prepareFoodForUnexpectedJourney } />
        <div className='days'>
            {   foodList.length > 0 &&
                foodList.map( (day,index) => <Day day={index+1} key={index} food={ '1x Scrambled eggs, 2x Soft-boiled egg, 13x Balin\'s Spliced Beef' } /> )
            }
        </div>
        <Theme />

    </div>
  );
}

export default App;

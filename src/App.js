import './styles/App.scss';
import { useState } from "react";

// MODULES
import knapsack from "./modules/knapsack";
import sortByKey from "./modules/sortBy";

// DATA
import meals from './data/dishes.json'
import ingredients from './data/ingredients.json'

// COMPONENTS
import Search from "./components/Search";
import Day from './components/Day'
import Theme from "./components/Theme";
import Header from "./components/Header";
import getSecondDay from "./modules/getSecondDay";

// import img from './img.png'


function App() {
  const [foodList, setFoodList] = useState([])


    const getFoodSchedule = (maxW, r) => {
        const howManyTimesShouldOneEatThis = r.map( meal=> Math.floor( ( maxW-1) / meal.kcal  ) +1 );

        const kcal = Array( howManyTimesShouldOneEatThis.reduce( (acc,i)=> acc + i ) ).fill(0)
        const weight = Array( howManyTimesShouldOneEatThis.reduce( (acc,i)=> acc + i ) ).fill(0)
        const names = Array( weight.length ).fill('')

        let t = 0;
        for ( let i =0; i < kcal.length; i++ ) {
            kcal[i] = r[t].kcal
            weight[i] = r[t].weight
            names[i] = r[t].name
            if ( i === howManyTimesShouldOneEatThis[t] -1  && t+1 < r.length) {
                t++;
                howManyTimesShouldOneEatThis[t] += howManyTimesShouldOneEatThis[t-1]
            }
        }

        const total = kcal.reduce( (acc,i) => acc+i  )
        let totalCost = weight.reduce( (acc, i)=> acc+i )

        const res = knapsack(kcal, weight,total-maxW)
        totalCost -= res.value;

        let complete_food_schedule = getSecondDay( weight, kcal , res.arr, res.value, maxW, names )
        // console.log(complete_food_schedule)

        return complete_food_schedule;
    }


    /**
     *
     * @param numberOfDays: number
     */
  const prepareFoodForUnexpectedJourney = ( numberOfDays ) => {
      if (numberOfDays) {
          try {
              const mealsWeights = meals.map( meal => meal.ingredients.reduce( (acc, current) => acc + ingredients[current].weight, 0 ) )
              const ratio = meals.map( (meal,i) => meal.kcal/mealsWeights[i] )

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

              // BASED ON GIVEN CONSTANTS
              let maxW_Dwarf = 2900 - r[r.findIndex( i=> i.name === "Balin's Spiced Beef" )].kcal;
              let maxW_Hobbit = 2700 - r[r.findIndex( i=> i.name === "Soft-boiled egg" )].kcal - r[r.findIndex( i=> i.name === "Mrs. Cotton's Berry Pie" )].kcal;
              let maxW_Wizard = 3100 - r[r.findIndex( i=> i.name === "Scrambled eggs" )].kcal;
              console.log(`%c || maxW_Dwarf: ${ maxW_Dwarf } | maxW_Hobbit: ${ maxW_Hobbit } | maxW_Wizard ${ maxW_Wizard } ||`, 'color: purple')

              const dwarfCompleteFoodList = getFoodSchedule(maxW_Dwarf, r)
              const hobbitCompleteFoodList = getFoodSchedule(maxW_Hobbit, r)
              const wizardCompleteFoodList = getFoodSchedule(maxW_Wizard, r)

              console.log( dwarfCompleteFoodList )
              console.log( hobbitCompleteFoodList )
              console.log( wizardCompleteFoodList )

              // Setting Values
              let tmp = Array(numberOfDays).fill(0)
              setFoodList([...tmp])

          } catch (e) {
              console.log(e)
          }
      }
    }
  return (
    <div className="App">
        {/*<img src={img} alt="img"/>*/}
        <Header />
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

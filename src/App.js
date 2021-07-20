import './styles/App.scss';
import { useState } from "react";

// MODULES
import knapsack from "./modules/knapsack";
import sortByKey from "./modules/sortBy";
import getSecondDay from "./modules/getSecondDay";

// DATA
import meals from './data/dishes.json'
import ingredients from './data/ingredients.json'

// COMPONENTS
import Search from "./components/Search";
import Day from './components/Day'
import Theme from "./components/Theme";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [foodList, setFoodList] = useState([])

    const getFoodSchedule = (maxW, r) => {
        const howManyTimesShouldOneEatThis = r.map( meal=> Math.floor( ( maxW-1) / meal.kcal  ) +1 );

        const kcal = Array( howManyTimesShouldOneEatThis.reduce( (acc,i)=> acc + i ) ).fill(0);
        const weight = Array( howManyTimesShouldOneEatThis.reduce( (acc,i)=> acc + i ) ).fill(0);
        const names = Array( weight.length ).fill('');

        let t = 0;
        for ( let i =0; i < kcal.length; i++ ) {
            kcal[i] = r[t].kcal;
            weight[i] = r[t].weight;
            names[i] = r[t].name;
            if ( i === howManyTimesShouldOneEatThis[t] -1  && t+1 < r.length) {
                t++;
                howManyTimesShouldOneEatThis[t] += howManyTimesShouldOneEatThis[t-1];
            }
        }

        const total = kcal.reduce( (acc,i) => acc+i  ); // minimalna ilosc danego dania aby zaspokoić cały głód
        let totalCost = weight.reduce( (acc, i)=> acc+i );

        const res = knapsack(kcal, weight,total-maxW);
        totalCost -= res.value;

        let complete_food_schedule = getSecondDay( weight, kcal , res.arr, res.value, maxW, names );

        return complete_food_schedule;
    }
    const includesMeal = (arr, meal) => arr.filter( a=> a.name === meal.name ).length > 0
    const pushIfNotIncludesAndTrackAmount = (arrs, item) =>{
        if (! includesMeal( arrs.day1,{name: item, amount: 0} ))
            arrs.day1.push( {name: item, amount: 0} );

        if (! includesMeal( arrs.day2,{name: item, amount: 0} ))
            arrs.day2.push( {name: item, amount: 0} );

        arrs.day1[ arrs.day1.findIndex( i => i.name === item ) ].amount += 1
        arrs.day2[ arrs.day2.findIndex( i => i.name === item ) ].amount += 1
    }
    const mergeFoodLists = (what, toWhat) => {
        for (let i = 0; i < what.length ; i++) {
            let item = what[i];
            if ( toWhat.filter( i => i.name === item.name).length === 0 ) { toWhat.push({name: item.name, amount: 0}); }
            toWhat[ toWhat.findIndex( n => n.name === item.name ) ].amount += item.amount ;
        }
    }
    /**
     * Sets state to list of days in which each day has a list of dishes for a givens day.
     * @param numberOfDays: number
     */
  const prepareFoodForUnexpectedJourney = ( numberOfDays ) => {
      if (numberOfDays) {
          try {
              const mealsWeights = meals.map( meal => meal.ingredients.reduce( (acc, current) => acc + ingredients[current].weight, 0 ) );
              const ratio = meals.map( (meal,i) => meal.kcal/mealsWeights[i] );

              meals.forEach( (meal,i) => meal["weight"] = mealsWeights[i]);
              meals.forEach( (meal,i) => meal["ratio"] = ratio[i]);

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
              // console.log(`%c || maxW_Dwarf: ${ maxW_Dwarf } | maxW_Hobbit: ${ maxW_Hobbit } | maxW_Wizard ${ maxW_Wizard } ||`, 'color: purple')

              const dwarfCompleteFoodList = getFoodSchedule(maxW_Dwarf, r);
              const hobbitCompleteFoodList = getFoodSchedule(maxW_Hobbit, r);
              const wizardCompleteFoodList = getFoodSchedule(maxW_Wizard, r);


              pushIfNotIncludesAndTrackAmount( dwarfCompleteFoodList, "Balin's Spiced Beef" );
              pushIfNotIncludesAndTrackAmount( wizardCompleteFoodList, "Scrambled eggs" );
              pushIfNotIncludesAndTrackAmount( hobbitCompleteFoodList, "Soft-boiled egg" );
              pushIfNotIncludesAndTrackAmount( hobbitCompleteFoodList, "Mrs. Cotton's Berry Pie" );


              // 13 Dwarves
              for (let i = 0; i < dwarfCompleteFoodList.day1.length ; i++) { dwarfCompleteFoodList.day1[i].amount *= 13; }
              for (let i = 0; i < dwarfCompleteFoodList.day2.length ; i++) { dwarfCompleteFoodList.day2[i].amount *= 13; }

              const mergedDay1 = []
              const mergedDay2 = []

              mergeFoodLists(dwarfCompleteFoodList.day1, mergedDay1);
              mergeFoodLists(hobbitCompleteFoodList.day1, mergedDay1);
              mergeFoodLists(wizardCompleteFoodList.day1, mergedDay1);

              mergeFoodLists(dwarfCompleteFoodList.day2, mergedDay2);
              mergeFoodLists(hobbitCompleteFoodList.day2, mergedDay2);
              mergeFoodLists(wizardCompleteFoodList.day2, mergedDay2);

              const totalListOfFood = [];
              for (let i = 0; i < numberOfDays; i++) {
                  totalListOfFood.push( (i%2 === 0)? mergedDay1:mergedDay2 )
              }

              // Setting Values
              setFoodList([...totalListOfFood])

          } catch (e) {
              console.log(e)
              setFoodList([])
          }
      }
    }
  return (
    <div className="App">
        <Header />
        <Search onChange={ prepareFoodForUnexpectedJourney } />
        <div className='days'>
            {   foodList.length > 0 &&
                foodList.map( (day,index) => <Day day={index+1} key={index} food={ day } /> )
            }
        </div>
        <Theme />
        <Footer />
    </div>
  );
}

export default App;

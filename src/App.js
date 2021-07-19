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

        const total = kcal.reduce( (acc,i) => acc+i  );
        let totalCost = weight.reduce( (acc, i)=> acc+i );

        const res = knapsack(kcal, weight,total-maxW);
        totalCost -= res.value;

        let complete_food_schedule = getSecondDay( weight, kcal , res.arr, res.value, maxW, names );

        return complete_food_schedule;
    }
    const includesMeal = (arr, meal) => arr.filter( a=> a.name === meal.name ).length > 0


    /**
     *
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
              console.log(`%c || maxW_Dwarf: ${ maxW_Dwarf } | maxW_Hobbit: ${ maxW_Hobbit } | maxW_Wizard ${ maxW_Wizard } ||`, 'color: purple')

              const dwarfCompleteFoodList = getFoodSchedule(maxW_Dwarf, r);
              const hobbitCompleteFoodList = getFoodSchedule(maxW_Hobbit, r);
              const wizardCompleteFoodList = getFoodSchedule(maxW_Wizard, r);


              if (! includesMeal( dwarfCompleteFoodList.day1,{name: "Balin's Spiced Beef", amount: 0} ))
                  dwarfCompleteFoodList.day1.push( {name: "Balin's Spiced Beef", amount: 0} );
              if (! includesMeal( dwarfCompleteFoodList.day2,{name: "Balin's Spiced Beef", amount: 0} ))
                  dwarfCompleteFoodList.day2.push( {name: "Balin's Spiced Beef", amount: 0} );

              if (! includesMeal( wizardCompleteFoodList.day1,{name: "Scrambled eggs", amount: 0} ))
                  wizardCompleteFoodList.day1.push( {name: "Scrambled eggs", amount: 0} );
              if (! includesMeal( wizardCompleteFoodList.day2,{name: "Scrambled eggs", amount: 0} ))
                  wizardCompleteFoodList.day2.push( {name: "Scrambled eggs", amount: 0} );

              if (! includesMeal( hobbitCompleteFoodList.day1,{name: "Soft-boiled egg", amount: 0} ))
                  hobbitCompleteFoodList.day1.push( {name: "Soft-boiled egg", amount: 0} );
              if (! includesMeal( hobbitCompleteFoodList.day2,{name: "Soft-boiled egg", amount: 0} ))
                  hobbitCompleteFoodList.day2.push( {name: "Soft-boiled egg", amount: 0} );

              if (! includesMeal( hobbitCompleteFoodList.day1,{name: "Mrs. Cotton's Berry Pie", amount: 0} ))
                  hobbitCompleteFoodList.day1.push( {name: "Mrs. Cotton's Berry Pie", amount: 0} );
              if (! includesMeal( hobbitCompleteFoodList.day2,{name:"Mrs. Cotton's Berry Pie" , amount: 0} ))
                  hobbitCompleteFoodList.day2.push( {name: "Mrs. Cotton's Berry Pie", amount: 0} );

              dwarfCompleteFoodList.day1[ dwarfCompleteFoodList.day1.findIndex( i => i.name === "Balin's Spiced Beef" ) ].amount += 1
              dwarfCompleteFoodList.day2[ dwarfCompleteFoodList.day2.findIndex( i => i.name === "Balin's Spiced Beef" ) ].amount += 1

              wizardCompleteFoodList.day1[ wizardCompleteFoodList.day1.findIndex( i => i.name === "Scrambled eggs" ) ].amount += 1
              wizardCompleteFoodList.day2[ wizardCompleteFoodList.day2.findIndex( i => i.name === "Scrambled eggs" ) ].amount += 1

              hobbitCompleteFoodList.day1[ hobbitCompleteFoodList.day1.findIndex( i => i.name === "Soft-boiled egg" ) ].amount += 1
              hobbitCompleteFoodList.day2[ hobbitCompleteFoodList.day2.findIndex( i => i.name === "Soft-boiled egg" ) ].amount += 1
              hobbitCompleteFoodList.day1[ hobbitCompleteFoodList.day1.findIndex( i => i.name === "Mrs. Cotton's Berry Pie" ) ].amount += 1
              hobbitCompleteFoodList.day2[ hobbitCompleteFoodList.day2.findIndex( i => i.name === "Mrs. Cotton's Berry Pie" ) ].amount += 1

              // 13 Dwarves
              for (let i = 0; i < dwarfCompleteFoodList.day1.length ; i++) { dwarfCompleteFoodList.day1[i].amount *= 13; }
              for (let i = 0; i < dwarfCompleteFoodList.day2.length ; i++) { dwarfCompleteFoodList.day2[i].amount *= 13; }

              const mergedDay1 = []
              const mergedDay2 = []

              for (let i = 0; i < dwarfCompleteFoodList.day1.length ; i++) {
                  let item = dwarfCompleteFoodList.day1[i];                  console.log("d1", item);
                  if ( mergedDay1.filter( i => i.name === item.name).length === 0 ) { mergedDay1.push({name: item.name, amount: 0}); }
                  mergedDay1[ mergedDay1.findIndex( n => n.name === item.name ) ].amount += item.amount ;
              }
              for (let i = 0; i < hobbitCompleteFoodList.day1.length ; i++) {
                  let item = hobbitCompleteFoodList.day1[i];
                  if ( mergedDay1.filter( i => i.name === item.name).length === 0 ) { mergedDay1.push({name: item.name, amount: 0}); }
                  mergedDay1[ mergedDay1.findIndex( n => n.name === item.name ) ].amount += item.amount ;
              }
              for (let i = 0; i < wizardCompleteFoodList.day1.length ; i++) {
                  let item = wizardCompleteFoodList.day1[i];
                  if ( mergedDay1.filter( i => i.name === item.name).length === 0 ) { mergedDay1.push({name: item.name, amount: 0}); }
                  mergedDay1[ mergedDay1.findIndex( n => n.name === item.name ) ].amount += item.amount ;
              }


              for (let i = 0; i < dwarfCompleteFoodList.day2.length ; i++) {
                  let item = dwarfCompleteFoodList.day2[i];
                  console.log("d2", item)
                  if ( mergedDay2.filter( i => i.name === item.name).length === 0 ) { mergedDay2.push({name: item.name, amount: 0}); }
                  mergedDay2[ mergedDay2.findIndex( n => n.name === item.name ) ].amount += item.amount ;
              }
              for (let i = 0; i < hobbitCompleteFoodList.day2.length ; i++) {
                  let item = hobbitCompleteFoodList.day2[i];
                  if ( mergedDay2.filter( i => i.name === item.name).length === 0 ) { mergedDay2.push({name: item.name, amount: 0}); }
                  mergedDay2[ mergedDay2.findIndex( n => n.name === item.name ) ].amount += item.amount ;
              }
              for (let i = 0; i < wizardCompleteFoodList.day2.length ; i++) {
                  let item = wizardCompleteFoodList.day2[i];
                  if ( mergedDay2.filter( i => i.name === item.name).length === 0 ) { mergedDay2.push({name: item.name, amount: 0}); }
                  mergedDay2[ mergedDay2.findIndex( n => n.name === item.name ) ].amount += item.amount ;
              }


              const totalListOfFood = [];
              for (let i = 0; i < numberOfDays; i++) {
                  totalListOfFood.push( (i%2 === 0)? mergedDay1:mergedDay2 )
              }
              console.log(totalListOfFood)

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
        {/*<img src={img} alt="img"/>*/}
        <Header />
        <Search onChange={ prepareFoodForUnexpectedJourney } />
        <div className='days'>
            {   foodList.length > 0 &&
                foodList.map( (day,index) => <Day day={index+1} key={index} food={ day } /> )
            }
        </div>
        <Theme />

    </div>
  );
}

export default App;

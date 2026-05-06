import React, { useEffect, useState } from "react";
import recipeLogo from './assets/recipeLogo.png'
import './App.css'

function App() {
  const [meals, setMeals] = useState([]);
  const [allMeals, setAllMeals]=useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [foodType, setFoodType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [status,setStatus]=useState('idle')
  const [selectedMeal, setSelectedMeal] = useState(null);
  const itemsPerPage = 9;

  function mealsFilter() {
    let filteredMeals=allMeals.filter(meal=>meal.strMeal.toLowerCase().includes(debouncedSearch.toLowerCase()));
    if(foodType==='Vegetarian'){
      filteredMeals=filteredMeals.filter(meal=>meal.strCategory==="Vegetarian");
    }else if(foodType==='NonVeg'){
      filteredMeals = filteredMeals.filter(meal => meal.strCategory !== "Vegetarian");
    }
    setMeals(filteredMeals);
  }

  


  async function loadMeals(){
    const url = 'https://api.freeapi.app/api/v1/public/meals?page=1&limit=300';
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    try {
      setStatus('loading');
      const response = await fetch(url,options);
      const data = await response.json();
        
      if(data?.data?.data){
        setAllMeals(data.data.data);
        setMeals(data.data.data);
        setStatus('success');
        
      }else{
        setStatus('error')
      }

    } catch (error) {
      setStatus('error');
    }
  }
  useEffect(() => {
    loadMeals();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    mealsFilter()
  }, [debouncedSearch, foodType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return ()=>clearTimeout(timer);
  }, [search]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const totalPages=Math.ceil(meals.length/itemsPerPage);
  const startIndex=(currentPage-1)*itemsPerPage;
  const currentMeals=meals.slice(startIndex,startIndex+itemsPerPage);
 

  

  
  

  return (
    <div>
      <div className="hero">
        <img src={recipeLogo}/>
        <p>Recipe Room</p>
      </div>
      
      <input className="searchBar" type="text" placeholder="Search meals..." value={search} onChange={(e)=>setSearch(e.target.value)}
      />

      <div className="radioBtn">
        <label>
          <input
            type="radio"
            name="foodType"
            value="All"
            checked={foodType === "All"}
            onChange={(e)=>setFoodType(e.target.value)}
          />All
        </label>

        <label>
          <input
            type="radio"
            name="foodType"
            value="Vegetarian"
            checked={foodType==="Vegetarian"}
            onChange={(e)=>setFoodType(e.target.value)}
          />Vegetarian
        </label>

        <label>
          <input
            type="radio"
            name="foodType"
            value="NonVeg"
            checked={foodType === "NonVeg"}
            onChange={(e)=>setFoodType(e.target.value)}
          />Non Veg
        </label>
      </div>

      <div className="cards-holder">
        {currentMeals.map((meal)=>(
          <div key={meal.idMeal} onClick={() => setSelectedMeal(meal)} className="singleCard">
            <img className="cardImg" src={meal.strMealThumb} alt={meal.strMeal}/>
            <div className="cardNameCategory">  
              <h3 className="cardName">{meal.strMeal}</h3>
              <p className="cardCategory">{meal.strCategory}</p>
            </div>
            <p className="cardCuisine"><strong>Cuisine: </strong>{meal.strArea}</p>
            <p className="cardIngredients"><strong>Ingredients: </strong></p>
            <div className="Ingredients">
              {[...Array(20)].map((_,i)=>{
                const ingredient = meal[`strIngredient${i + 1}`];
                return ingredient?(<p key={i}>{ingredient}</p>):null;  
              })}
            </div>
          </div>
        ))}
      </div>
            
      <div className="pages">
        <button onClick={()=>setCurrentPage(p=>p-1)} disabled={currentPage===1}>Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={()=>setCurrentPage(p=>p+1)} disabled={currentPage===totalPages}>Next</button>
      </div>

      {selectedMeal && (<div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button onClick={()=>setSelectedMeal(null)}>X</button>
          <h2 className="selectedMealName">{selectedMeal.strMeal}</h2>
          <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} className="selectedMealImg"/>
          <p className="selectedMealCategory"><strong>Category: </strong>{selectedMeal.strCategory}</p>
          <p className="selectedMealCuisine"><strong>Cuisine: </strong>{selectedMeal.strArea}</p>
          <p className="selectedMealIngredients"><strong>Ingredients: </strong></p>
          <div>
            {[...Array(20)].map((_,i)=>{
                const ingredient = selectedMeal[`strIngredient${i + 1}`];
                const measure = selectedMeal[`strMeasure${i + 1}`];
                return ingredient?(<p key={i} className="selectedMealEachIngredient"><strong>{ingredient}</strong>: {measure}</p>):null;  
              })}
          </div>
          
          <p className="selectedMealInstructions"><strong>Instructions: </strong> {selectedMeal.strInstructions}</p>
          <div className="selectedMealsBtn">
            <a href={selectedMeal.strSource} target="_blank">Read More</a>
            <a href={selectedMeal.strYoutube} target="_blank">Watch Now</a>
          </div>
          
        </div>
      </div>)}

    </div>

  );
}

export default App;
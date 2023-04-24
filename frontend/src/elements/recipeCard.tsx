import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import { Recipe } from "../../../backend/src/data/recipes/entity";

function RecipeCard({ recipes }: { recipes: Recipe[] }) {
  // const [lastDirection, setLastDirection] = useState();

  const swiped = (direction: any, nameToDelete: string) => {
    console.log("Swiped " + nameToDelete + " " + direction);
    // setLastDirection(direction);
  };

  const outOfFrame = (name: string) => {
    console.log(name + " left the screen!");
  };

  return (
    <div >
      <div className="cardContainer mx-5">
        {recipes.map((character) => (
          <TinderCard
            className="swipe"
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name)}
            onCardLeftScreen={() => outOfFrame(character.name)}
          >
            <div
              /*style={{ backgroundImage: 'url(' + character.url + ')' }}*/ className="card absolute z-50 rounded-xl w-full h-[32rem] bg-gray-400 shadow-md flex flex-col items-center"
            >
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
}

export default RecipeCard;

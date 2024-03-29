import React, { useState, useEffect } from 'react';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  id: string;
}
interface Props {
  show;
}

const SetInstructions: React.FC<Props> = props => {
  const [ingredients, setIngredients] = useState<Array<Ingredient>>([]);

  useEffect(() => {
    const fetchedings = localStorage.getItem('ingredients');
    const fetchedInstructions = localStorage.getItem('recipeInstructions');
    const instructions = document.getElementById(
      'jee123'
    ) as HTMLTextAreaElement;

    if (fetchedings) {
      setIngredients(JSON.parse(fetchedings));
    }
    if (instructions && fetchedInstructions) {
      instructions.value = fetchedInstructions;
    }
  }, [props]);
  if (!props.show) {
    return null;
  }
  const saveInstructions = (e) => {
    localStorage.setItem('recipeInstructions', e.target.value)
  };

  return (
    <div>
      <h2>Instructions</h2>
      {ingredients.map(i => (
        <li key={i.id}>
          {i.name} {i.amount} {i.unit}
        </li>
      ))}
      <br></br>
      <textarea id="jee123" className="instructionfield" onChange={saveInstructions}></textarea>
    </div>
  );
};
export default SetInstructions;

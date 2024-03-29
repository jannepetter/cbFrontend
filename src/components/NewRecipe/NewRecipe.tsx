import React, { useState } from 'react';
import SetRecipeName from './SetRecipeName';
import SetIngredients from './SetIngredients';
import SetImage from './SetImage';
import SetInstructions from './SetInstructions';
import '../../css/NewRecipe.css';

interface Props {
  me;
  createRecipe;
}

const NewRecipe: React.FC<Props> = props => {
  const [phase, setPhase] = useState(0);
  const createRecipe = props.createRecipe
  const me = props.me
  const stepUp = () => {
    if (phase < 3) {
      setPhase(phase + 1);
    }
  };
  const stepBack = () => {
    if (phase > 0) {
      setPhase(phase - 1);
    }
  };

  return (
    <div>
      <button onClick={stepBack}>back</button>
      <button onClick={stepUp}>next</button>
      <SetRecipeName show={phase === 0}></SetRecipeName>
      <SetIngredients show={phase === 1}></SetIngredients>
      <SetInstructions show={phase === 2}></SetInstructions>
      <SetImage show={phase === 3} me={me} createRecipe={createRecipe}></SetImage>

    </div>
  );
};
export default NewRecipe;

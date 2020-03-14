import React, { useState, useEffect } from 'react';
import shortid from 'shortid';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  id: string;
}
interface Props {
  show;
}
const SetIngredients: React.FC<Props> = props => {
  const [ingredients, setIngredients] = useState<Array<Ingredient>>([]);
  const [ingredientName, setIngredientName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');
  const [errmessage, setErrmessage] = useState('');

  useEffect(() => {
    const ingsbeginning = localStorage.getItem('ingredients');
    /*    const name = localStorage.getItem('recipename')
        const storageStage = localStorage.getItem('stage')
        if (storageStage === 'false') {
            setStage(false)
        } */
    if (ingsbeginning) {
      setIngredients(JSON.parse(ingsbeginning));
    }
    /*  if (name) {
            setRecipeName(JSON.parse(name))
        } */
  }, []);

  if (!props.show) {
    return null;
  }
  const handleAmountChange = event => {
    setAmount(event.target.value);
  };

  const handleIngredientNameChange = event => {
    setIngredientName(event.target.value);
  };
  const handleremove = id => {
    const filteredIngList = ingredients.filter(i => i.id !== id);
    localStorage.setItem('ingredients', JSON.stringify(filteredIngList));
    setIngredients(filteredIngList);
  };
  const handleIngredientsubmit = async event => {
    event.preventDefault();
    try {
      let amountOfIngredient = parseFloat(amount);
      if (isNaN(amountOfIngredient)) {
        throw new Error('amount must be a number, like 4 or 5.2');
      }

      const createId = shortid.generate();
      const newIngredient = {
        name: ingredientName,
        amount: Math.round(amountOfIngredient * 100) / 100,
        unit: unit,
        id: createId
      };
      localStorage.setItem(
        'ingredients',
        JSON.stringify(ingredients.concat(newIngredient))
      );
      setIngredients(ingredients.concat(newIngredient));
      setIngredientName('');
      setAmount('');
      let hidingRadiobutton = document.getElementById(
        'Radio5'
      ) as HTMLInputElement;
      if (hidingRadiobutton) {
        hidingRadiobutton.checked = true;
      }
      /* setUnit('') */
    } catch (error) {
      setErrmessage(error.message);
      setTimeout(() => {
        setErrmessage('');
      }, 3000);
    }
  };
  return (
    <div>
      <p className="errmessage">{errmessage}</p>
      <input
        id="inginput"
        placeholder="ingridient name"
        value={ingredientName}
        onChange={handleIngredientNameChange}
      ></input>
      <div>
        <input
          id="amountinput"
          placeholder="amount"
          value={amount}
          onChange={handleAmountChange}
          style={{ width: '60px' }}
        ></input>
        <span>
          <input
            onChange={event => setUnit(event.target.value)}
            id="Radio1"
            name="Radios"
            type="radio"
            value="g"
          />
          <label htmlFor="Radio1"> g </label>
        </span>
        <span>
          <input
            onChange={event => setUnit(event.target.value)}
            id="Radio2"
            name="Radios"
            type="radio"
            value="dl"
          />
          <label htmlFor="Radio2">dl</label>
        </span>
        <span>
          <input
            onChange={event => setUnit(event.target.value)}
            id="Radio3"
            name="Radios"
            type="radio"
            value="tbs"
          />
          <label htmlFor="Radio3">tbs</label>
        </span>
        <span>
          <input
            onChange={event => setUnit(event.target.value)}
            id="Radio4"
            name="Radios"
            type="radio"
            value="jee"
          />
          <label htmlFor="Radio4">jee</label>
        </span>
        <span style={{ display: 'none' }}>
          <input
            onChange={event => setUnit(event.target.value)}
            id="Radio5"
            name="Radios"
            type="radio"
            value=""
          />
          <label htmlFor="Radio5">juu</label>
        </span>
      </div>
      <button onClick={handleIngredientsubmit}>add to Ingriedients</button>
      <br></br>
      {ingredients.map(i => (
        <li key={i.id}>
          {i.name} {i.amount} {i.unit}
          <button onClick={() => handleremove(i.id)}>remove</button>
        </li>
      ))}
    </div>
  );
};
export default SetIngredients;

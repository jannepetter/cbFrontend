import React, { useState } from 'react';
import axios from 'axios';
import { useApolloClient } from '@apollo/react-hooks';
import { ME } from '../../graphql/queries/me';
import { Redirect } from 'react-router-dom';
interface Props {
  show;
  me
  createRecipe
}

const SetImage: React.FC<Props> = props => {
  const client = useApolloClient();
  const [file, setFile] = useState<any>('');
  const [imgpreview, setImagepreview] = useState<any>();
  const recipename = localStorage.getItem('recipename') || ''
  const ingredientsString = localStorage.getItem('ingredients')
  const instructions = localStorage.getItem('recipeInstructions') || ''
  const description = localStorage.getItem('recipedescription') || ''
  const tagString = localStorage.getItem('recipeTags') || ''
  const [submitted, setSubmitted] = useState<boolean>(false)
  if (submitted) {
    return <Redirect to="/myRecipes" />
  }

  if (!props.show) {
    return null;
  }
  const ingredients = ingredientsString ? JSON.parse(ingredientsString) : []
  let tagArr = tagString ? tagString.replace(/[,.!?:;-]/g, '').split(' ').slice(0, 5) : []
  tagArr = tagArr.concat(recipename.split(' '))
  /* let tags = tagString ? tagString : ''
  tags = tags + ' ' + recipename */
  /* const tagArr = tags ? tags.replace(/[,.!?:;-]/g, '').split(' ') : [] */
  console.log(tagArr, 'taggiitttt jee')


  const fileSelectedHandler = async event => {
    event.preventDefault();
    const fileSize = event.target.files[0].size;

    if (fileSize > 10512530) {
      const form = document.getElementById('fileInput') as HTMLInputElement;
      form.value = '';
      setFile('');
      setImagepreview('');
      alert('too big');
    } else {
      setImagepreview(URL.createObjectURL(event.target.files[0]));
      setFile(event.target.files[0]);
      console.log(fileSize, 'image size');
    }
  };
  const revokeObjectUrl = () => {
    setImagepreview(URL.revokeObjectURL(imgpreview));
    setFile('');
  };
  const imageInstructions = 'max 10MB, jpg/jpeg/png';


  const handleSubmit = async (event) => {
    event.preventDefault()
    const submitbutton = document.getElementById(
      'submitRecipe'
    ) as HTMLButtonElement;
    submitbutton.disabled = true;
    const preset = process.env.REACT_APP_UPLOAD_PRESET
      ? process.env.REACT_APP_UPLOAD_PRESET
      : '';
    const cloudurl = process.env.REACT_APP_CLOUDURL
      ? process.env.REACT_APP_CLOUDURL
      : '';
    await props.me.refetch();
    const currentUser = client.readQuery({ query: ME });
    if (currentUser.me !== null) {
      try {
        console.log('hiphei')
        let imageUrl = '';
        if (file) {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('upload_preset', preset);
          const response = await axios.post(`${cloudurl}/upload`, fd);
          imageUrl = response.data.public_id;
        }
        const shortings = ingredients.map(i => i.name)  //tilapäinen, bäkki ei kelpuuta kokonaan
        await props.createRecipe({
          variables: {
            title: recipename,
            description,
            imageUrl,
            ingredients: shortings,
            instructions,
            tags: tagArr
          }
        });
        localStorage.removeItem('recipename')
        localStorage.removeItem('ingredients')
        localStorage.removeItem('recipeInstructions')
        localStorage.removeItem('recipedescription')
        localStorage.removeItem('recipeTags')

        submitbutton.disabled = false;
        setSubmitted(true)
      } catch (error) {
        submitbutton.disabled = false;
        console.log(error.message, 'create resipessä tapahtuupi');
      }
    }
  }

  return (
    <div>
      <h2>Add photo and submit</h2>
      <h3>{recipename}</h3>
      {file === '' ? (
        <input
          id="fileInput"
          type="file"
          accept="image/jpg,image/jpeg,image/png"
          onChange={fileSelectedHandler}
        ></input>
      ) : null}
      {file !== '' ? (
        <button onClick={revokeObjectUrl}>change image</button>
      ) : null}
      <br></br>
      <img
        className="cardImgContent"
        src={imgpreview}
        alt={imageInstructions}
      ></img>
      <br></br>
      {ingredients && ingredients.map(i => (
        <li key={i.id}>{i.name} {i.amount} {i.unit}</li>
      ))}
      <textarea className="instructionfield" readOnly={true} value={instructions}></textarea>
      <br></br>
      <button id='submitRecipe' onClick={handleSubmit}>submit</button>
    </div>
  );
};
export default SetImage;

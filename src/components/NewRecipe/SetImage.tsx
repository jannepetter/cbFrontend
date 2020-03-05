import React, { useState } from 'react';

interface Props {
  show;
}

const SetImage: React.FC<Props> = props => {
  const [file, setFile] = useState<any>('');
  const [imgpreview, setImagepreview] = useState<any>();
  if (!props.show) {
    return null;
  }

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

  return (
    <div>
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
    </div>
  );
};
export default SetImage;

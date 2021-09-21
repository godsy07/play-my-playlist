import React from "react";

const Textarea = ({ title }) => {
  return (
    <div className='input-div'>
      <h3 className='title'>{title}</h3>
      <textarea name="textarea" id="ta" cols="30" rows="8"></textarea>
      {/* <textarea name='textarea'></textarea> */}
    </div>
  );
};

export default Textarea;


import React from 'react';
import './App.css';

const StringsUnique = (props) => {
    const { divVisible } = props;

    if (divVisible) {
      return null;
    }

    return (
        <div className='uniqueWarning'>
            Substrings must be unique!
        </div>
    );
}

export default StringsUnique;






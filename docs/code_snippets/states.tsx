import React, {useState} from 'react';

const App = () => {
    const [name, setName] = useState('User');

    return(
        <div id='User'>
            <h1>{name}</h1>
        </div>
    )
}

export default App;
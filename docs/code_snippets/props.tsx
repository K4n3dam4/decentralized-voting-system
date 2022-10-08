import React, {useState} from 'react';

interface ComponentProps {
    onChange: (value) => void
    label: string
}
const Component = (props: ComponentProps) => {
    const {label, onChange} = props

    return(
        <div>
            {label}
            <input title='name' onChange={event => onChange(event.target.value)}/>
        </div>
    )
}

const App = () => {
    const [name, setName] = useState('User');
    const handleName = (value: string) => setName(value)

    return(
        <div id='User'>
            <h1>{name}</h1>
            <Component onChange={handleName} label='Username'/>
        </div>
    )
}

export default App;
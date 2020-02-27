import React from 'react';

export function Header() {
    return  (
        <header style={headerStyle}> 
            <h1>Show Data</h1>
        </header>
    )
}

const headerStyle = {
    background: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px'
}

export default Header;
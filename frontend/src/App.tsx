import React from 'react';
import Container from './components/organisms/Container';

const App: React.FC = () => (
    <Container>
        <p>gi meg penga dine</p>
        <a href={'tel:+4792848870'}>+47 928 48 870</a>
        <p>ellers blir det bråk</p>
        <img src={'https://i.giphy.com/media/3orif7aLUehOfdmlXy/giphy.webp'} alt={'mr burn'} />
    </Container>
);

export default App;

import React from 'react';
import './App.scss';
import { Header, Main } from './ContainerComponents';
import { useWindowDimensions } from './Hooks';

const App = ({ todos }) => {
	const { width } = useWindowDimensions();
	return (
		<div style={{ margin: '20px', display: 'flex', justifyContent: 'center' }}>
			<div className="container">
				<Header data={todos} />
				<Main data={todos} />
			</div>
		</div>
	);
};

export default App;

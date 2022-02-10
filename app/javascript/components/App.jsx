import React from 'react';
import './App.scss';
import { Header, TodosContainer } from './components';

const App = ({ todos }) => {
	return (
		<div className="container">
			<Header data={todos} />
			<TodosContainer data={todos} />
		</div>
	);
};

export default App;

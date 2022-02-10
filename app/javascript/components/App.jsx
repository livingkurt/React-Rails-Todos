import React from 'react';
import './App.css';

import TodosContainer from './TodoContainer';

const App = ({ todos }) => {
	console.log({ todos });
	return (
		<div className="container">
			<div className="header">
				<h1>Todo List</h1>
			</div>
			<TodosContainer tds={todos} />
		</div>
	);
};

export default App;

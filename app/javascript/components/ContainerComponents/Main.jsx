import React, { useState, useEffect } from 'react';
import update from 'immutability-helper';
import { TodoItem, TodoModal } from '../TodoComponents';
import { API } from '../../utils';

const TodosContainer = ({ data }) => {
	const [ todos, set_todos ] = useState(data);
	const [ form_state, set_form_state ] = useState(false);
	const [ input_value, set_input_value ] = useState('');

	// const getTodos = async () => {
	// 	try {
	// 		const { data } = await API.getTodos();
	// 		const fresh_todos = update(todos, {
	// 			$splice: [ [ 0, 0, data ] ]
	// 		});

	// 		set_todos(fresh_todos);
	// 		set_input_value('');
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	// useEffect(() => {
	// 	getTodos();
	// 	return () => {};
	// }, []);

	const createTodo = async (e) => {
		if (e.key === 'Enter' && !(e.target.value === '')) {
			try {
				const { data } = await API.createTodo({ todo: { title: e.target.value } });
				const todos_created = update(todos, {
					$splice: [ [ 0, 0, data ] ]
				});

				set_todos(todos_created);
				set_input_value('');
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleChange = (e) => {
		set_input_value(e.target.value);
	};

	const updateTodo = async (e, id) => {
		try {
			const { data } = await API.updateTodo(id, { todo: { done: e.target.checked } });
			const todoIndex = todos.findIndex((x) => x.id === data.id);
			const todos_updated = update(todos, {
				[todoIndex]: { $set: data }
			});
			set_todos(todos_updated);
			set_input_value('');
		} catch (error) {
			console.log(error);
		}
	};

	const updateTodoForm = async (id) => {
		try {
			const { data } = await API.updateTodoForm(id, { todo: form_state });
			const todoIndex = todos.findIndex((x) => x.id === data.id);
			const todos_updated = update(todos, {
				[todoIndex]: { $set: data }
			});
			set_todos(todos_updated);
			set_input_value('');
			set_form_state(false);
		} catch (error) {
			console.log(error);
		}
	};

	const deleteTodo = async (id) => {
		try {
			const response = await API.deleteTodo(id);
			if (response) {
				const todoIndex = todos.findIndex((x) => x.id === id);
				const todos_deleted = update(todos, {
					$splice: [ [ todoIndex, 1 ] ]
				});
				set_todos(todos_deleted);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<div className="inputContainer">
				<input
					className="taskInput"
					type="text"
					placeholder="Add a task"
					maxLength="50"
					onKeyPress={createTodo}
					value={input_value}
					onChange={handleChange}
				/>
			</div>
			<div>
				<div style={{ margin: '10px 0' }}>
					<i className="fa-solid fa-square-check" />: {data.filter((todo) => todo.done).length} Completed
				</div>
				<div style={{ margin: '10px 0' }}>
					<i className="fa-solid fa-square" />: {data.filter((todo) => !todo.done).length} Incomplete
				</div>
			</div>
			<div className="listWrapper">
				<ul className="taskList">
					{todos &&
						todos.map((todo, index) => {
							return (
								<TodoItem
									todo={todo}
									updateTodo={updateTodo}
									deleteTodo={deleteTodo}
									set_form_state={set_form_state}
									key={index}
								/>
							);
						})}
				</ul>

				<TodoModal
					form_state={form_state}
					set_form_state={set_form_state}
					deleteTodo={deleteTodo}
					updateTodoForm={updateTodoForm}
				/>
			</div>
		</div>
	);
};

export default TodosContainer;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import update from 'immutability-helper';

const TodosContainer = ({ tds }) => {
	const [ todos, set_todos ] = useState(tds);
	const [ form_state, set_form_state ] = useState(false);
	const [ input_value, set_input_value ] = useState('');

	// const getTodos = () => {
	// 	axios
	// 		.get('/api/v1/todos')
	// 		.then((response) => {
	// 			set_todos(response.data);
	// 		})
	// 		.catch((error) => console.log(error));
	// };

	// useEffect(() => {
	// 	getTodos();
	// 	return () => {};
	// }, []);

	const createTodo = (e) => {
		if (e.key === 'Enter' && !(e.target.value === '')) {
			axios
				.post('/api/v1/todos', { todo: { title: e.target.value } })
				.then((response) => {
					const todos_created = update(todos, {
						$splice: [ [ 0, 0, response.data ] ]
					});

					set_todos(todos_created);
					set_input_value('');
				})
				.catch((error) => console.log(error));
		}
	};

	const handleChange = (e) => {
		set_input_value(e.target.value);
	};

	const updateTodo = (e, id) => {
		console.log({ checked: e.target.checked });
		axios
			.put(`/api/v1/todos/${id}`, { todo: { done: e.target.checked } })
			.then((response) => {
				const todoIndex = todos.findIndex((x) => x.id === response.data.id);
				const todos_updated = update(todos, {
					[todoIndex]: { $set: response.data }
				});
				set_todos(todos_updated);
				set_input_value('');
			})
			.catch((error) => console.log(error));
	};
	const updateTodoForm = () => {
		console.log({ form_state });
		axios
			.put(`/api/v1/todos/${form_state.id}/update_form`, { todo: form_state })
			.then((response) => {
				const todoIndex = todos.findIndex((x) => x.id === response.data.id);
				const todos_updated = update(todos, {
					[todoIndex]: { $set: response.data }
				});
				set_todos(todos_updated);
				set_input_value('');
				set_form_state(false);
			})
			.catch((error) => console.log(error));
	};

	const deleteTodo = (id) => {
		axios
			.delete(`/api/v1/todos/${id}`)
			.then((response) => {
				const todoIndex = todos.findIndex((x) => x.id === id);
				const todos_deleted = update(todos, {
					$splice: [ [ todoIndex, 1 ] ]
				});
				set_todos(todos_deleted);
			})
			.catch((error) => console.log(error));
	};

	const [ show_modal, set_show_modal ] = useState();

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
			<div className="listWrapper">
				<ul className="taskList">
					{todos &&
						todos.map((todo) => {
							return (
								<li className="task" todo={todo} key={todo.id}>
									<input
										className="taskCheckbox"
										type="checkbox"
										checked={todo.done}
										onChange={(e) => updateTodo(e, todo.id)}
									/>
									<button onClick={() => set_form_state(todo)}>
										<label className="taskLabel">{todo.title}</label>
									</button>
									<span className="deleteTaskBtn" onClick={(e) => deleteTodo(todo.id)}>
										x
									</span>
								</li>
							);
						})}
				</ul>

				{form_state && (
					<div id="myModal" className="modal">
						<div className="modal-content">
							<span className="close">&times;</span>
							<input
								className=""
								type="text"
								defaultValue={form_state.title}
								onChange={(e) =>
									set_form_state((form_state) => ({ ...form_state, title: e.target.value }))}
							/>
							<input
								className=""
								type="text"
								defaultValue={form_state.description}
								onChange={(e) =>
									set_form_state((form_state) => ({ ...form_state, description: e.target.value }))}
							/>
							<input
								className="taskCheckbox"
								type="checkbox"
								checked={form_state.done}
								onChange={(e) =>
									set_form_state((form_state) => ({ ...form_state, done: e.target.value }))}
							/>
							<span className="deleteTaskBtn" onClick={(e) => deleteTodo(form_state.id)}>
								Delete
							</span>
							<button onClick={updateTodoForm}>Submit</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TodosContainer;

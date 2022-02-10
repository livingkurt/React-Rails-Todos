import React from 'react';

export default function TodoItem({ todo, updateTodo, deleteTodo, set_form_state }) {
	return (
		<li className="task" todo={todo} key={todo.id}>
			<input
				className="taskCheckbox"
				type="checkbox"
				checked={todo.done}
				onChange={(e) => updateTodo(e, todo.id)}
			/>
			<div onClick={() => set_form_state(todo)}>
				<label className="taskLabel">{todo.title}</label>
			</div>
			<span className="deleteTaskBtn" onClick={(e) => deleteTodo(todo.id)}>
				x
			</span>
		</li>
	);
}

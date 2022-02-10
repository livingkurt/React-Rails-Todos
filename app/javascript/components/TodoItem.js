import React from 'react';

export default function TodoItem(todo, updateTodo, deleteTodo) {
	return (
		<li className="task" todo={todo} key={todo.id}>
			<input
				className="taskCheckbox"
				type="checkbox"
				checked={todo.done}
				onChange={(e) => updateTodo(e, todo.id)}
			/>
			<label className="taskLabel">{todo.title}</label>
			<span className="deleteTaskBtn" onClick={(e) => deleteTodo(todo.id)}>
				x
			</span>
		</li>
	);
}

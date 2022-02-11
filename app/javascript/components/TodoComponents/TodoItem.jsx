import React from 'react';

export default function TodoItem({ todo, updateTodo, deleteTodo, set_form_state }) {
	return (
		<div className="task" key={todo.id}>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<input
					className="taskCheckbox"
					type="checkbox"
					checked={todo.done}
					onChange={(e) => updateTodo(e, todo.id)}
				/>
				<div onClick={() => set_form_state(todo)}>
					<label className="taskLabel">{todo.title}</label>
				</div>
			</div>
			<span className="deleteTaskBtn" onClick={(e) => deleteTodo(todo.id)}>
				&#10008;
			</span>
		</div>
	);
}

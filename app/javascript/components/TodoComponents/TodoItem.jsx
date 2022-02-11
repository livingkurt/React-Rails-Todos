import React from 'react';

export default function TodoItem({ todo, updateTodo, deleteTodo, set_form_state }) {
	return (
		<div className="task" key={todo.id}>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<input
					className="taskCheckbox"
					type="checkbox"
					defaultChecked={todo.done}
					onChange={(e) => updateTodo(e, todo.id)}
				/>
				<div className="taskLabel" onClick={() => set_form_state(todo)}>
					<label style={{ cursor: 'pointer' }}>{todo.title}</label>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'center'
				}}
			>
				<span className="drag_icon">
					<i className="fa-solid fa-bars" />
				</span>
				<span className="deleteTaskBtn" onClick={(e) => deleteTodo(todo.id)}>
					&#10008;
				</span>
			</div>
		</div>
	);
}

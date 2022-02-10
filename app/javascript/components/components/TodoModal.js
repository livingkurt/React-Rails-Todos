import React from 'react';

export default function TodoModal({ form_state, set_form_state, deleteTodo, updateTodoForm }) {
	return (
		<div id="myModal" className="modal" style={{ display: form_state ? 'block' : 'none' }}>
			<div className="modal-content">
				<span className="close" onClick={() => set_form_state(false)}>
					&times;
				</span>
				<div style={{ display: 'flex' }}>
					<input
						className=""
						type="text"
						defaultValue={form_state.title}
						onChange={(e) => set_form_state((form_state) => ({ ...form_state, title: e.target.value }))}
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
						onChange={(e) => set_form_state((form_state) => ({ ...form_state, done: e.target.value }))}
					/>
					<span className="deleteTaskBtn" onClick={(e) => deleteTodo(form_state.id)}>
						Delete
					</span>
					<button onClick={updateTodoForm}>Submit</button>
				</div>
			</div>
		</div>
	);
}

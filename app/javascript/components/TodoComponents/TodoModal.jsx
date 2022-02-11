import React from 'react';

export default function TodoModal({ form_state, set_form_state, deleteTodo, updateTodoForm }) {
	return (
		<div id="myModal" className="modal" style={{ display: form_state ? 'block' : 'none' }}>
			<div className="modal-content">
				<span className="close" onClick={() => set_form_state(false)}>
					&#10008;
				</span>
				<input
					className=""
					style={{ fontSize: '25px', boxShadow: 'unset ', fontWeight: 800, margin: '20px 0' }}
					type="text"
					defaultValue={form_state.title}
					onChange={(e) => set_form_state((form_state) => ({ ...form_state, title: e.target.value }))}
				/>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<textarea
						className=""
						type="text"
						style={{ height: '200px', resize: 'none' }}
						defaultValue={form_state.description}
						onChange={(e) =>
							set_form_state((form_state) => ({ ...form_state, description: e.target.value }))}
					/>
					<div style={{ margin: '20px 0', display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<label htmlFor="checkbox ">Completed</label>
							<input
								className="taskCheckbox"
								type="checkbox"
								name="checkbox"
								checked={form_state.done}
								onChange={(e) =>
									set_form_state((form_state) => ({ ...form_state, done: e.target.checked }))}
							/>
						</div>
						<span className="deleteTaskBtn" onClick={(e) => deleteTodo(form_state.id)}>
							Delete
						</span>
					</div>

					<button onClick={() => updateTodoForm(form_state.id)}>Submit</button>
				</div>
			</div>
		</div>
	);
}

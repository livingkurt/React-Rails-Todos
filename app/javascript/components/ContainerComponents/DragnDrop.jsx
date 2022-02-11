import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TodoItem } from '../TodoComponents';
import { API } from '../../utils';

export default function DragnDrop({ todos, updateTodo, deleteTodo, set_form_state, set_todos }) {
	const [ loading_upload, set_loading_upload ] = useState(false);

	function onDragEnd(result) {
		if (!result.destination) {
			return;
		}

		if (result.destination.index === result.source.index) {
			return;
		}

		const new_order = reorder(todos, result.source.index, result.destination.index);
		// setState(new_order);
		update_order(new_order);
	}

	const update_order = async (new_order) => {
		set_loading_upload(true);
		console.log({ new_order });
		const new_list = [];
		new_order.forEach(async (item, index) => {
			new_list.push({ ...item, order: index + 1 });
			await API.updateTodo(item.id, { todo: { order: index + 1 } });
		});
		set_todos(new_list);
		set_loading_upload(false);
	};

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [ removed ] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="list">
				{(provided) => (
					<div ref={provided.innerRef} {...provided.droppableProps}>
						{todos.map((todo, index) => (
							<Draggable draggableId={todo.title} index={index} key={todo.title}>
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
									>
										<TodoItem
											todo={todo}
											updateTodo={updateTodo}
											deleteTodo={deleteTodo}
											set_form_state={set_form_state}
										/>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}

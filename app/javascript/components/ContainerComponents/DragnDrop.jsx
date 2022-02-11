import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TodoItem } from '../TodoComponents';
import update from 'immutability-helper';
import { API } from '../../utils';

export default function DragnDrop({ data, updateTodo, deleteTodo, set_form_state, set_todos }) {
	const [ state, setState ] = useState(data);
	console.log({ state });
	const [ loading_upload, set_loading_upload ] = useState(false);

	function onDragEnd(result) {
		console.log({ result });
		if (!result.destination) {
			return;
		}

		if (result.destination.index === result.source.index) {
			return;
		}

		const new_order = reorder(state, result.source.index, result.destination.index);
		setState(new_order);
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
		// const todoIndex = todos.findIndex((x) => x.id === data.id);
		// const todos_updated = update(data, {
		// 	[todoIndex]: { $set: data }
		// });
		// const { data: fresh_todos } = await API.getTodos();
		// const fresh_todos = update(todos, {
		// 	$splice: [ [ 0, 0, data ] ]
		// });

		// set_todos(fresh_todos);
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
						{state.map((todo, index) => (
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

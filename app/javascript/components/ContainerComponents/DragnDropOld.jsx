import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import memoizeOne from 'memoize-one';
import { TodoItem } from '../TodoComponents';
import { mutliDragAwareReorder, multiSelectTo as multiSelect } from '../../utils/drag_helpers';

export default function DragnDrop({ data, updateTodo, deleteTodo, set_form_state }) {
	const [ todo_list, updateTodos ] = useState([]);

	const update_order = () => {
		set_loading_upload(true);
		state.entities.columnOrder.map((columnId) => {
			const column = state.entities.columns[columnId];
			console.log({ column });
			// const todos = column.todo_ids.map((todo_id, index) => state.entities.todos[index]);
			let todos = [];
			state.entities.todos.forEach(function(a) {
				todos[column.todo_ids.indexOf(a.id)] = a;
			});

			console.log({ todos });
			todos.forEach(async (item, index) => {
				const update_todo_order = await API_Todos.update_todo_order(item, index + 1);
				console.log({ update_todo_order });
			});
		});
		dispatch(listTodos());
		set_loading_upload(false);
	};

	const [ state, setState ] = useState({
		entities: {
			todos: [],
			columns: {
				'column-1': {
					id: 'column-1',
					title: 'Todos',
					todo_ids: []
				}
			},
			columnOrder: [ 'column-1' ]
		},
		selectedTodoIds: [],
		draggingTodoId: null
	});

	useEffect(() => {
		window.addEventListener('click', onWindowClick);
		window.addEventListener('keydown', onWindowKeyDown);
		window.addEventListener('touchend', onWindowTouchEnd);
		// createData();
		return () => {
			window.removeEventListener('click', onWindowClick);
			window.removeEventListener('keydown', onWindowKeyDown);
			window.removeEventListener('touchend', onWindowTouchEnd);
		};
	}, []);

	useEffect(
		() => {
			if (data) {
				set_state();
			}

			return () => {};
		},
		[ data ]
	);

	const set_state = () => {
		console.log({ data });
		if (data) {
			console.log({ set_state: data });
			if (data.columns) {
				setState({
					entities: data,
					selectedTodoIds: [],
					draggingTodoId: null
				});
			} else {
				setState({
					entities: {
						todos: data,
						columns: {
							'column-1': {
								id: 'column-1',
								title: 'Todos',
								todo_ids: data.map((todo) => todo.id)
							}
						},
						columnOrder: [ 'column-1' ]
					},
					selectedTodoIds: [],
					draggingTodoId: null
				});
			}
		}
		updateTodos(data);
	};

	const onDragStart = (start) => {
		console.log('OnDragStart event started');
		const id = start.draggableId;

		const selected = state.selectedTodoIds.find((todoId) => todoId === id);
		console.log({});

		// if dragging an item that is not selected - unselect all data
		if (!selected) {
			unselectAll();
		}
		// console.log("Updating State from onDragStart");
		// set_draggingTodoId(start.draggableId);
		// setState(state => {return ...state,draggingTodoId: start.draggableId});
		setState((state) => {
			return { ...state, draggingTodoId: start.draggableId };
		});
	};

	const onDragEnd = (result) => {
		// console.log("OnDragEnd event started");
		const { destination, source, draggableId } = result;

		if (!destination) {
			// set_draggingTodoId(null);
			// setState({
			// 	draggingTodoId: null
			// });
			setState((state) => {
				return { ...state, draggingTodoId: null };
			});
			return;
		}

		const processed = mutliDragAwareReorder({
			entities: state.entities,
			selectedTodoIds: state.selectedTodoIds,
			source,
			destination
		});

		console.log('Updating State from onDragEnd');
		// ...processed,
		console.log({ processed });
		// set_entities(processed.entities);
		// set_selectedTodoIds(processed.selectedTodoIds);
		// set_draggingTodoId(null);
		// setState({
		// 	...processed,
		// 	draggingTodoId: null
		// });
		setState((state) => {
			return { ...processed, draggingTodoId: null };
		});
		updateTodos(processed.entities.todos);
		// updateTodos(state.entities);
	};

	// function handleOnDragEnd(result) {
	// 	if (!result.destination) return;

	// 	const todo_data = Array.from(todos);
	// 	const [ reorderedItem ] = todo_data.splice(result.source.index, 1);
	// 	todo_data.splice(result.destination.index, 0, reorderedItem);

	// 	updateTodos(todo_data);
	// }

	const onWindowKeyDown = (event) => {
		if (event.defaultPrevented) {
			return;
		}

		if (event.key === 'Escape') {
			unselectAll();
		}
	};

	const onWindowClick = (event) => {
		console.log({ event });
		if (event.defaultPrevented) {
			return;
		}
		unselectAll();
	};

	const onWindowTouchEnd = (event) => {
		if (event.defaultPrevented) {
			return;
		}
		unselectAll();
	};

	const toggleSelection = (todoId) => {
		const selectedTodoIds = state.selectedTodoIds;
		// console.log({ selectedTodoIds });
		const wasSelected = selectedTodoIds.includes(todoId);

		const newTodoIds = (() => {
			// Todo was not previously selected
			// now will be the only selected item
			if (!wasSelected) {
				return [ todoId ];
			}

			// Todo was part of a selected group
			// will now become the only selected item
			if (selectedTodoIds.length > 1) {
				return [ todoId ];
			}

			// todo was previously selected but not in a group
			// we will now clear the selection
			return [];
		})();
		// console.log("Updating state from toggleSelection");
		// set_selectedTodoIds(newTodoIds);
		// setState({
		// 	selectedTodoIds: newTodoIds
		// });
		setState((state) => {
			return { ...state, selectedTodoIds: newTodoIds };
		});
	};

	const toggleSelectionInGroup = (todoId) => {
		const selectedTodoIds = state.selectedTodoIds;
		const index = selectedTodoIds.indexOf(todoId);

		// if not selected - add it to the selected data
		if (index === -1) {
			// console.log(
			//   "Updating State from toggleSelectioninGroup for index === -1"
			// );
			// set_selectedTodoIds([ ...selectedTodoIds, todoId ]);
			// setState({
			// 	selectedTodoIds: [ ...selectedTodoIds, todoId ]
			// });
			setState((state) => {
				return { ...state, selectedTodoIds: [ ...selectedTodoIds, todoId ] };
			});
			return;
		}

		// it was previously selected and now needs to be removed from the group
		const shallow = [ ...selectedTodoIds ];
		shallow.splice(index, 1);
		// console.log("Updating State from toggleSelectioninGroup shallow");
		// set_selectedTodoIds(shallow);
		// setState({
		// 	selectedTodoIds: shallow
		// });

		setState((state) => {
			return { ...state, selectedTodoIds: shallow };
		});
	};

	// This behaviour matches the MacOSX finder selection
	const multiSelectTo = (newTodoId) => {
		const updated = multiSelect(state.entities, state.selectedTodoIds, newTodoId);

		console.log({ updated });

		if (updated == null) {
			return;
		}

		// console.log("Updating State from multiSelectTo");
		// set_selectedTodoIds(updated);
		// setState({
		// 	selectedTodoIds: updated
		// });

		setState((state) => {
			return { ...state, selectedTodoIds: updated };
		});
	};

	const unselect = () => {
		unselectAll();
	};

	const unselectAll = () => {
		// console.log("Updating State from unselectAll");
		// set_selectedTodoIds([]);
		// setState({
		// 	selectedTodoIds: []
		// });
		setState((state) => {
			return { ...state, selectedTodoIds: [] };
		});
	};
	// console.log({ selectionCount: state.selectedTodoIds.length });

	const getSelectedMap = memoizeOne((selectedTodoIds) =>
		selectedTodoIds.reduce((previous, current) => {
			previous[current] = true;
			// console.log({ previous });
			// console.log({ selectedTodoIds });
			return previous;
		}, {})
	);

	return (
		<div className="">
			<DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
				{state.entities.columnOrder.map((columnId, index) => {
					const column = state.entities.columns[columnId];
					console.log({ column });
					// const todos = column.todo_ids.map((todo_id, index) => state.entities.todos[index]);
					let todos = [];
					state.entities.todos.filter((todo) => !todo.option).forEach(function(a) {
						todos[column.todo_ids.indexOf(a.id)] = a;
					});
					const todos_2 = column.todo_ids.map((todo_id, index) => state.entities.todos[index + 1]);
					console.log({ todos_2 });

					return (
						<Droppable droppableId={'column-1'} key={index}>
							{(provided) => (
								<ul {...provided.droppableProps} ref={provided.innerRef}>
									{/* {console.log({ state.entities })} */}
									{todos.filter((todo) => !todo.hidden).map((todo, index) => {
										return (
											<Draggable key={todo.id} draggableId={toString(todo.id)} index={index}>
												{(provided, snapshot) => {
													const isSelected = Boolean(
														getSelectedMap(state.selectedTodoIds)[todo.id]
													);
													let disAppearTodo = false;
													if (
														snapshot.isDraggingOver &&
														isSelected &&
														state.draggingTodoId &&
														todo.id !== state.draggingTodoId
													) {
														// console.log("Dragging Over - Todo not to render - " + todo.id);
														// console.log("draggingTodoId - " + draggingTodoId);
														disAppearTodo = true;
													}
													return (
														<li
															key={index}
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
														</li>
													);
												}}
											</Draggable>
										);
									})}
									{provided.placeholder}
								</ul>
							)}
						</Droppable>
					);
				})}
			</DragDropContext>
		</div>
	);
}

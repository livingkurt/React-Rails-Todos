export const mutliDragAwareReorder = (args) => {
	console.log('hello');
	if (args.selectedTodoIds.length > 1) {
		return reorderMultiDrag(args);
	}
	return reorderSingleDrag(args);
};
// const reorder_entities = (list, startIndex, endIndex) => {
// 	// const result = Array.from(list);
// 	// console.log({ list });
// 	const result = list.todos;
// 	const [ removed ] = result.splice(startIndex, 1);
// 	result.splice(endIndex, 0, removed);

// 	return result;
// };

const reorderSingleDrag = ({ entities, selectedTodoIds, source, destination }) => {
	console.log('reorderSingleDrag');
	// moving in the same list

	if (source.droppableId === destination.droppableId) {
		const column = entities.columns[source.droppableId];
		const reordered = reorder(column.todo_ids, source.index, destination.index);
		// const reordered_entities = reorder_entities(entities, source.index, destination.index);
		console.log({ entities, selectedTodoIds, source, destination });
		const updated = {
			...entities,
			columns: {
				...entities.columns,
				[column.id]: withNewTodoIds(column, reordered)
			}
		};
		console.log({ reorderSingleDrag: updated });
		return {
			entities: updated,
			selectedTodoIds
		};
	}

	// moving to a new list
	const home = entities.columns[source.droppableId];
	const foreign = entities.columns[destination.droppableId];

	// the id of the todo to be moved
	const todoId = home.todo_ids[source.index];

	// remove from home column
	const newHomeTodoIds = [ ...home.todo_ids ];
	newHomeTodoIds.splice(source.index, 1);

	// add to foreign column
	const newForeignTodoIds = [ ...foreign.todo_ids ];
	newForeignTodoIds.splice(destination.index, 0, todoId);

	const updated = {
		...entities,
		columns: {
			...entities.columns,
			[home.id]: withNewTodoIds(home, newHomeTodoIds),
			[foreign.id]: withNewTodoIds(foreign, newForeignTodoIds)
		}
	};

	return {
		entities: updated,
		selectedTodoIds
	};
};

const reorderMultiDrag = ({ entities, selectedTodoIds, source, destination }) => {
	console.log('reorderMultiDrag');
	// console.log({ entities });
	// console.log({ columns: entities.columns });
	// console.log({ source });
	// console.log({ droppableId: source.droppableId });
	const start = entities.columns[source.droppableId];
	console.log({ start });
	const dragged = start.todo_ids[source.index];
	console.log({ dragged });
	const insertAtIndex = (() => {
		const destinationIndexOffset = selectedTodoIds.reduce((previous, current) => {
			if (current === dragged) {
				return previous;
			}

			const final = entities.columns[destination.droppableId];
			const column = getHomeColumn(entities, current);

			if (column !== final) {
				return previous;
			}

			const index = column.todo_ids.indexOf(current);

			if (index >= destination.index) {
				return previous;
			}

			// the selected item is before the destination index
			// we need to account for this when inserting into the new location
			return previous + 1;
		}, 0);

		const result = destination.index - destinationIndexOffset;

		console.log({ result });
		return result;
	})();

	// doing the ordering now as we are required to look up columns
	// and know original ordering
	const orderedSelectedTodoIds = [ ...selectedTodoIds ];
	orderedSelectedTodoIds.sort((a, b) => {
		// moving the dragged item to the top of the list
		if (a === dragged) {
			return -1;
		}
		if (b === dragged) {
			return 1;
		}

		// sorting by their natural indexes
		const columnForA = getHomeColumn(entities, a);
		const indexOfA = columnForA.todo_ids.indexOf(a);
		const columnForB = getHomeColumn(entities, b);
		const indexOfB = columnForB.todo_ids.indexOf(b);

		if (indexOfA !== indexOfB) {
			return indexOfA - indexOfB;
		}

		// sorting by their order in the selectedTodoIds list
		return -1;
	});

	// we need to remove all of the selected todos from their columns
	const withRemovedTodos = entities.columnOrder.reduce((previous, columnId) => {
		const column = entities.columns[columnId];

		// remove the id's of the items that are selected
		const remainingTodoIds = column.todo_ids.filter((id) => !selectedTodoIds.includes(id));

		previous[column.id] = withNewTodoIds(column, remainingTodoIds);
		return previous;
	}, entities.columns);

	const final = withRemovedTodos[destination.droppableId];
	console.log({ final });
	const withInserted = (() => {
		const base = [ ...final.todo_ids ];
		base.splice(insertAtIndex, 0, ...orderedSelectedTodoIds);
		return base;
	})();

	// insert all selected todos into final column
	const withAddedTodos = {
		...withRemovedTodos,
		[final.id]: withNewTodoIds(final, withInserted)
	};
	console.log({ withAddedTodos });

	const updated = {
		...entities,
		columns: withAddedTodos
	};
	console.log({ updated });
	console.log({ entities });

	return {
		entities: updated,
		selectedTodoIds: orderedSelectedTodoIds
	};
};

const withNewTodoIds = (column, todo_ids) => ({
	id: column.id,
	title: column.title,
	todo_ids
});

export const getHomeColumn = (entities, todoId) => {
	console.log({ entities, todoId });
	const columnId = entities.columnOrder.find((id) => {
		const column = entities.columns[id];
		console.log({ column });
		console.log({ includes: column.todo_ids.includes(todoId) });
		return column.todo_ids.includes(todoId);
	});

	// invariant(columnId, 'Count not find column for todo');

	return entities.columns[columnId];
};

export const multiSelectTo = (entities, selectedTodoIds, newTodoId) => {
	// Nothing already selected
	if (!selectedTodoIds.length) {
		return [ newTodoId ];
	}

	const columnOfNew = getHomeColumn(entities, newTodoId);

	const indexOfNew = columnOfNew.todo_ids.indexOf(newTodoId);

	const lastSelected = selectedTodoIds[selectedTodoIds.length - 1];
	const columnOfLast = getHomeColumn(entities, lastSelected);
	const indexOfLast = columnOfLast.todo_ids.indexOf(lastSelected);

	// multi selecting to another column
	// select everything up to the index of the current item
	if (columnOfNew !== columnOfLast) {
		return columnOfNew.todo_ids.slice(0, indexOfNew + 1);
	}

	// multi selecting in the same column
	// need to select everything between the last index and the current index inclusive

	// nothing to do here
	if (indexOfNew === indexOfLast) {
		return null;
	}

	const isSelectingForwards = indexOfNew > indexOfLast;
	const start = isSelectingForwards ? indexOfLast : indexOfNew;
	const end = isSelectingForwards ? indexOfNew : indexOfLast;

	const inBetween = columnOfNew.todo_ids.slice(start, end + 1);

	// everything inbetween needs to have it's selection toggled.
	// with the exception of the start and end values which will always be selected

	const toAdd = inBetween.filter((todoId) => {
		// if already selected: then no need to select it again
		if (selectedTodoIds.includes(todoId)) {
			return false;
		}
		return true;
	});

	const sorted = isSelectingForwards ? toAdd : [ ...toAdd ].reverse();
	const combined = [ ...selectedTodoIds, ...sorted ];

	return combined;
};

const reorder = (list, startIndex, endIndex) => {
	console.log({ list, startIndex, endIndex });
	const result = Array.from(list);

	const [ removed ] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

import axios from 'axios';

const routes = {
	getTodos: () => {
		return axios.get('/api/v1/todos');
	},
	getTodo: (id) => {
		return axios.get(`/api/v1/todos/${id}`);
	},
	createTodo: (todo) => {
		return axios.post('/api/v1/todos', todo);
	},
	updateTodo: (id, todo) => {
		return axios.put(`/api/v1/todos/${id}`, todo);
	},
	updateTodoForm: (id, todo) => {
		return axios.put(`/api/v1/todos/${id}/update_form`, todo);
	},
	deleteTodo: (id) => {
		return axios.delete(`/api/v1/todos/${id}`);
	}
};

export default routes;

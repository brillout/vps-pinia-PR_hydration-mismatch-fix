import { defineStore } from 'pinia'

export const useTodos = defineStore('todos', {
  state: () => ({
    todoList: [],
  }),
  getters: {
    todoById: (state) => (id) => {
      const todo = state.todoList.find((todo) => todo.id === id)
      console.log('id', todo)
      console.log('state', todo)
      console.log('state.todoList', state.todoList)
      console.log('todo', todo)
      return todo
    }
  },
  actions: {
    async fetchTodoList() {
      // simulate an API response
      const result = await new Promise((resolve) =>
        setTimeout(() => {
          resolve([
            {
              id: 0,
              text: 'Buy milk',
            },
            {
              id: 1,
              text: 'Buy chocolate',
            },
          ])
        }, 250),
      )
      console.log('fetch')
      this.todoList = result
    },
  },
})

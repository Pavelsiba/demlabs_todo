<script lang="ts">
  import { onMount } from "svelte"
  import TodoItem from "./TodoItem.svelte"
  import { getTodos, addTodo, updateTodo, deleteTodo } from "../service/todoApi"
  import type { Todo } from "../store/todoDB"

  let todos: Todo[] = []
  let loading = true
  let search = ""
  let newTitle = ""
  let newDescription = ""
  let editing: Todo | null = null
  let editTitle = ""
  let editDescription = ""
  let editCompleted = false

  async function loadTodos() {
    loading = true
    try {
      todos = await getTodos()
    } catch (e) {
      alert("Не удалось выполнить операцию")
    } finally {
      loading = false
    }
  }

  async function handleAdd() {
    if (!newTitle.trim()) return
    try {
      await addTodo({ title: newTitle, description: newDescription, completed: false })
      newTitle = ""
      newDescription = ""
      await loadTodos()
    } catch (e) {
      alert("Не удалось выполнить операцию")
    }
  }

  function startEdit(todo: Todo) {
    editing = { ...todo }
    editTitle = todo.title
    editDescription = todo.description || ""
    editCompleted = todo.completed
  }

  async function handleEdit() {
    if (editing && editTitle.trim()) {
      try {
        await updateTodo(editing.id!, { title: editTitle, description: editDescription, completed: editCompleted })
        editing = null
        await loadTodos()
      } catch (e) {
        alert("Не удалось выполнить операцию")
      }
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTodo(id)
      await loadTodos()
    } catch (e) {
      alert("Не удалось выполнить операцию")
    }
  }

  async function handleToggle(todo: Todo) {
    try {
      await updateTodo(todo.id!, { completed: !todo.completed })
      await loadTodos()
    } catch (e) {
      alert("Не удалось выполнить операцию")
    }
  }

  onMount(loadTodos)
</script>

<main class="max-w-xl mx-auto p-0 bg-white rounded-lg mt-0">
  <div class="sticky top-0 z-20 bg-white pb-2 px-6 -mx-6 pt-6">
    <h1 class="text-2xl font-bold mb-4 text-center">Todo List</h1>
    <form on:submit|preventDefault={handleAdd} class="flex flex-col gap-3 mb-4">
      <input
        placeholder="Title"
        bind:value={newTitle}
        required
        class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
      />
      <textarea
        placeholder="Description"
        bind:value={newDescription}
        rows="3"
        class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 resize-y"
      ></textarea>
      <button
        type="submit"
        class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition font-semibold tracking-wide text-base"
        >Add</button
      >
    </form>
    <input
      type="search"
      placeholder="Search by title or description..."
      bind:value={search}
      class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
      disabled={loading}
    />
  </div>

  {#if loading}
    <div class="text-center text-gray-500 py-8">Загружаю ...</div>
  {:else}
    <ul>
      {#each todos.filter(todo =>
        !search ||
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(search.toLowerCase()))
      ) as todo (todo.id)}
        {#if editing && editing.id === todo.id}
          <li class="flex flex-col gap-2 py-2 px-3 rounded-md bg-sky-50 border border-sky-200 mb-2">
            <div class="flex flex-col gap-2 w-full">
              <div class="flex items-center gap-2 w-full">
                <input
                  bind:value={editTitle}
                  class="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300 text-base sm:text-lg"
                />
              </div>
              <textarea
                bind:value={editDescription}
                placeholder="Description"
                rows="3"
                class="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300 text-base sm:text-lg resize-y"
              ></textarea>
            </div>
            <div class="flex flex-row gap-2 mt-2 w-full justify-end">
              <button
                on:click={handleEdit}
                title="Save"
                aria-label="Save"
                class="w-full sm:w-auto h-10 sm:h-8 flex items-center justify-center rounded bg-black text-white hover:bg-gray-800 transition font-semibold tracking-wide text-base px-4"
                >Save</button
              >
              <button
                on:click={() => (editing = null)}
                title="Cancel"
                aria-label="Cancel"
                class="w-full sm:w-auto h-10 sm:h-8 flex items-center justify-center rounded bg-red-600 text-white hover:bg-red-700 transition font-semibold tracking-wide text-base px-4"
                >Cancel</button
              >
            </div>
          </li>
        {:else}
          <TodoItem
            {todo}
            onEdit={startEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
            buttonClass="bg-black text-white hover:bg-gray-800 transition font-semibold tracking-wide text-base"
            deleteButtonClass="bg-red-600 text-white hover:bg-red-700 transition font-semibold tracking-wide text-base"
          />
        {/if}
      {/each}
    </ul>
  {/if}
</main>

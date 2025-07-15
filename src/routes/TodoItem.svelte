<script lang="ts">
  export let todo;
  export let onEdit;
  export let onDelete;
  export let onToggle;
  export let buttonClass = "";
  export let deleteButtonClass = "";
</script>


<li class="flex items-center gap-2 sm:gap-4 py-2 px-3 rounded-md bg-white shadow-sm mb-2">
  <input
    type="checkbox"
    checked={todo.completed}
    on:change={() => onToggle(todo)}
    class="w-5 h-5 accent-sky-500 cursor-pointer"
  />
  <span class={`flex-1 break-words text-base sm:text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{todo.title}</span>
  <button on:click={() => onEdit(todo)} class={`ml-2 px-2 py-1 rounded ${buttonClass}`}>Edit</button>
  <button on:click={() => onDelete(todo.id)} class={`ml-2 px-2 py-1 rounded ${deleteButtonClass || buttonClass}`}>Delete</button>
</li>

<script>
   import { onMount } from 'svelte';
   import { writable } from 'svelte/store';

   /* Variables */
   let taskInput = '';
   let taskStatus = 'Incomplete';
   let dueDateInput = '';
   const tasks = writable([]);
   let errorMessage = '';
   let showCompleteOnly = false; // Flag to toggle between showing only complete tasks or all tasks

   onMount(() => {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.set(savedTasks);
      const unsubscribe = tasks.subscribe(value => {
         localStorage.setItem('tasks', JSON.stringify(value));
      });
      return () => {
         unsubscribe();
      };
   });

   /* Method for creating new task */
   function addTask() {
      if (taskInput.trim() === '' || dueDateInput === '') {
         errorMessage = 'Both task and due date are required.';
         return;
      }
      tasks.update(currentTasks => {
         const newTasks = [...currentTasks, { text: taskInput, dueDate: dueDateInput, status: taskStatus }];
         taskInput = '';
         dueDateInput = '';
         errorMessage = '';
         return newTasks;
      });
   }

   /* Method for deleting the task */
   function deleteTask(index) {
      tasks.update(currentTasks => {
         const newTasks = currentTasks.filter((_, i) => i !== index);
         return newTasks;
      });
   }

   /* Method for editing the task */
   function editTask(index) {
      tasks.update(currentTasks => {
         const newStatus = prompt('EDIT the status:', currentTasks[index].status);
         const newDueDate = prompt('EDIT the due date:', currentTasks[index].dueDate);
         if (newStatus !== null && newDueDate !== null) {
           currentTasks[index].status = newStatus;
           currentTasks[index].dueDate = newDueDate;
         }
         return currentTasks;
      });
   }

   // Function to filter tasks based on showCompleteOnly flag
   function filterTasks(tasks, showCompleteOnly) {
      if (showCompleteOnly) {
         return tasks.filter(task => task.status === 'Complete');
      }
      return tasks;
   }
</script>

<!-- Panel tasks format -->
<div class="flex-max-w-md mx-auto p-6 text-center bg-white shadow-md rounded-lg">
   <h1 class="text-2xl font-bold mb-4">Task List</h1>

   <!-- Toggle Button for Showing Complete Tasks Only -->
   <div class="mb-4">
      <button on:click={() => showCompleteOnly = !showCompleteOnly} class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
         {showCompleteOnly ? 'Show All Tasks' : 'Show Complete Tasks Only'}
      </button>
   </div>

   <div class="mb-4">
      <input type="text" bind:value={taskInput} placeholder="Add new Task" class="border p-2 rounded w-full mb-2" required/>
      <input type="date" bind:value={dueDateInput} class="border p-2 rounded w-full mb-2"/>
    
      <button on:click={addTask} class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Add</button>
    
      {#if errorMessage}
         <p class="text-red-500 mt-2">{errorMessage}</p>
      {/if}
   </div>

   <ul class="list-none p-0">
      <!-- Iterating the tasks with filter applied -->
      {#each filterTasks($tasks, showCompleteOnly) as task, index}
      <li class="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded">
         <div>
            <div class="text-left items-left font-bold">
               <h1>{task.text}</h1>
            </div> 
            <div class="text-center items-center">
               <h1>{task.dueDate}</h1>
            </div>
         </div>
         <div class="text-center items-center">
            <h1>{task.status}</h1>
         </div>
        
         <div>
            <button class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700 mr-2" on:click={() => editTask(index)}>Edit</button>
            <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700" on:click={() => deleteTask(index)}>Delete</button>
         </div>
      </li>
      {/each}
  </ul>
</div>

<script>
   let value;
   const url = "/results/" 
</script>
<!-- Searching bar movies -->
<div class="mb-8">
    <center>
      <form action={url+value} class="flex-max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mb-6">
          <div class="flex w-full">
              <input 
                type="search" 
                class="placeholder:italic placeholder:text-slate-400 bg-white border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm flex-grow" 
                bind:value={value} 
                placeholder="Search Movie" 
                required 
              />
              <button 
                type="submit" 
                class="ml-2 bg-blue-500 text-white rounded-md py-2 px-4 shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
              >
                Search
              </button>
          </div>
      </form>
    </center>
</div>

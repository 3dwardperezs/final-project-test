<script>
    /* Variables */
    let query = '';
    let repositories = [];
    let loading = false;
    let error = null;
    /* Method for searching repositories */
    async function searchRepositories() {
        loading = true;
        error = null;
        repositories = [];
        try {
          /* Getting the asnwer from github */
          const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
          const data = await response.json();
          repositories = data.items;
        } catch (err) {
            error = 'Failed to fetch repositories';
        } finally {
            loading = false;
        }
    }
     /* Method from the buttom */
    function handleSubmit(event) {
      event.preventDefault();
      searchRepositories();
    }
</script>
<!-- Search format-->
<form on:submit={handleSubmit} class="flex-max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mb-6">
    <div class="flex">
        <input type="search" class="placeholder:italic placeholder:text-slate-400 bg-white border border-slate-300 
            rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 
            sm:text-sm flex-grow" bind:value={query} placeholder="Search for repositories..." required />
        <button type="submit" disabled={loading} class="ml-2 bg-blue-500 text-white rounded-md py-2 px-4 shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm">
                Search
        </button>
    </div>
</form>

<div class="items-center">
    <img src="/logoGitHub.webp" alt="404 Image" class="mx-auto mb-6 w-2/2 max-w-xs"/>
</div>
<!-- Loading text -->  
{#if loading}
   <p class="text-center">Loading...</p>
{/if}
<!-- Error text -->  
{#if error}
   <p class="text-center text-red-500">{error}</p>
{/if}
<!-- Panel for showing the searching --> 
<ul class="flex-max-w-lg mx-auto">
   {#each repositories as repo}
      <li class="bg-white p-4 mb-4 shadow-md rounded-lg">
         <strong class="block text-xl">{repo.name}</strong>
         <p class="text-gray-700">{repo.description}</p>
        <div class="flex justify-between text-sm mt-2">
           <span>⭐ {repo.stargazers_count}</span>
           <span>🍴 {repo.forks_count}</span>
           <span>🐛 {repo.open_issues_count}</span>
        </div>
      </li>
   {/each}
</ul>
  
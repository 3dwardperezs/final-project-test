<script>
    import { onMount } from 'svelte';
    let iconVisible = true;
  
    onMount(() => {
        const timer = setInterval(() => {
          iconVisible = !iconVisible;
        }, 1000); 
        return () => clearInterval(timer);
    });
</script>

<div class="icon-container">
    <a href="/ContactPage" aria-label="Contact Us" class={iconVisible ? 'block' : 'hidden'}>
      <i class="fas fa-question-circle icon"></i>
    </a>
</div>
  
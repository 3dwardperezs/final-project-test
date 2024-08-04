<script>
   import { onMount } from 'svelte';
   /* Variables */
   let city = 'Dublin'; // Default city
   let weatherData = null;
   let error = null;
   let temporizador = null;
   let pictureWeather;
   let weatherName;
   let feelsLike;
   let tempMIN;
   let tempMAX;
   let presure;
   let windSpeed;
   let Description;
   let country;
   let Main;
   let Humidity;
   let Visibility;

   const apiKey = 'a9deca3ab6d645f7207d0d27ee7da414'; // Api key

   async function fetchWeather() {
      try {
        /* Getting asnwer from openweathermap*/
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }
          weatherData = await response.json();

          temporizador = weatherData.main.temp +"°C";
          pictureWeather = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
          weatherName = weatherData.name;
          feelsLike = weatherData.main.feels_like.toFixed();
          tempMIN = weatherData.main.temp_min;
          tempMAX = weatherData.main.temp_max;
          presure = weatherData.main.pressure;
          windSpeed = weatherData.wind.speed.toFixed();
          Description = weatherData.weather[0].description;
          country = weatherData.sys.country;
          Main = weatherData.weather[0].main;
          Humidity = weatherData.main.humidity;
          Visibility = weatherData.visibility.toFixed();
        
      } catch (err) {
        console.error('Error fetching weather data:', err);
        error = err.message;
      }
   }

   onMount(() => {
     fetchWeather();
   });
   /* Method for getting the results*/
   function handleSearch(event) {
     event.preventDefault();
     fetchWeather();
   }
</script>
<!-- Searching panel -->
<form on:submit={handleSearch} class="flex-max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mb-6">
   <div class="flex w-full">
      <input 
      type="search" 
      class="placeholder:italic placeholder:text-slate-400 bg-white border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm flex-grow" 
      bind:value={city} 
      placeholder="Enter city name..." 
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
<!-- Weather panel -->
<div class="Flex-max-w-lg w-full rounded overflow-hidden shadow-lg bg-white mx-auto p-4">
   <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div class="flex flex-col items-center sm:items-start">
         <p class="text-4xl font-semibold">{weatherName},{country}</p> 
         <p class="text-sm">{Description}</p>
         <picture>
           <img class="w-40 h-40 rounded-full" src={pictureWeather} alt={temporizador} />
         </picture>
         <h1 class="text-5xl font-semibold">{temporizador}</h1>
      </div>
   
   <div class="flex flex-col sm:flex-row md:flex-col items-center sm:items-start">
      <h1 class="text-3xl font-semibold mb-2">Temperature Details:</h1>
      <div class="flex flex-col items-center sm:items-start">
          <div class="flex items-center">
            <h2 class="text-xl">Feels like: </h2>
            <span class="font-bold text-xl">{feelsLike}°C</span>
          </div>
          <div class="flex items-center">
            <h2 class="text-xl">Main: </h2>
            <span class="font-bold text-xl">{Main}</span>
          </div>
          <div class="flex items-center">
            <h2 class="text-xl">Temperature Min: </h2>
            <span class="font-bold text-xl">{tempMIN}°C</span>
          </div>
          <div class="flex items-center">
            <h2 class="text-xl">Temperature Max: </h2>
            <span class="font-bold text-xl">{tempMAX}°C</span>
          </div>
      </div>
    </div>
   
    <div class="flex flex-col sm:flex-row md:flex-col items-center sm:items-start">
       <h1 class="text-3xl font-semibold mb-2">Additional Info:</h1>
       <div class="flex flex-col items-center sm:items-start">
          <div class="flex items-center">
             <h2 class="text-xl">Pressure: </h2>
             <span class="font-bold text-xl">{presure} hPa</span>
          </div>
          <div class="flex items-center">
             <h2 class="text-xl">Wind Speed: </h2>
             <span class="font-bold text-xl">{windSpeed} KPH</span>
          </div>
          <div class="flex items-center">
             <h2 class="text-xl">Humidity: </h2>
             <span class="font-bold text-xl">{Humidity}%</span>
          </div>
          <div class="flex items-center">
             <h2 class="text-xl">Visibility: </h2>
             <span class="font-bold text-xl">{Visibility}</span>
          </div>
      </div>
    </div>
   </div>
</div>

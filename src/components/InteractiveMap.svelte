<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    /* Variables*/
    let map;
    let markers = [];
    let markerLayer;
    let searchQuery= '';
  
    onMount(() => {
      map = L.map('map').setView([53.3498, -6.2603], 13); //Initialice with Dublin as default
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      markerLayer = L.layerGroup().addTo(map);
      map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          promptForAnnotation(lat, lng);
      });
    });
    /* Method for puting a new annotation into the map*/
    function promptForAnnotation(lat, lng) {
        const annotation = prompt('Enter annotation:');
        if (annotation !== null && annotation.trim() !== '') {
            const marker = L.marker([lat, lng]).addTo(markerLayer);
            marker.bindPopup(annotation).openPopup();
            markers.push({ lat, lng, marker });
        }
    }
    /* Method for cleaning the annotations into the map*/
    function clearMarkers() {
        markerLayer.clearLayers();
        markers = [];
    }
    /* Method for searching new location into the map*/
    async function searchLocation() {
       const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
       const results = await response.json();//Getting the asnwer
       if (results.length > 0) {
          const { lat, lon } = results[0];
          map.setView([lat, lon], 13);
       }else {
          alert('Location not found');
       }
    }
</script>
<!-- Details section-->
<div class="description">
   <p>Use the interactive map below to add and view annotated data:</p>
   <ul>
      <li>Click on the map to add a marker at that location. You will be prompted to enter an annotation for the marker.</li>
      <li>Use the search box at the bottom-right corner to find a specific location by entering its name and clicking "Search".</li>
      <li>Click the "Clear Markers" button at the top-right corner to remove all markers from the map.</li>
   </ul>
</div>
<!-- Map section-->
<div class="map-container">
   <div id="map"></div>
      <button on:click={clearMarkers} class="clear-markers-button">Clear Markers</button>
      <div class="control-buttons">
         <input type="text" bind:value={searchQuery} placeholder="Search location" />
         <button on:click={searchLocation}>Search</button>
      </div>
</div>

  
  
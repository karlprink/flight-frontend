<template>
  <div class="filters">
    <label>
      Sihtkoht:
      <input type="text" v-model="filters.destination" />
    </label>
    <label>
      Kuupäev:
      <input type="date" v-model="filters.date" />
    </label>
    <label>
      Lennuaeg:
      <input type="time" v-model="filters.time" />
    </label>
    <label>
      Hind:
      <input type="number" v-model="filters.price" />
    </label>
    <button @click="applyFlightFilters">Rakenda filtrid</button>
  </div>
</template>


<script>
export default {
  props: ['filters', 'applyFlightFilters'],
};
</script>

<style>
.filters {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.filters label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
  color: #333;
}

.filters input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 5px;
  font-size: 1em;
}

.filters button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
}

.filters button:hover {
  background-color: #0056b3;
}

</style>
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
}
</style>
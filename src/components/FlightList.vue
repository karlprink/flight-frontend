<template>
  <div>
    <h1>Lennuplaan</h1>
    <div class="flights">
      <div v-for="(flight, index) in filteredFlights" :key="index" @click="selectFlight(flight)">
        {{ flight.destination }} - {{ flight.departure }} - {{ flight.arrival }} - €{{ flight.price }} - {{ flight.airline }}
      </div>
    </div>
  </div>
</template>

<script setup>

const emit = defineEmits("selectFlight")

const selectFlight = (flight) => {
  emit("selectFlight", flight)
};
</script>

<style>
.flights {
  display: flex;
  flex-direction: column;
}
.flights div {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>

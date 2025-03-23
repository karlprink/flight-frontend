<!--
See Vue.js komponent kuvab lennuplaani. Lennuplaani on võimalik filtreerida.

Stiili loomisel kasutatud AI abi.
-->


<template>
  <h1>Lennuplaan</h1>
  <div class="list">
    <div class="flights">
      <div
          v-for="(flight, index) in filteredFlights"
          :key="index"
          @click="selectFlight(flight)"
          class="flight-item"
      >
        {{ flight.destination }} - {{ flight.departure }} - {{ flight.arrival }} - €{{ flight.price }} - {{ flight.airline }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  filteredFlights: Array,
});

const emit = defineEmits(["selectFlight"]);

const selectFlight = (flight) => {
  emit("selectFlight", flight);
};
</script>

<style>
.list {
  display: flex;
  justify-content: center;
}

.flights {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: fit-content;
}
.flights div {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>

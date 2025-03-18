<template>
  <div>
    <SeatFilters :seatFilters="seatFilters" @applySeatFilters="applySeatFilters" />
    <SeatMap :seats="seats" @selectSeat="selectSeat" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import SeatFilters from "../components/SeatFilters.vue";
import SeatMap from "../components/SeatMap.vue";
import {useRoute} from "vue-router";

const route = useRoute();
const flightId = route.params.flightId;

const seats = ref([]);
const seatFilters = ref({
  window: false,
  legroom: false,
  exit: false,
  groupSize: 1,
});

const fetchSeats = async (flightId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/flights/${flightId}/seats`);
    seats.value = response.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
  }
};

const selectSeat = (seat) => {
  if (!seat.occupied) {
    alert(`Valisid istekoha: ${seat.label}`);
  }
};

const applySeatFilters = () => {
  const recommendedSeats = seats.value.filter((seat) => {
    if (seatFilters.value.window && seat.type !== "window") return false;
    if (seatFilters.value.legroom && seat.type !== "legroom") return false;
    if (seatFilters.value.exit && seat.type !== "exit") return false;
    return !seat.occupied;
  });

  alert(`Soovitatud istekohad: ${recommendedSeats.map((seat) => seat.label).join(", ")}`);
};

onMounted(() => fetchSeats(flightId));
</script>

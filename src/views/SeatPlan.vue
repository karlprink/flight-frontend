<template>
  <div>
    <SeatFilters v-model="seatFilters" @applySeatFilters="applySeatFilters" />
    <SeatMap :seats="filteredSeats" @selectSeat="selectSeat" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import SeatFilters from "../components/SeatFilters.vue";
import SeatMap from "../components/SeatMap.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const flightId = route.params.flightId;

const seats = ref([]);
const seatFilters = ref({
  business: false, // Default value for business class
  window: false,
  legroom: false,
  exit: false,
  groupSize: 1,
});

// Istekohtade päring API-st
const fetchSeats = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/flights/${flightId}/seats`);
    seats.value = response.data;
  } catch (error) {
    console.error("Error fetching seats:", error);
  }
};

// Filtreeritud istekohad
const filteredSeats = computed(() => {
  return seats.value.map((seat) => {
    const matchesBusiness = !seatFilters.value.business || seat.seatClass.toLowerCase() === 'business';
    const matchesWindow = !seatFilters.value.window || seat.closeToWindow;
    const matchesLegroom = !seatFilters.value.legroom || seat.extraLegRoom;
    const matchesExit = !seatFilters.value.exit || seat.closeToExit;

    const isMatching = matchesBusiness && matchesWindow && matchesLegroom && matchesExit && seat.available;

    return { ...seat, isMatching };
  });
});

const selectSeat = (seat) => {
  if (seat.available) {
    alert(`Valisid istekoha: ${seat.seatNumber}`);
  }
};

const applySeatFilters = () => {
  alert(`Soovitatud istekohad: ${filteredSeats.value.map((seat) => seat.seatNumber).join(", ")}`);
};

onMounted(fetchSeats);
</script>
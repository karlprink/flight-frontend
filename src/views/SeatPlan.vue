<!--
See Vue.js komponent kuvab istmefiltrid ja istmeplaani.
Kasutajad saavad filtreerida istmeid erinevate kriteeriumite alusel ja valida istme.

Stiili loomisel kasutatud AI abi.
-->


<template>
  <div>
    <SeatFilters v-model="seatFilters" @applySeatFilters="applySeatFilters" />
    <SeatMap :seats="filteredSeats" :flightId="flightId" @selectSeat="selectSeat" />
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
  business: false,
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


const findAdjacentSeats = (seats, groupSize) => {
  const rows = seats.reduce((acc, seat) => {
    const rowNumber = seat.seatNumber.match(/\d+/)[0];
    if (!acc[rowNumber]) acc[rowNumber] = [];
    acc[rowNumber].push(seat);
    return acc;
  }, {});

  const adjacentSeats = [];
  for (const row in rows) {
    const sortedRow = rows[row].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
    for (let i = 0; i <= sortedRow.length - groupSize; i++) {
      const group = sortedRow.slice(i, i + groupSize);
      if (group.every(seat => seat.available)) {
        adjacentSeats.push(...group);
        i += groupSize - 1;
      }
    }
  }
  return adjacentSeats;
};

// Filtreeritud istekohad
const filteredSeats = computed(() => {
  const individualFilteredSeats = seats.value.map((seat) => {
    const matchesBusiness = !seatFilters.value.business || seat.seatClass.toLowerCase() === 'business';
    const matchesWindow = !seatFilters.value.window || seat.closeToWindow;
    const matchesLegroom = !seatFilters.value.legroom || seat.extraLegRoom;
    const matchesExit = !seatFilters.value.exit || seat.closeToExit;

    const isMatching = matchesBusiness && matchesWindow && matchesLegroom && matchesExit && seat.available;

    return { ...seat, isMatching };
  });

  if (seatFilters.value.groupSize > 1) {
    const adjacentSeats = findAdjacentSeats(individualFilteredSeats, seatFilters.value.groupSize);
    return individualFilteredSeats.map(seat => ({
      ...seat,
      isMatching: adjacentSeats.includes(seat)
    }));
  }

  return individualFilteredSeats;
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

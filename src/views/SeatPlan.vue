<template>
  <div>
    <SeatFilters :seatFilters="seatFilters" @applySeatFilters="applySeatFilters" />
    <SeatMap :seats="seats" @selectSeat="selectSeat" />
  </div>
</template>

<script>
import SeatFilters from '../components/SeatFilters.vue';
import SeatMap from '../components/SeatMap.vue';
import axios from "axios";

export default {
  components: {
    SeatFilters,
    SeatMap,
  },
  data() {
    return {
      seats: this.generateSeats(),
      seatFilters: {
        window: false,
        legroom: false,
        exit: false,
        groupSize: 1,
      },
    };
  },
  methods: {
    async fetchSeats() {
      try {
        const response = await axios.get('http://localhost:8080/api/flights/SeatsByFlightId');
        this.seats = response.data;
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    },
    selectSeat(seat) {
      if (!seat.occupied) {
        alert(`Valisid istekoha: ${seat.label}`);
      }
    },
    applySeatFilters() {
      const recommendedSeats = this.seats.filter((seat) => {
        if (this.seatFilters.window && seat.type !== 'window') return false;
        if (this.seatFilters.legroom && seat.type !== 'legroom') return false;
        if (this.seatFilters.exit && seat.type !== 'exit') return false;
        return !seat.occupied;
      });
      alert(`Soovitatud istekohad: ${recommendedSeats.map((seat) => seat.label).join(', ')}`);
    },
  },
};
</script>
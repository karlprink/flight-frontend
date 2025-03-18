<template>
  <div>
    <FlightFilters :filters="filters" @applyFlightFilters="applyFlightFilters" />
    <FlightList :filteredFlights="filteredFlights" @selectFlight="selectFlight" />
  </div>
</template>

<script>
import axios from 'axios';
import FlightFilters from '../components/FlightFilters.vue';
import FlightList from '../components/FlightList.vue';
import router from "@/router.js";

export default {
  components: {
    FlightFilters,
    FlightList,
  },
  data() {
    return {
      filters: {
        destination: '',
        date: '',
        time: '',
        price: null,
      },
      flights: [],
      selectedFlight: null,
    };
  },
  computed: {
    filteredFlights() {
      return this.flights.filter((flight) => {
        return (
            (!this.filters.destination || flight.destination.includes(this.filters.destination)) &&
            (!this.filters.date || flight.date === this.filters.date) &&
            (!this.filters.time || flight.time === this.filters.time) &&
            (!this.filters.price || flight.price <= this.filters.price)
        );
      });
    },
  },
  methods: {
    async fetchFlights() {
      try {
        const response = await axios.get('http://localhost:8080/api/flights');
        this.flights = response.data;
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    },
    applyFlightFilters() {
      // Filtrid rakendatakse automaatselt computed property kaudu
    },
    selectFlight(flight) {
      router.push({ name: "SeatPlan", params: { flightId: flight.id } })
    },
  },
  created() {
    this.fetchFlights();
  },
};
</script>

<style>
.filters {
  margin-bottom: 20px;
}
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
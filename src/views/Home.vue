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
  padding: 10px;
  background-color: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.flights {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flights div {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.flights div:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #e6f7ff;
}

.flights div:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.flights div h3 {
  margin: 0;
  font-size: 1.2em;
  color: #333;
  font-weight: bold;
}

.flights div p {
  margin: 5px 0 0;
  color: #666;
  font-size: 1em;
}

.flights div:nth-child(odd) {
  background-color: #f9f9f9;
}

.flights div:nth-child(even) {
  background-color: #f0f8ff;
}


</style>
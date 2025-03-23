<!--
See komponent kuvab lennufiltrid ja lennuloendi.
Kasutajad saavad filtreerida lende erinevate kriteeriumite alusel ja valida lennu, et näha istmete plaani.

Stiili loomisel kasutatud AI abi.
-->

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
      error: null,
    };
  },
  computed: {
    filteredFlights() {
      return this.flights.filter((flight) => {
        const { destination, date, time, price } = this.filters;


        let flightDate = flight.departure ? new Date(flight.departure).toISOString().split("T")[0] : "";
        let flightTime = flight.departure ? new Date(flight.departure).toISOString().split("T")[1].slice(0, 5) : "";

        return (
            (!destination || flight.destination.toLowerCase().includes(destination.toLowerCase())) &&
            (!date || flightDate === date) &&
            (!time || flightTime === time) &&
            (!price || flight.price <= price)
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
        this.error = "Lennupiletite laadimine ebaõnnestus!";
      }
    },
    applyFlightFilters() {
    },
    selectFlight(flight) {
      router.push({ name: "SeatPlan", params: { flightId: flight.id } });
    },
  },
  created() {
    this.fetchFlights();
  },
};
</script>

<style>
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
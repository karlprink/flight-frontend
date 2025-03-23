<!--
See komponent kuvab modaalakna, kus kasutajad saavad sisestada oma nime ja kinnitada istmete broneeringu.
Komponent kuvab valitud istmete koguhinna ja istmete üksikasjad.

Stiili loomisel kasutatud AI abi.
-->

<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Sisestage oma nimi</h2>
      <input type="text" v-model="passengerName" placeholder="Teie nimi" aria-label="Passenger Name" />

      <p v-if="priceLoading">Laen hinda...</p>
      <p v-if="!priceLoading && !isError">Hind kokku: {{ price }} eur</p>
      <p v-if="isError">Hinna laadimine ebaõnnestus</p>

      <h3>Valitud istmed:</h3>
      <ul>
        <li v-for="seat in seats" :key="seat.id">
          Iste: {{ seat.seatNumber }} ({{ seat.seatClass }})
        </li>
      </ul>

      <p v-if="seats.length === 0">Palun valige vähemalt üks iste!</p>

      <button @click="confirmBooking" :disabled="priceLoading || !passengerName.trim()">Kinnita</button>
      <button class="close" @click="$emit('close')">Tühista</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { defineEmits, defineProps } from "vue";
import axios from "axios";

const props = defineProps({
  seats: Array,
});

const passengerName = ref("");
const priceLoading = ref(true);
const price = ref();
const isError = ref(false);

const emits = defineEmits(["confirm"]);

const getTotalPrice = () => {
  priceLoading.value = true;
  isError.value = false;

  const seatIds = props.seats.map(seat => seat.id);
  axios.post(`http://localhost:8080/flights/${props.seats[0].flightId}/seats/totalprice`, { seatIds })
      .then(response => {
        price.value = response.data.totalPrice;
      })
      .catch(e => {
        isError.value = true;
        console.error(e);
      })
      .finally(() => priceLoading.value = false);
};

const confirmBooking = () => {
  if (passengerName.value.trim() === "") {
    alert("Palun sisestage oma nimi!");
    return;
  }
  emits("confirm", passengerName.value);
};

onMounted(() => {
  getTotalPrice();
});
</script>
<style>

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  z-index: 10000;
}

.modal-content {
  text-align: center;
}

.modal input {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
}

.modal button {
  margin: 5px;
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}

.modal .close {
  background-color: red;
}
</style>

<template>
  <div>
    <h1>Istekohtade plaan</h1>
    <div class="plane">
      <div
          v-for="(seat, index) in seats"
          :key="index"
          :class="['seat', seat.type, { occupied: seat.occupied }]"
          @click="selectSeat(seat)"
      >
        {{ seat.label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['seats'],
  methods: {
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

<style>
.plane {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}
.seat {
  width: 50px;
  height: 50px;
  background-color: lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.seat.window {
  background-color: lightblue;
}
.seat.legroom {
  background-color: lightgreen;
}
.seat.exit {
  background-color: lightcoral;
}
.seat.occupied {
  background-color: darkgray;
  cursor: not-allowed;
}
</style>
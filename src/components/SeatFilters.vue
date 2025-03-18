<template>
  <div class="seat-filters">
    <label>
      <input type="checkbox" v-model="seatFilters.window" />
      Istekoht akna all
    </label>
    <label>
      <input type="checkbox" v-model="seatFilters.legroom" />
      Rohkem jalaruumi
    </label>
    <label>
      <input type="checkbox" v-model="seatFilters.exit" />
      Lähedal väljapääsule
    </label>
    <label>
      <input type="number" v-model="seatFilters.groupSize" min="1" />
      Istekohad kõrvuti
    </label>
    <button @click="applySeatFilters">Rakenda filtrid</button>
  </div>
</template>

<script>
export default {
  props: ['seatFilters', 'applySeatFilters'],
};
</script>

<style>
.seat-filters {
  margin-top: 20px;
}
</style>
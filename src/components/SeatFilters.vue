<!--
See komponent võimaldab kasutajatel filtreerida istmeid erinevate kriteeriumite alusel.

Stiili loomisel kasutatud AI abi.
-->

<template>
  <div class="seat-filters">
    <label>
      <input type="checkbox" v-model="modelValue.business" />
      Business klass
    </label>
    <label>
      <input type="checkbox" v-model="modelValue.window" />
      Istekoht akna all
    </label>
    <label>
      <input type="checkbox" v-model="modelValue.legroom" />
      Rohkem jalaruumi
    </label>
    <label>
      <input type="checkbox" v-model="modelValue.exit" />
      Lähedal väljapääsule
    </label>
    <label>
      <input type="number" v-model.number="modelValue.groupSize" min="1" />
      Istekohad kõrvuti
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      business: false,
      window: false,
      legroom: false,
      exit: false,
      groupSize: 1
    })
  }
})
</script>


<style>
.seat-filters {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.seat-filters label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
  color: #333;
}

.seat-filters input[type="checkbox"] {
  margin-right: 10px;
}

.seat-filters input[type="number"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.seat-filters button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
}

.seat-filters button:hover {
  background-color: #0056b3;
}
</style>
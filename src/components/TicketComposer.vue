<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Sisestage oma nimi</h2>
      <input type="text" v-model="passengerName" placeholder="Teie nimi" />
      <button @click="confirmBooking">Kinnita</button>
      <button class="close" @click="$emit('close')">Tühista</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["seat"],
  data() {
    return {
      passengerName: "",
    };
  },
  methods: {
    confirmBooking() {
      if (this.passengerName.trim() === "") {
        alert("Palun sisestage oma nimi!");
        return;
      }
      this.$emit("confirm", this.passengerName);
    },
  },
};
</script>

<style>
/* Modaalaken */
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
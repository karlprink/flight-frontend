<template>
  <div>
    <h1>Istekohtade plaan</h1>
    <div class="plane" @mousemove="updateTooltipPosition">
      <div
          v-for="(seat, index) in seats"
          :key="index"
          :class="[
            'seat',
            seat.seatClass.toLowerCase(),
            {
              available: seat.available,
              window: seat.closeToWindow,
              legroom: seat.extraLegRoom,
              exit: seat.closeToExit,
              occupied: !seat.available
            }
          ]"
          :style="{
            opacity: seat.isMatching ? '1' : '0.3',
            cursor: seat.isMatching ? 'pointer' : 'not-allowed',
            pointerEvents: seat.isMatching ? 'auto' : 'none'
          }"
          @click="selectSeat(seat)"
          @mouseover="showTooltip(seat)"
          @mouseleave="hideTooltip"
      >
        {{ seat.seatNumber }}
      </div>
    </div>
    <!-- Et popup menüü oleks nähtav ehk kõigi elementide peal-->
    <div
        v-if="tooltip.visible"
        class="tooltip"
        :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
    >
      <p>Iste: {{ tooltip.seatNumber }}</p>
      <p>Klass: {{ tooltip.seatClass }}</p>
      <p>Akna ääres: {{ tooltip.closeToWindow ? 'Jah' : 'Ei' }}</p>
      <p>Rohkem jalaruumi: {{ tooltip.extraLegRoom ? 'Jah' : 'Ei' }}</p>
      <p>Väljapääsu lähedal: {{ tooltip.closeToExit ? 'Jah' : 'Ei' }}</p>
    </div>

    <!-- Pileti dialoogivorm -->
    <TicketComposer
        v-if="formVisible"
        :seat="selectedSeat"
        @close="formVisible = false"
        @confirm="generateTicket"
    />

    <!-- Pileti väljatrükk -->
    <div v-if="ticket" class="ticket">
      <h2>Teie pilet</h2>
      <p><strong>Nimi:</strong> {{ ticket.name }}</p>
      <p><strong>Istekoht:</strong> {{ ticket.seatNumber }}</p>
      <p><strong>Klass:</strong> {{ ticket.class }}</p>
      <p><strong>Hind:</strong> {{ ticket.price }}€</p>
    </div>
  </div>
</template>


<script>
import TicketComposer from "./TicketComposer.vue";

export default {
  components : {TicketComposer},
  props: ['seats'],
  data() {
    return {
      tooltip: {
        visible: false,
        seatNumber: null,
        seatClass: '',
        available: false,
        closeToWindow: false,
        extraLegRoom: false,
        closeToExit: false,
        x: 0,
        y: 0
      }
    };
  },
  methods: {
    selectSeat(seat) {
      if (seat.available) {
        this.selectedSeat = seat;
        this.formVisible = true;

      }
    },
    showTooltip(seat) {
      this.tooltip.visible = true;
      this.tooltip.seatNumber = seat.seatNumber;
      this.tooltip.seatClass = seat.seatClass;
      this.tooltip.available = seat.available;
      this.tooltip.closeToWindow = seat.closeToWindow;
      this.tooltip.extraLegRoom = seat.extraLegRoom;
      this.tooltip.closeToExit = seat.closeToExit;
    },
    hideTooltip() {
      this.tooltip.visible = false;
    },
    updateTooltipPosition(event) {
      const planeRect = event.currentTarget.getBoundingClientRect();
      this.tooltip.x = event.clientX + 10;
      this.tooltip.y = event.clientY + 10;
    },
    generateTicket(passengerName) {
      this.ticket = {
        name: passengerName,
        seatNumber: this.selectedSeat.seatNumber,
        class: this.selectedSeat.seatClass,
        price: this.selectedSeat.price,
      };
      this.selectedSeat.available = false;
      this.formVisible = false;
    },
  }
};
</script>

<style>
.plane {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  background-color: #f0f8ff;
  padding: 20px;
  border-radius: 10px;
  width: fit-content;
  margin: auto;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* General seat style */
.seat {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-weight: bold;
  border: 1px solid #333;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.seat:hover {
  transform: scale(1.1);
  background-color: #e6f7ff;
}

/* Business class */
.seat.business {
  background-color: #ffd700;
  border: 2px solid #b8860b;
}

/* Economy class */
.seat.economy {
  background-color: #76a621;
}

/* Window seats */
.seat.window {
  background-color: #add8e6;
}

/* Extra legroom */
.seat.legroom {
  margin-top: 20px;
}

/* Layout: 3 seats on the left, aisle, 2 seats on the right */
/* Leave the fourth seat in each row for the aisle */
.seat:nth-child(5n + 4) {
  margin-left: 20px;
}


.tooltip {
  position: fixed;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  pointer-events: none;
}

</style>
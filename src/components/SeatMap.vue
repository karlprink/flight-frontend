<!--
See Vue.js komponent kuvab istmete plaani ja võimaldab kasutajatel valida istmeid.
Kasutajad saavad klõpsata istmetel, et neid valida või tühistada, ning kinnitada oma valiku.

Stiili loomisel kasutatud AI abi.
-->

<template>
  <div>
    <h1>Istekohtade plaan</h1>
    <div class="selection-container">
      <div class="plane" @mousemove="updateTooltipPosition">
        <div
            v-for="(seat, index) in sortedSeats"
            :key="index"
            :class="[...seatClasses(seat)]"
            :style="seatStyles(seat)"
            @click="toggleSeatSelection(seat)"
            @mouseover="showTooltip(seat)"
            @mouseleave="hideTooltip"
        >
          {{ seat.seatNumber }}
        </div>
      </div>

      <div class="selectedSeats">
        <h1>Valitud istmed</h1>
        <div v-if="selectedSeats.length" class="selection-container">
          <div v-for="(seat, index) in selectedSeats" :key="index" class="seat selected">
            {{ seat.seatNumber }}
          </div>
        </div>
        <button @click="openTicketComposer">Kinnita valik</button>
        <button class="close" @click="cancelSelection">Tühista</button>
      </div>
    </div>
  </div>

  <div v-if="tooltip.visible" class="tooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
    <p>Iste: {{ tooltip.seatNumber }}</p>
    <p>Klass: {{ tooltip.seatClass }}</p>
    <p>Akna ääres: {{ tooltip.closeToWindow ? 'Jah' : 'Ei' }}</p>
    <p>Rohkem jalaruumi: {{ tooltip.extraLegRoom ? 'Jah' : 'Ei' }}</p>
    <p>Väljapääsu lähedal: {{ tooltip.closeToExit ? 'Jah' : 'Ei' }}</p>
    <p>Hinnalisa: {{ tooltip.price}} €</p>
  </div>

  <TicketComposer
      v-if="formVisible"
      :seats="selectedSeats"
      @confirm="confirmSelection"
      @close="formVisible = false"
  />
</template>

<script>
import TicketComposer from "./TicketComposer.vue";
import axios from "axios";

export default {
  components: { TicketComposer },
  props: ['seats', 'flightId', 'flights'],
  emits: ['selectSeat'],
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
        totalPrice: 0,
        x: 0,
        y: 0
      },
      formVisible: false,
      selectedSeat: undefined,
      selectedSeats: []
    };
  },
  computed: {
    // Sorteerib istmed ID järgi
    sortedSeats() {
      return this.seats.sort((a, b) => a.id - b.id);
    }
  },
  methods: {
    // Vahetab istme valiku olekut
    toggleSeatSelection(seat) {
      if (!seat.available) return;
      const index = this.selectedSeats.indexOf(seat);
      if (index > -1) {
        this.selectedSeats.splice(index, 1);
      } else {
        this.selectedSeats.push(seat);
      }
    },
    // Avab piletivormi.
    openTicketComposer() {
      this.formVisible = true;
    },
    // Kinnitab istmed ja broneerib.
    confirmSelection(passengerName) {
      const seatIds = this.selectedSeats.map(seat => seat.id);


      const totalPrice = this.selectedSeats.reduce((total, seat) => total + seat.price, 0);

      axios.post(`http://localhost:8080/flights/${this.flightId}/seats/book`, { seatIds, passengerName, flightId: this.flightId })
          .then(response => {
            console.log("Seats booked successfully", response);
            this.formVisible = false;
            this.fetchFlightInfo(totalPrice);
          })
          .catch(error => {
            console.error("Error booking seats", error);
          });
    },

    // Toob lennu info ja kuvab hüpikakna
    fetchFlightInfo(totalPrice) {
      fetch(`http://localhost:8080/api/flights/${this.flightId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error("Failed to fetch flight data");
            }
            return response.json();
          })
          .then(flight => {
            const flightInfo = `
          Lennu number: ${flight.flightNumber}
          Lennufirma: ${flight.airline}
          Lennuki mudel: ${flight.aircraftModel}
          Päritolu: ${flight.origin}
          Sihtkoht: ${flight.destination}
          Väljumine: ${flight.departure}
          Saabumine: ${flight.arrival}
          Värav: ${flight.gate}

        `;

            const seatDetails = this.selectedSeats.map(seat => `
          Iste: ${seat.seatNumber}, Klass: ${seat.seatClass}
        `).join('\n');

            this.showPopup(flightInfo, seatDetails, totalPrice);
          })
          .catch(error => {
            console.error("Error fetching flight info", error);
          });
    },

    // Kuvab broneeringu andmed.
    showPopup(flightInfo, seatDetails) {
      const popupContent = `
      <div class="popup">
        <h2>Istmed on edukalt broneeritud!</h2>
        <h3>Lennu info:</h3>
        <pre>${flightInfo}</pre>
        <h3>Valitud istmed:</h3>
        <pre>${seatDetails}</pre>
        <button onclick="closePopup()">Sulge</button>
      </div>
    `;
      const popup = document.createElement('div');
      popup.innerHTML = popupContent;
      document.body.appendChild(popup);

      window.closePopup = function() {
        document.querySelector('.popup').remove();
        window.location.reload();
      };
    },


    cancelSelection() {
      this.selectedSeats.forEach(seat => seat.available = true);
      this.selectedSeats = [];
    },

    // Elementidest üle liikumisel kuvab istme info.
    showTooltip(seat) {
      this.tooltip.visible = true;
      this.tooltip.seatNumber = seat.seatNumber;
      this.tooltip.seatClass = seat.seatClass;
      this.tooltip.available = seat.available;
      this.tooltip.closeToWindow = seat.closeToWindow;
      this.tooltip.extraLegRoom = seat.extraLegRoom;
      this.tooltip.closeToExit = seat.closeToExit;
      this.tooltip.price = seat.price;
    },
    hideTooltip() {
      this.tooltip.visible = false;
    },
    updateTooltipPosition(event) {
      this.tooltip.x = event.clientX + 10;
      this.tooltip.y = event.clientY + 10;
    },
    seatClasses(seat) {
      return [
        'seat',
        seat.seatClass.toLowerCase(),
        {
          available: seat.available,
          window: seat.closeToWindow,
          legroom: seat.extraLegRoom,
          exit: seat.closeToExit,
          occupied: !seat.available,
          selected: this.selectedSeats.includes(seat)
        }
      ];
    },
    seatStyles(seat) {
      return {
        opacity: seat.isMatching ? '1' : '0.3',
        cursor: seat.isMatching ? 'pointer' : 'not-allowed',
        pointerEvents: seat.isMatching ? 'auto' : 'none'
      };
    }
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
  margin: 10px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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


.seat.business {
  background-color: #ffd700;
  border: 2px solid #b8860b;
}


.seat.economy {
  background-color: #76a621;
}


.seat.window {
  background-color: #add8e6;
}


.seat.legroom {
  margin-top: 20px;
}


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

.selection-container {
  display: flex;
  justify-content: center;
  margin: 10px;
}

.selectedSeats {
  padding: 20px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  height: fit-content;
  width: fit-content;
}

.selected {
  background-color: #ff6600 !important;
  color: white;
}
.selectedSeats button {
  padding: 10px 15px;
  background-color: green;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
  margin: 10px;
}
.selectedSeats button.close {
  background-color: red;
}

.selectedSeats button:hover {
  background-color: #005100;
}

.selectedSeats button.close:hover {
  background-color: #780000;
}
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.popup h2, .popup h3 {
  margin: 10px 0;
}

.popup pre {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
}

.popup button {
  padding: 10px 15px;
  background-color: green;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.popup button:hover {
  background-color: #005100;
}

</style>
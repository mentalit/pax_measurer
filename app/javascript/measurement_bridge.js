/* ---------------- MAIN BUTTON ATTACH ---------------- */

function attachMeasurementButtons() {

  // avoid duplicate listeners after turbo navigation
  document.querySelectorAll(".measure-btn").forEach(btn => {
    if (btn.dataset.bound) return
    btn.dataset.bound = "true"

    btn.addEventListener("click", async () => {

      const field = btn.dataset.field

      // 1️⃣ Try native Capacitor measurement first
      if (window.Capacitor?.Plugins?.RoomMeasure) {
        try {
          const result = await window.Capacitor.Plugins.RoomMeasure.startMeasurement()
          fillField(field, result.value)
          return
        } catch(e) {
          console.log("Native measurement unavailable, fallback to browser")
        }
      }

      // 2️⃣ Browser fallback measurement
      await browserMeasure(field)
    })
  })
}

/* ---------------- FIELD FILL ---------------- */

function fillField(field, value) {
  const input = document.querySelector(`[data-measure='${field}']`)
  if (!input) return
  input.value = value
  input.focus()
}

/* ---------------- CAPTURE UI ---------------- */

function showCaptureUI(field) {

  const overlay = document.createElement("div")
  overlay.id = "measure-overlay"

  overlay.innerHTML = `
    <div class="measure-panel">
      <div class="crosshair">+</div>
      <div id="angle-readout">0°</div>
      <button id="capture-btn">CAPTURE</button>
      <button id="cancel-btn">Cancel</button>
    </div>
  `

  document.body.appendChild(overlay)

  document.getElementById("capture-btn").onclick = () => {
    const radians = pitch * Math.PI / 180
    const h = parseFloat(document.getElementById("phone-height").value)

    if (!h) {
      alert("Enter your eye height first")
      return
    }

    const distance = Math.abs(h * Math.tan(radians)).toFixed(2)

    fillField(field, distance)
    overlay.remove()
  }

  document.getElementById("cancel-btn").onclick = () => overlay.remove()

  // live angle display
  const interval = setInterval(() => {
    const el = document.getElementById("angle-readout")
    if (!el) return clearInterval(interval)
    el.innerText = pitch.toFixed(1) + "°"
  }, 50)
}

/* ---------------- BROWSER MEASUREMENT ---------------- */

let pitch = 0
let motionReady = false

async function enableMotion() {
  if (motionReady) return true

  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    const res = await DeviceOrientationEvent.requestPermission()
    if (res !== "granted") return false
  }

  window.addEventListener("deviceorientation", e => {
    pitch = e.beta
  })

  motionReady = true
  return true
}

async function browserMeasure(field) {

  const ok = await enableMotion()
  if (!ok) {
    alert("Motion permission denied")
    return
  }

  // IMPORTANT: now we show the UI instead of measuring instantly
  showCaptureUI(field)
}

/* ---------------- TURBO EVENTS ---------------- */

document.addEventListener("turbo:load", attachMeasurementButtons)
document.addEventListener("turbo:frame-load", attachMeasurementButtons)
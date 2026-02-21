function attachMeasurementButtons() {


	alert("measurement js loaded")  
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

      // 2️⃣ Browser fallback measurement (iPhone Safari)
      await browserMeasure(field)
    })
  })
}

function fillField(field, value) {
  const input = document.querySelector(`[data-measure='${field}']`)
  if (!input) return
  input.value = value
  input.focus()
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

  const heightInput = document.getElementById("phone-height")
  const h = parseFloat(heightInput?.value)

  if (!h) {
    alert("Enter your eye height first")
    return
  }

  const ok = await enableMotion()
  if (!ok) {
    alert("Motion permission denied")
    return
  }

  alert("Aim the TOP EDGE of your phone at the base of the wall, then tap OK")

  const radians = pitch * Math.PI / 180
  const distance = Math.abs(h * Math.tan(radians)).toFixed(2)

  fillField(field, distance)
}

/* ---------------- TURBO EVENTS ---------------- */

// first page load
document.addEventListener("turbo:load", attachMeasurementButtons)

// after frame navigation
document.addEventListener("turbo:frame-load", attachMeasurementButtons)
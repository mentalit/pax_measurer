let pitch = 0
let motionReady = false
let phoneHeight = parseFloat(localStorage.getItem("phoneHeight")) || null

/* ---------------- MOTION ---------------- */

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

/* ---------------- UI ---------------- */

function showOverlay(text, captureCallback) {
  const overlay = document.createElement("div")
  overlay.id = "measure-overlay"

  overlay.innerHTML = `
    <div class="measure-panel">
      <div class="crosshair">+</div>
      <div class="instruction">${text}</div>
      <div id="angle-readout">0°</div>
      <button id="capture-btn">CAPTURE</button>
      <button id="cancel-btn">Cancel</button>
    </div>
  `

  document.body.appendChild(overlay)

  document.getElementById("capture-btn").onclick = () => {
    captureCallback()
    overlay.remove()
  }

  document.getElementById("cancel-btn").onclick = () => overlay.remove()

  const interval = setInterval(() => {
    const el = document.getElementById("angle-readout")
    if (!el) return clearInterval(interval)
    el.innerText = pitch.toFixed(1) + "°"
  }, 50)
}

/* ---------------- CALIBRATION ---------------- */

async function startCalibration() {

  const ok = await enableMotion()
  if (!ok) return alert("Motion permission required")

  let angleFloor, angleWall

  showOverlay("Aim at the floor at your feet", () => {
    angleFloor = pitch * Math.PI/180

    setTimeout(() => {
      showOverlay("Aim at the base of the wall", () => {
        angleWall = pitch * Math.PI/180

        // assume 0.5m horizontal foot distance from phone
        const footDistance = 0.5

        phoneHeight = Math.abs(
          footDistance * Math.tan(angleFloor) /
          (Math.tan(angleWall) - Math.tan(angleFloor))
        )

        localStorage.setItem("phoneHeight", phoneHeight)

        document.getElementById("calibration-status").innerText =
          "Calibrated ✓"
      })
    }, 300)
  })
}

/* ---------------- MEASUREMENT ---------------- */

function performMeasurement(field) {
  if (!phoneHeight) {
    alert("Please calibrate first")
    return
  }

  const radians = pitch * Math.PI/180
  const distance = Math.abs(phoneHeight * Math.tan(radians)).toFixed(2)

  const input = document.querySelector(`[data-measure='${field}']`)
  input.value = distance
  input.focus()
}

async function browserMeasure(field) {
  const ok = await enableMotion()
  if (!ok) return alert("Motion permission denied")

  showOverlay("Aim at the base of the wall", () => performMeasurement(field))
}

/* ---------------- BUTTON ATTACH ---------------- */

function attachMeasurementButtons() {

  document.querySelectorAll(".measure-btn").forEach(btn => {
    if (btn.dataset.bound) return
    btn.dataset.bound = "true"

    btn.onclick = () => browserMeasure(btn.dataset.field)
  })

  const calBtn = document.getElementById("start-calibration")
  if (calBtn && !calBtn.dataset.bound) {
    calBtn.dataset.bound = "true"
    calBtn.onclick = startCalibration
  }

  if (phoneHeight)
    document.getElementById("calibration-status").innerText = "Calibrated ✓"
}

document.addEventListener("turbo:load", attachMeasurementButtons)
document.addEventListener("turbo:frame-load", attachMeasurementButtons)
document.addEventListener("DOMContentLoaded", () => {
  if (!window.Capacitor) return

  document.querySelectorAll(".measure-btn").forEach(btn => {
    btn.addEventListener("click", async () => {

      const field = btn.dataset.field

      const result = await window.Capacitor.Plugins.RoomMeasure.startMeasurement()

      const input = document.querySelector(`[data-measure='${field}']`)
      input.value = result.value
      input.focus()
    })
  })
})
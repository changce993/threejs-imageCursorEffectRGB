import lerp from "./utils/lerp"

const cursor = document.querySelector(".cursor")
const circle = document.querySelector(".circle")

const { width, height } = cursor.getBoundingClientRect()
let cursornewx = width/2
let cursoroldx = cursornewx
let cursornewy = height/2
let cursoroldy = cursornewy

let circlenewx = width/2
let circleoldx = circlenewx
let circlenewy = height/2
let circleoldy = circlenewy

function updateCursor(e) {
  cursornewx = e.clientX
  cursornewy = e.clientY

  circlenewx = e.clientX
  circlenewy = e.clientY
}

window.addEventListener("mousemove", updateCursor)

function moveCursor() {
  requestAnimationFrame(moveCursor)
  cursoroldx = lerp(cursoroldx, cursornewx, 0.1)
  cursoroldy = lerp(cursoroldy, cursornewy, 0.1)

  cursor.style.top = `${cursoroldy}px`
  cursor.style.left = `${cursoroldx}px`

  circleoldx = lerp(circleoldx, cursornewx, 0.075)
  circleoldy = lerp(circleoldy, cursornewy, 0.075)

  circle.style.top = `${circleoldy}px`
  circle.style.left = `${circleoldx}px`
}

export default moveCursor

const dataEvents = [...document.querySelectorAll("[data-event]")]

dataEvents.forEach(evt => {
  const hover = evt.getAttribute("data-event")

  if(hover) {
    evt.addEventListener("mouseover", () => {
      circle.style.backgroundColor = "white"
      circle.style.width = "5rem"
      circle.style.height = "5rem"

      cursor.style.width = ".5rem"
      cursor.style.height = ".5rem"
    })

    evt.addEventListener("mouseleave", () => {
      circle.style.backgroundColor = "transparent"
      circle.style.width = "2rem"
      circle.style.height = "2rem"

      cursor.style.width = ".25rem"
      cursor.style.height = ".25rem"
    })
  }
})
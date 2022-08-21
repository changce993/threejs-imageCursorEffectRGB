import './style.scss'
import * as THREE from "three"
import images from "./js/images.js"
import vertexShader from "./js/shaders/vertex.js"
import fragmentShader from "./js/shaders/fragment.js"
import lerp from "./js/utils/lerp"
import customCursor from "./js/customCursor"

customCursor()

let cursor = { x: 0, y: 0 }
const { imageOne, imageTwo, imageThree, imageFour, imageFive } = images
const textureLoader = new THREE.TextureLoader()

const textureOne = textureLoader.load(imageOne)
const textureTwo = textureLoader.load(imageTwo)
const textureThree = textureLoader.load(imageThree)
const textureFour = textureLoader.load(imageFour)
const textureFive = textureLoader.load(imageFive)

class WebGL {
  constructor() {
    this.container = document.querySelector("main")
    this.links = [...document.querySelectorAll("li")]
    this.scene = new THREE.Scene()
    this.perspective = 1000
    this.sizes = new THREE.Vector2(0, 0)
    this.offset = new THREE.Vector2(0, 0)
    this.uniforms = {
      uTexture: { value: textureOne },
      uAlpha: { value: 0.0 },
      uOffset: { value: new THREE.Vector2(0.0, 0.0) },
    }
    this.links.forEach((link, idx) => {
      link.addEventListener("mousemove", () => {
        switch(idx) {
          case 0:
            this.uniforms.uTexture.value = textureOne
            break
          case 1:
            this.uniforms.uTexture.value = textureTwo
            break
          case 2:
            this.uniforms.uTexture.value = textureThree
            break
          case 3:
            this.uniforms.uTexture.value = textureFour
            break
          case 4:
            this.uniforms.uTexture.value = textureFive
            break
        }
      })
    })
    this.addEventListeners(document.querySelector("ul"))
    this.setupCamera()
    this.onMousemove()
    this.createMesh()
    this.render()
  }

  get viewport() {
    let width = window.innerWidth
    let height = window.innerHeight
    let aspect = width / height

    return { width, height, aspect }
  }

  onMousemove() {
    window.addEventListener("mousemove", (e) => {
      cursor.x = e.clientX
      cursor.y = e.clientY
    })
  }

  addEventListeners(element) {
    element.addEventListener("mouseenter", () => { this.linksHover = true })
    element.addEventListener("mouseleave", () => { this.linksHover = false })
  }

  setupCamera() {
    window.addEventListener("resize", this.windowResize.bind(this))

    let fov = (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI
    this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspect, 0.1, 1000)
    this.camera.position.set(0, 0, this.perspective)

    this.renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true })
    this.renderer.setSize(this.viewport.width, this.viewport.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.container.appendChild(this.renderer.domElement)
  }

  windowResize() {
    this.camera.aspect = this.viewport.aspect
    this.camera.fov = (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI
    this.renderer.setSize(this.viewport.width, this.viewport.height)
    this.camera.updateProjectionMatrix()
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 20, 20)
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.sizes.set(600, 450)
    this.mesh.scale.set(this.sizes.x, this.sizes.y)
    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.scene.add(this.mesh)
  }

  render() {
    this.offset.x = lerp(this.offset.x, cursor.x, 0.05)
    this.offset.y = lerp(this.offset.y, cursor.y, 0.05)

    this.uniforms.uOffset.value.set((cursor.x - this.offset.x) * 0.0005, -(cursor.y - this.offset.y) * 0.0005)
    this.mesh.position.set(this.offset.x - (window.innerWidth / 2), -this.offset.y + (window.innerHeight / 2))

    this.linksHover
      ? this.uniforms.uAlpha.value = lerp(this.uniforms.uAlpha.value, 1.0, 0.05)
      : this.uniforms.uAlpha.value = lerp(this.uniforms.uAlpha.value, 0.0, 0.05)

    this.links.forEach((link, idx) => {
      this.linksHover
        ? link.style.opacity = 0.1
        : link.style.opacity = 1
    })

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this))
  }
}

new WebGL()

import * as THREE from './threejs/three.module.js'
import {STLLoader} from './threejs/STLLoader.js'
import {OrbitControls} from './threejs/OrbitControls.js'

const socket = io()


let scene, camera, renderer, mesh, controls, light

let angulos, x, y, z

init()

function init() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xa0a0a0)
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    camera.position.set(0,50,100)
    
    light = new THREE.DirectionalLight(0xffffff)
    scene.add(light)
    let light2 = new THREE.DirectionalLight(0xffffff)
    light2.position.set(0, -50, 50)
    scene.add(light2)

    let grid = new THREE.GridHelper(1200,60)
    scene.add(grid)
    
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById('contenedor').appendChild(renderer.domElement)
    
    controls = new OrbitControls(camera, renderer.domElement)
}

function render() {
    socket.on('datos-giro', function (datos) {
        document.getElementById('datos').innerHTML = datos

        angulos = datos.split(' ')

        x = parseInt(angulos[1], 10)
        y = parseInt(angulos[2], 10)
        z = parseInt(angulos[3], 10)

        mesh.rotation.set( -z * Math.PI / 180, -x  * Math.PI / 180, -y * Math.PI / 180)

    })
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

let loader = new STLLoader()
loader.load('./models/boeing_tx1.STL', function (geometry) {
    mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({color: 0x00ff00})
    )

    mesh.scale.set(0.08, 0.08, 0.08)
    mesh.position.set(0,0,0)

    scene.add(mesh)

    render()
})
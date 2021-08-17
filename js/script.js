import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/FBXLoader.js';

//READ JSON FILE
async function loadJson() {
    try {
        let res = await fetch('https://raw.githubusercontent.com/summonidea/summon-family-browser/master/src/family_data.json')
        return await res.json();
    } catch (error) {
        console.log(error)
    }
}
//console.log(loadJson())

//RENDER FAMILY INFO IN HTML
async function renderFamilyInfo() {
    try {
        let familyJson = await loadJson()
        let familyArray = familyJson.families
        //console.log(familyArray)
    
        familyArray.forEach((family, index) => {
            
            let familyDiv = document.createElement("div")
            let renderFamName = document.createElement("h2")
            let render3d = document.createElement("span")
            familyDiv.id = "famDiv" + index
            renderFamName.id = "famName" + index
            render3d.id = "fam3d" + index
            let container = document.getElementById("familyCatalog");
            container.appendChild(familyDiv)
            familyDiv.appendChild(renderFamName)
            familyDiv.appendChild(render3d)
            document.getElementById(renderFamName.id).innerHTML = family.family_name
            
            renderFamName.addEventListener("click", (event) => {
                location.href = "/familydetail.html?id=" + index
            })
            //THREEJS SCENE

			let scene = new THREE.Scene();
			scene.background = new THREE.Color( 0x443333 );

			// Lights
			const hemiLight = new THREE.HemisphereLight( 0x443333, 0x111122 );
			scene.add( hemiLight );

            const light = new THREE.PointLight()
            light.position.set(0.8, 1.4, 1.0)
            scene.add(light)

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.1) 
            scene.add(ambientLight)
            
            // camera
            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            )
            camera.position.set(3, 3, 3)

            const renderer = new THREE.WebGLRenderer()
            renderer.setSize(400, 400)
            renderer.domElement.id = "famrenderer" + index
            familyDiv.appendChild(renderer.domElement)

            const controls = new OrbitControls(camera, renderer.domElement)
            controls.enableDamping = true
            controls.target.set(0, 1, 0)
            
            //FBX Loader
            const fbxLoader = new FBXLoader()
            fbxLoader.load(
                '../src/output_families/' + family.family_name + '.rfa.fbx',
                (object) => {

                    
                    object.traverse(function (child) {

                        if (child.isMesh) {

                            // switch the material here - you'll need to take the settings from the 
                            //original material, or create your own new settings, something like:
                            const oldMat = child.material;
                            
                            child.material = new THREE.MeshLambertMaterial({
                                color: oldMat.color,
                                map: oldMat.map,
                                //etc
                            });

                        }
                    });

                    scene.add(object)
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log(error)
                }
            )

            window.addEventListener('resize', onWindowResize, false)
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight
                camera.updateProjectionMatrix()
                renderer.setSize(400, 400)
                render()
            }

            //const stats = Stats()
            //document.body.appendChild(stats.dom)

            function animate() {
                requestAnimationFrame(animate)

                controls.update()

                render()

                //stats.update()
            }

            function render() {
                renderer.render(scene, camera)
            }

            animate()

            //document.getElementById(render3d.id).innerHTML = family.family_name

            console.log(family.family_name)
            
        });

    } catch (error) {
        console.log(error)
    }

}
renderFamilyInfo()


// var new_par = document.createElement("h2");
// new_par.id = "new_par";
// var greeter = document.getElementById("familyCatalog");
// greeter.appendChild(new_par);

// document.getElementById("new_par").innerHTML = "213213"
// document.getElementById("demo").innerHTML =
//     `The text from the intro paragraph is: ${new_par.id}`

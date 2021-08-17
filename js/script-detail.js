import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/FBXLoader.js';

//READ JSON FILE
async function loadJson() {
    try {
        let res = await fetch('https://raw.githubusercontent.com/summonidea/summon-family-browser/master/src/family_data.json')
        // let res = await fetch('./../src/family_data.json')
        return await res.json();
    } catch (error) {
        console.log(error)
    }
}
//console.log(loadJson())

function loadModel(family, index) {
    let familyDiv = document.getElementById("famDiv" + index)
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
    renderer.setSize(500, 500)
    renderer.domElement.id = "famrenderer" + index
    familyDiv.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 1, 0)
    
    //FBX Loader
    const fbxLoader = new FBXLoader()
    fbxLoader.load(
        '../src/output_families/' + family.family_name + '.fbx',
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
        renderer.setSize(500, 500)
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
}

// Builds the HTML Table out of myList json data from Ivy restful service.
function buildHtmlTable(family) {
    var table = document.getElementById("family-data");
    table.innerHTML = '';
    const rowType = document.createElement('tr');
    rowType.innerHTML = `
        <th colspan="3"><h2>${family.type_name}</h2></th>
    `;
    table.appendChild(rowType);

    const row = document.createElement('tr');
    row.innerHTML = `
        <th>Parameter name</th>
        <th>Value</th>
        <th>Parameter formula</th>
    `;
    table.appendChild(row);

    family.parameters.forEach(parameter => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${parameter.parameter_name}</td>
            <td>${parameter.value}</td>
            <td>${parameter.parameter_formula}</td>
        `;
        table.appendChild(row);
    });
}

//RENDER FAMILY INFO IN HTML
async function renderFamilyInfo() {
    try {
        let familyJson = await loadJson()
        let familyArray = familyJson.families
        //console.log(familyArray)

        var urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.has('id')) return;
        const index = urlParams.get('id');
        if (familyJson.families[index])
        var family = familyJson.families[index];

        let familyDiv = document.createElement("div")
        let renderFamName = document.createElement("h1")
        let render3d = document.createElement("span")
        familyDiv.id = "famDiv" + index
        renderFamName.id = "famName" + index
        render3d.id = "fam3d" + index
        let container = document.getElementById("familyCatalog");
        container.appendChild(familyDiv)
        familyDiv.appendChild(renderFamName)
        familyDiv.appendChild(render3d)
        document.getElementById(renderFamName.id).innerHTML = family.family_name

        const listTypes = document.getElementById('family-types');
        family.types.forEach(type => {
            const typeContent = document.createElement('div');
            typeContent.textContent = type.type_name;
            listTypes.appendChild(typeContent);
            typeContent.addEventListener('click', (event) => {
                buildHtmlTable(type);
            });
        });

        buildHtmlTable(family.types[0]);
        loadModel(family, index);

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

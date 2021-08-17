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

        var urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.has('id')); // true
        console.log(urlParams.get('id'));
    
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

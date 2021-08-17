
//READ JSON FILE
async function loadJson() {
    try {
        // let res = await fetch('./../src/family_data.json')
        let res = await fetch('src/family_data.json')
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
            let renderImage = document.createElement("img")
            // renderImage.src = "./../src/output_families/" + family.family_name + " - 3D View - {3D}.png"
            renderImage.src = "src/output_families/" + family.family_name + " - 3D View - {3D}.png"
            familyDiv.id = "famDiv" + index
            renderFamName.id = "famName" + index
            renderImage.id = "famImg" + index
            let container = document.getElementById("familyCatalog");
            familyDiv.appendChild(renderFamName)
            familyDiv.appendChild(renderImage)
            container.appendChild(familyDiv)
            document.getElementById(renderFamName.id).innerHTML = family.family_name
            
            renderFamName.addEventListener("click", (event) => {
                location.href = "familydetail.html?id=" + index
            }) 
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

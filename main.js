let btn = document.getElementById("getWord");

let word; 
let wordData;
    
function getDefinitions() {
    word = document.getElementById("word").value;
    let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;             
    console.log(url);
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            wordData = data[0];
            console.log(wordData);
            showMeanings(wordData["meanings"]);
        })
        
 }
//function showSynonyms(wordData)
 function showMeanings(meanings) {
     console.log(meanings);
     const results = document.getElementById("results");
     results.innerHTML = "";
     let $ = (el) => document.createElement(el);
     /* Takes in array containing each of the word's meaning and the
        corresponding definition, example, and synonyms. Creates HTML elements
        * and adds information to each before appending to DOM.
        */
 
    const createMeaning = ((word) => {
        for (let i  = 0; i < word["definitions"].length; i++) {
            let container = $("div");
            container.classList += "meaning"
            let definition = $("h4");
            definition.classList += "definition";
            definition.appendChild(document.createTextNode("Definition: " + word["definitions"][i]["definition"]));
            let example = $("p");
            if (word["definitions"][i]["example"] != undefined) {
            example.classList += "example";
            example.appendChild(document.createTextNode("Example: " + word["definitions"][i]["example"]));
             }
            let partOfSpeech  = $("p");
            partOfSpeech.classList += "partOfSpeech";
            let pos = $("span");
            pos.innerText = word["partOfSpeech"];
            partOfSpeech.append(document.createTextNode("Part of Speech: "), pos);
            container.append(definition, example, partOfSpeech);
             results.append(container);
            
            let synonyms = $("p");
            synonyms.classList += "synonyms";
            if (word["definitions"][i]["synonyms"]) {
                synonyms.append(document.createTextNode("Synonyms: " + word["definitions"][i]["synonyms"].join(", ")));   
                container.append(synonyms);
            }
            }    
        
      
    });
    for (let i = 0; i < meanings.length; i++) {
        createMeaning(meanings[i]);
    }

 }
btn.addEventListener("click", () => getDefinitions());
let input = document.getElementById("word").addEventListener("keyup", (e) => {
    if (e.key === "13") {
        e.preventDefault();
        btn.click();
    }
})
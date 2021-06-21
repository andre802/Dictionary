const express = require("express");
const fetch = require("node-fetch");
const path = require('path');
const hostname = process.env.hostname || "127.0.0.1";
const port = process.env.PORT || 9000;
const cors = require("cors");
const app = express();
app.use(logger);
app.use(cors());
const app_id = "18fe2bc0"; // insert your APP Id
const app_key = "bb6d190a2a4a953d435b4caedbc486dd"; // insert your APP Key
const wordId = "ace";
const fields = ['definitions', 'etymologies', 'examples', 'pronunciations'];
const strictMatch = "false";
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static('/public'))
const options = {
    host: 'od-api.oxforddictionaries.com',
    port: '443',
    path: '/api/v2/entries/en-us/' + wordId + '?fields=' + fields + '&strictMatch=' + strictMatch,
    method: "GET",
    headers: {
        'app_id': app_id,
        'app_key': app_key
    }
};

const parseJSON = (data) => {
    data = data["results"][0]["lexicalEntries"];
    let word = {};
    word["about"] = {

    }
    word["about"]["etymology"] = data[0]["entries"][0]["etymologies"][0]
            data[0]["entries"][0]["pronunciations"].forEach((pronunc, j) => {
                if (pronunc.hasOwnProperty("audioFile")) {
                    word["about"]["pronunciations"] = pronunc["audioFile"]
                }
                if (pronunc.hasOwnProperty("phoneticNotation") && pronunc["phoneticNotation"] === "IPA") {
                    word["about"]["phonetic spelling"] = pronunc["phoneticSpelling"]
                }
            })
    for (let i = 0; i < data.length; i++) {
        console.log(`index ${i}`)
        word[i] = {
            "entries": [],
            "category": data[i]["lexicalCategory"]["text"]
        }
        data[i]["entries"].forEach((result, j) => {
            word[i]["entries"][j] = {};
            if(!word[i]["entries"][j]["senses"]) {word[i]["entries"][j]["senses"] = {}}
            result['senses'].forEach((sense, k) => {
                console.log(`Index of each sense's definition ${k}`);
                if (word[i]["entries"][j]["senses"][k] == undefined) { word[i]["entries"][j]["senses"][k] = {
                    "definitions": []
                }}
                word[i]["entries"][j]["senses"][k]["definitions"] = sense["definitions"][0];
                console.log(sense["definitions"][0])
                if ("examples" in sense) {
                    let examples = []
                    sense["examples"].forEach(example => {
                        examples.push(example["text"])
                    })
                    word[i]["entries"][j]["senses"][k]["examples"] = examples;
                }
                if ("subsenses" in sense) {
                    word[i]["entries"][j]["senses"][k]["subsenses"] = {};
                    sense["subsenses"].forEach((subsense, l) => {
                        word[i]["entries"][j]["senses"][k]["subsenses"][l] = {}
                        word[i]["entries"][j]["senses"][k]["subsenses"][l]["definition"] = subsense["definitions"][0]
                        if ('examples' in subsense) {
                            let examples = []
                            subsense["examples"].forEach(example => {
                                examples.push(example["text"])
                            })
                            word[i]["entries"][j]["senses"][k]["subsenses"][l]["examples"] = examples;
                        }
                    })
                }
            })
        });
    }
    return word;
}


const getInfo = (word) => {
    options.path = '/api/v2/entries/en-gb/' + word + '?fields=' + fields + '&strictMatch=' + strictMatch
    return fetch("https://" + options.host + options.path, options)
        .then(resp => {
            return resp.json()
        })
        .then(data => parseJSON(data));
}
app.get("/search", async (req, res) => {
    let word = req.query.word;
    console.log(word);
    // res.send(`<h1>${word}</h1>`);
    let data = await getInfo(word)
    res.json(data);
})

function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})

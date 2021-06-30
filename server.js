require('dotenv').config();

const express = require("express");
const fetch = require("node-fetch");
const path = require('path');
const port = process.env.PORT || 3000;
const app_id = process.env.APP_ID;
const app_key = process.env.APP_KEY;

const cors = require("cors");
const app = express();
app.use(logger);
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')))

const fields = ['definitions', 'etymologies', 'examples', 'pronunciations'];
const strictMatch = "false";

const options = {
    host: 'od-api.oxforddictionaries.com',
    port: '443',
    path: "",
    method: "GET",
    headers: {
        'app_id': app_id,
        'app_key': app_key
    }
};
const getExamples = (sense) => {
    let examples = [];
    if ("examples" in sense) {
        sense["examples"].forEach(example => {
            examples.push(example["text"]);
        })
    }
    return examples;
}
/**
 * 
 * @param {String} data 
 * @returns {Object}
 */
const getAbout = (data) => {
    let about = {
        "etymology": data["etymologies"][0]
    }
    data["pronunciations"].forEach((pronunc) => {
        if (pronunc.hasOwnProperty("audioFile")) {
            about["pronunciations"] = pronunc["audioFile"]
        }
        if (pronunc.hasOwnProperty("phoneticNotation") && pronunc["phoneticNotation"] === "IPA") {
            about["phonetic spelling"] = pronunc["phoneticSpelling"]
        }
    })
    return about;
}
const parseJSON = (data) => {
    data = data["results"][0]["lexicalEntries"];
    let word = {
        "about": getAbout(data[0]["entries"][0])
    };
    for (let i = 0; i < data.length; i++) {
        word[i] = {
            "senses": [],
            "category": data[i]["lexicalCategory"]["text"]
        }
        data[i]["entries"].forEach((result) => {
            result['senses'].forEach((sense) => {
                let senseObj = {
                    "definitions": sense["definitions"][0],
                    "examples": getExamples(sense)
                }
                if ("subsenses" in sense) {
                    senseObj["subsenses"] = [];
                    let subsenses = [];
                    sense["subsenses"].forEach((subsense) => {
                        let sub = {
                            "definition": subsense["definitions"][0],
                            "examples": getExamples(subsense)
                        }
                        subsenses.push(sub);
                    })
                    senseObj["subsenses"] = subsenses;
                }
                word[i]["senses"].push(senseObj);
            })
        })
    }
    return word;
}

const getInfo = (word) => {
    options.path = '/api/v2/entries/en-us/' + word + '?fields=' + fields + '&strictMatch=' + strictMatch
    return fetch("https://" + options.host + options.path, options)
        .then(resp => {
            return resp.json()
        })
        .then(data => parseJSON(data));
}
app.get("/search", async (req, res) => {
    let word = req.query.word;
    let data = await getInfo(word)
    res.json(data);
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + 'client/build/index.html'))
})

function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})

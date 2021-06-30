require('dotenv').config();

const express = require("express");
const nodeFetch = require("node-fetch");
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
const getExamples = (sense: any): Array<string> => {
    let examples: Array<string> = [];
    if ("examples" in sense) {
        sense["examples"].forEach((example: any) => {
            examples.push(example["text"]);
        })
    }
    return examples;
}
interface About {
    etymology: String,
    "pronunciations": String,
    "phonetic spelling": String
}
interface Entry {
    senses: Array<Sense>,
    category: string
}
interface Sense {
    definitions: string,
    examples: Array<string>,
    subsenses: Array<Subsense>
}
interface Subsense {
    definition: string,
    examples: Array<string>
}
interface Word {
        about: About,
        entries: Array<Entry>
    }
/**
 * 
 * @param {Object} data 
 * @returns {Object}
 */
const getAbout = (data: any): About => {
    let about: About = {
        "etymology": data["etymologies"][0],
        "pronunciations": "",
        "phonetic spelling": ""
    }
    data["pronunciations"].forEach((pronunc: any) => {
        if (pronunc.hasOwnProperty("audioFile")) {
            about["pronunciations"] = pronunc["audioFile"]
        }
        if (pronunc.hasOwnProperty("phoneticNotation") && pronunc["phoneticNotation"] === "IPA") {
            about["phonetic spelling"] = pronunc["phoneticSpelling"]
        }
    })
    return about;
}
const parseJSON = (data: any): any => {
    let entries = data["results"][0]["lexicalEntries"];
    let word: Word = {
        "about": getAbout(data["results"][0]["lexicalEntries"][0]["entries"][0]),
        "entries": []
    };

    for (let i = 0; i < entries.length; i++) {
        let entry: Entry = {
            "senses": [],
            "category": entries[i]["lexicalCategory"]["text"]
        }
        entries[i]["entries"].forEach((result: any) => {
            result['senses'].forEach((sense: any) => {
                let senseObj: Sense = {
                    "definitions": sense["definitions"][0],
                    "examples": getExamples(sense),
                    "subsenses": []
                }
                if ("subsenses" in sense) {
                    let subsenses: Array<Subsense> = [];
                    sense["subsenses"].forEach((subsense: any) => {
                        let sub: Subsense = {
                            "definition": subsense["definitions"][0],
                            "examples": getExamples(subsense)
                        }
                        subsenses.push(sub);
                    })
                    senseObj["subsenses"] = subsenses;
                }
                entry["senses"].push(senseObj);
            })
        })
        word["entries"].push(entry);
    }
    return word;
}

const getInfo = (word: string): Promise<Object> => {
    options.path = '/api/v2/entries/en-us/' + word + '?fields=' + fields + '&strictMatch=' + strictMatch
    return nodeFetch("https://" + options.host + options.path, options)
        .then((resp: any) => {
            return resp.json()
        })
        .then((data: JSON) => parseJSON(data));
}
app.get("/search", async (req: any, res: any) => {
    let word = req.query.word;
    let data = await getInfo(word)
    res.json(data);
})

app.get("*", (req: any, res: any) => {
    res.sendFile(path.join(__dirname + 'client/build/index.html'))
})

function logger(req: any, res: any, next: any) {
    console.log(req.originalUrl);
    next();
}

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})

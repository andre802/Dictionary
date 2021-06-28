import requests

app_id = '18fe2bc0'
app_key = 'bb6d190a2a4a953d435b4caedbc486dd'

language = 'en-us'
word_id = ""
fields = ['definitions', 'etymologies', 'examples', 'pronunciations']
strictMatch = 'false'
word = {
    "entries": {
        0: {
            "etymology": "",
            "pronunciations": "",
            "phonetic spelling": "",
            "definition": "",
            "senses": {
                
            }
        }
    }
}
def getWords():
    url = 'https://od-api.oxforddictionaries.com:443/api/v2/entries/' + language + '/' + word_id + '?fields=' + ('%2C'.join(fields)) + '&strictMatch=' + strictMatch
    print(url)
    r = requests.get(url, headers = {'app_id': app_id, 'app_key': app_key})
    # print("code {}\n".format(r.status_code))
    response = r.json()
    entries = list()
    results = response["results"][0]["lexicalEntries"]
    for i, result in enumerate(results):
        word["entries"][i] = {}
        if('etymologies' in result["entries"][0].keys()):
            word["entries"][i]["etymology"] = result["entries"][0]["etymologies"][0]
            print('Etymology: ' + result["entries"][0]["etymologies"][0])
            
        # print("Pronunciations: " + result["entries"][0]["pronunciations"][1]["audioFile"])
        word["entries"][i]["pronunciations"] = result["entries"][0]["pronunciations"][1]["audioFile"]
        word["entries"][i]["phonetic spelling"] = result["entries"][0]["pronunciations"][1]["phoneticSpelling"]
        # print("Phonetic Spelling: " + result["entries"][0]["pronunciations"][0]["phoneticSpelling"])
        
        for j,sense in enumerate(result["entries"][0]["senses"]):
            word["entries"][i]["senses"] = {}
            word["entries"][i]["senses"][j] ={}
            word["entries"][i]["senses"][j]["definitions"] = sense["definitions"][0]
            # print('Definition: ' + sense["definitions"][0])
            if ("examples" in sense):
                examples = []
                for example in sense["examples"]:
                    examples.append(example["text"])
                word["entries"][i]["senses"][j]["examples"] = examples
                # print(','.join(examples))
            if ("subsenses" in sense):
                for k, subsense in enumerate(sense["subsenses"]):
                    print(k)
                    
                    word["entries"][i]["senses"][j]["subsenses"][k]= {}
                    word["entries"][i]["senses"][j]["subsenses"][k]["definition"] = subsense["definitions"][0]
                    print(subsense["definitions"][0])
                    # print('Subsense definition: ' + subsense["definitions"][0])
                    if ("examples" in subsense):
                        examples = []
                        for example in subsense["examples"]:
                            examples.append(example["text"])
                        word["entries"][i]["senses"][j]["subsenses"][k]["examples"] = examples
                        # print(','.join(examples))
        print(word)
    
def promptUser():
    print("Enter a word :")
    global word_id
    word_id = input().lower()
    getWords()
    
promptUser()
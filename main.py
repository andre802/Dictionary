import requests
import json
from bs4 import BeautifulSoup

app_id = '18fe2bc0'
app_key = 'bb6d190a2a4a953d435b4caedbc486dd'

language = 'en-gb'
word_id = 'health'
fields = 'definitions'
strictMatch = 'false'
''' Returns a list of definitions retrieved from the
Oxford Dictionaries API '''
def getWords():
    url = 'https://od-api.oxforddictionaries.com:443/api/v2/entries/' + language + '/' + word_id.lower() + '?fields=' + fields + '&strictMatch=' + strictMatch
    r = requests.get(url, headers = {'app_id': app_id, 'app_key': app_key})
    print("code {}\n".format(r.status_code))
    response = r.json()
    print(r.text)
    entries = list()
    results = response["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][0]
    entries.append(results["definitions"][0])
    for subsenses in results["subsenses"]:
        entries.append(subsenses["definitions"][0])
    soup = BeautifulSoup(open("./main.html"), "html.parser")
    print(soup)
getWords()
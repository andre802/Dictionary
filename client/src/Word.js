

const Word = ({ etymology, phoneticSpelling, senses, word, pronunciation }) => {
    let entries = {};
    let allEntries = {};
    let relevantEntries = Object.keys(senses).filter(el => el !== "about");
    for (let i = 0; i < relevantEntries.length; i++) {
        allEntries[i] = {
            "about": ""
        };
        
        allEntries[i] = senses[relevantEntries[i]]["entries"][0]["senses"];
        allEntries[i]["about"] = senses[relevantEntries[i]]["category"];
        
    }
    entries = allEntries;
    // eslint-disable-next-line

    if (!word) return null;
    return (
        <div key={word} className="entry">
            <div id="about">
                <h1>{word}</h1>
                <p>Etymology: {etymology}</p>
                <p>Phonetic Spelling: {phoneticSpelling}</p>
                <audio
                    controls
                    src={pronunciation}
                ></audio>
            </div>
            {/*Senses*/}
            {entries !== undefined ? Object.keys(entries).map(key => {
                console.log(entries[key])
                return Object.keys(entries[key]).filter(el => el!== "about").map(innerKey => {
                    return (
                        <div className="sense">
                            <p>{entries[key]["about"]}</p>
                            {/*Definition */}
                            <div className="definition">
                                <h3>Definition</h3>
                                <p>{entries[key][innerKey]["definitions"]}</p>
                            </div>
                            {/*Examples */}
                            {entries[key][innerKey]["examples"] !== undefined ? (
                                <div className="examples">
                                    <h4>Examples</h4>
                                    {entries[key][innerKey]["examples"].map(ex => {
                                        ex = ex[0].toUpperCase() + ex.slice(1,);
                                        return <p>{ex}</p>
                                    })}
                                </div>
                            ) : ""}
                            {/* Subsenses */}
                            {entries[key][innerKey]["subsenses"] !== undefined ? (
                                Object.keys(entries[key][innerKey]["subsenses"]).map(subsenseKey => (
                                    <div className="subsense">
                                        <h4>Subsense</h4>
                                        <h5>Definition</h5>

                                        <p>{entries[key][innerKey]["subsenses"][subsenseKey]["definition"]}</p>

                                        {entries[key][innerKey]["subsenses"][subsenseKey]["examples"] ? (
                                            <div>
                                                <h5>Example</h5>
                                                {entries[key][innerKey]["subsenses"][subsenseKey]["examples"].map(ex => {
                                                    ex = ex[0].toUpperCase() + ex.slice(1,);
                                                    return <p>{ex}</p>
                                                })}


                                            </div>) : ""}
                                    </div>
                                ))
                            ) : ""}
                        </div>
                    )
                })
            }) : ""}
        </div>
    )


}
export default Word;
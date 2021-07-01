

const Word = ({ etymology, phoneticSpelling, entries, word, pronunciation }) => {
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
            {entries.map(entry => (
                <div className="sense">
                    <p>{entry["category"]}</p>
                    {entry["senses"].map(sense => (
                        <>
                        <div className="definition">
                            <h3>Definition</h3>
                            <p>{sense["definitions"]}</p>
                        </div>
                        {sense["examples"].length !== 0 ? (
                            <div className="examples">
                                <h4>Examples</h4>
                                {sense["examples"].map(ex => {
                                    ex = ex[0].toUpperCase() + ex.slice(1,);
                                    return <p>{ex}</p>
                                })}
                            </div>
                        ) : ""}
                        {sense["subsenses"] !== undefined ? (
                            sense["subsenses"].map(subsense => (
                                <div className="subsense">
                                    <h4>Subsense</h4>
                                    <h5>Definition</h5>
                                    <p>{subsense["definition"]}</p>
                                    {subsense["examples"].length !== 0 ? (
                                        <div>
                                            <h5>Example</h5>
                                            {subsense["examples"].map(ex => {
                                                ex = ex[0].toUpperCase() + ex.slice(1,);
                                                return <p>{ex}</p>
                                            })}
                                        </div>) : ""}
                                </div>
                             ))) : ""}</>))}
                            </div>)) }
                        </div>
    )}
        

export default Word;


const Word = ({etymology, phoneticSpelling, senses, word, pronunciation}) => {
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
            {senses !== undefined ? Object.keys(senses).map(key => {
                return (
                    <div className="sense">
                    {/*Definition */}
                    <div className="definition">
                    <h3>Definition</h3>
                    <p>{senses[key]["definitions"]}</p>
                    </div>
                    {/*Examples */}
                    {senses[key]["examples"] !== undefined ? (
                        <div className="examples">
                            <h4>Examples</h4>
                            {senses[key]["examples"].map(ex => {
                                ex = ex[0].toUpperCase() + ex.slice(1,);
                                return <p>{ex}</p> 
                                })}
                        </div>
                    ): ""}
                    {/* Subsenses */}
                    {senses[key]["subsenses"] !== undefined ? (
                        Object.keys(senses[key]["subsenses"]).map(subsenseKey => (
                            <div className="subsense">
                                <h4>Subsense</h4>
                                <h5>Definition</h5>
                                
                                <p>{senses[key]["subsenses"][subsenseKey]["definition"]}</p>
                            
                                {senses[key]["subsenses"][subsenseKey]["examples"] ? (
                                <div>
                                    <h5>Example</h5>
                                     {senses[key]["subsenses"][subsenseKey]["examples"].map(ex => {
                                        ex = ex[0].toUpperCase() + ex.slice(1,);
                                        return <p>{ex}</p> 
                                })}
                                   
                                    
                                </div> ) :""}
                            </div>
                        ))
                    ): ""}
                    </div>
            )}) : ""}
        </div>
    )
                    

}
export default Word;
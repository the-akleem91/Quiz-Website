function FinishScreen({points , maxPossiblePoints , HighScore , dispatch}) {
    const percentage =( points / maxPossiblePoints) % 100;
    return (
        <>
            <p className="result">
                You Scored {points} out of {maxPossiblePoints} ({Math.ceil(percentage)}%)
            </p>
            <p className="highscore">(High Score : {HighScore} points)</p>
            <button className="btn btn-ui" onClick={()=>dispatch({type : "restart"})}>Restart</button>
        </> 
    )
}

export default FinishScreen

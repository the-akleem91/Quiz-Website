import Header from "./Header";
import Main from "./Main";
import { useEffect, useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
const initialState = {
    questions: [],
    status: 'loading',    // 'loading' , 'error' , 'ready' , 'active' , 'finished'
    index: 0,    
    answer: null,
    points: 0,
    HighScore: 0,
    secondsRemaining : null, 
}

const SECS_PER_QUESTION = 30;
function reducer(state, action) {
    switch (action.type)
    {  
        case 'dataRecieved': 
            return {
                ...state, questions: action.payload,
                status : 'ready',
            }
        case "dataFailed":
            return {
                ...state , status : "error",
            }
        case "start":
            return {
                ...state, status: "active",
                 secondsRemaining : state.questions.length * SECS_PER_QUESTION,
            }
        
        
        case "newAnswer":
            const question = state.questions.at(state.index);
            return {
                ...state, answer: action.payload,
                points : action.payload === question.correctOption ? state.points + question.points : state.points,
            }
        
        case "nextQuestion":
            return {
                ...state, index: state.index + 1,
                answer: null,
            }
        case "finished":
            return {
                ...state , status : "finish" ,  HighScore : state.points > state.HighScore ? state.points : state.HighScore
            }
        case "restart":
            return {
                ...initialState, questions: state.questions,
                status: "ready"
        }
        
        case "tick":
            return {
                ...state,
                secondsRemaining: state.secondsRemaining - 1,
                status: state.secondsRemaining === 0 ? "finish" : state.status,
            };
        default:
             throw new Error("Action Unkown");
       } 
}

export default function App() {

    const [{questions , status , index , secondsRemaining, answer , points , HighScore}, dispatch ] = useReducer(reducer, initialState);
    const numQuestion = questions.length; 
    const maxPossiblePoints = questions.reduce((prev, cur) => prev +cur.points, 0);
    
    useEffect(function () {
        fetch("http://localhost:8000/questions")
            .then(res => res.json())
            .then(data => dispatch({ type: 'dataRecieved', payload: data }))
            .catch(err => dispatch({type : "dataFailed"}));
    }, []);

    return <div className="app">
        <Header />
        <Main>
            
            {status === 'loading' && <Loader/>} 
            {status === 'error' && <Error />} 
            {status === 'ready' && <StartScreen numQuestion={numQuestion} dispatch={dispatch} />} 
            {status === "active" && (
                <>
                    <Progress
                        index={index}
                        numQuestion={numQuestion}
                        points={points}
                        maxPossiblePoints={maxPossiblePoints}
                        answer={answer} />
                    
                    <Questions
                        dispatch={dispatch}
                        answer={answer}
                        question={questions[index]}
                    />
                    
                    <Footer>
                        <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
                        <NextButton dispatch={dispatch} answer={answer} numQuestion={numQuestion} index={index} />
                     </Footer>
                </>)
            }

            {status === "finish" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} HighScore={HighScore}
                dispatch={dispatch} />}
            
        </Main>
    </div>
}


import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { getServerData } from "../helper/helper";

/** redux actions */
import * as Action from '../redux/question_reducer'

/** fetch question hook to fetch api data and set value to store */
export const useFetchQuestion = () => {
    const dispatch = useDispatch();   
    const [getData, setGetData] = useState({ isLoading : false, apiData : [], serverError: null});
   


    useEffect(() => {
  setGetData(prev => ({ ...prev, isLoading: true }));

  (async () => {
    try {
      const data = await getServerData(
        `${process.env.REACT_APP_SERVER_HOSTNAME}/api/questions`,
        (data) => data
      );

      console.log("Fetched data:", data);

      const { questions, answers } = data;

      if (Array.isArray(questions) && questions.length > 0) {
        setGetData(prev => ({
          ...prev,
          isLoading: false,
          apiData: questions,
        }));

        // FIX: Use correct property name and provide answers array
        dispatch(Action.startExamAction({ questions, answers: [] }));
      } else {
        throw new Error("No questions available in response");
      }
    } catch (error) {
      setGetData(prev => ({ ...prev, isLoading: false, serverError: error }));
      console.error("Error fetching questions:", error);
    }
  })();
}, [dispatch]);


    return [getData, setGetData];
}


/** MoveAction Dispatch function */
export const MoveNextQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.moveNextAction()); /** increase trace by 1 */
    } catch (error) {
        console.log(error)
    }
}

/** PrevAction Dispatch function */
export const MovePrevQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.movePrevAction()); /** decrease trace by 1 */
    } catch (error) {
        console.log(error)
    }
}
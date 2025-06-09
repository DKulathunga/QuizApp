import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/** Custom Hook */
import { useFetchQuestion } from '../hooks/FetchQuestion';
import { updateResult } from '../hooks/setResult';

export default function Questions({ onChecked }) {
  const [checked, setChecked] = useState(undefined);
  const dispatch = useDispatch();

  const { trace = 0 } = useSelector(state => state.questions || {});
  const result = useSelector(state => state.result.result);

  // Fetch data
  const [{ isLoading, serverError }] = useFetchQuestion();

  // Get current question from the store
    const questions = useSelector(state => {
    const { queue = [], trace = 0 } = state.questions || {};
    return queue[trace];
  });

  useEffect(() => {
    dispatch(updateResult({ trace, checked }));
  }, [checked, dispatch, trace]);

  function onSelect(i) {
    onChecked(i);
    setChecked(i);
    dispatch(updateResult({ trace, checked }));
  }

  // Loading or Error UI
  if (isLoading) return <h3 className='text-light'>Loading...</h3>;
  if (serverError) return <h3 className='text-light'>{String(serverError.message || serverError)}</h3>;
  if (!questions || !Array.isArray(questions.options)) {
    return <h3 className='text-light'>No question available.</h3>;
  }

  // Render question
  return (
    <div className='questions'>
      <h2 className='text-light'>{questions.question}</h2>

      <ul key={questions.id}>
        {questions.options.map((q, i) => (
          <li key={i}>
            <input
              type="radio"
              name="options"
              id={`q${i}-option`}
              onChange={() => onSelect(i)}
            />
            <label className='text-primary' htmlFor={`q${i}-option`}>{q}</label>
            <div className={`check ${result[trace] === i ? 'checked' : ''}`}></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

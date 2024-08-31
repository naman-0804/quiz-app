import React, { useState } from 'react';

const Quiz = () => {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredOptions, setAnsweredOptions] = useState({}); 

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://opentdb.com/api.php?amount=3'
      );
      const data = await response.json();
      console.log('Fetched Data:', data);
      if (data.results && data.results.length > 0) {
        const sortedQuestions = data.results.map(question => ({
          ...question,
          options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)
        }));
        setQuestions(sortedQuestions);
        setAnsweredOptions({}); 
      } else {
        setError('');
      }
    } catch (error) {
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (selectedAnswer, correctAnswer, questionIndex) => {
    if (!answeredOptions[questionIndex]) {
      if (selectedAnswer === correctAnswer) {
        setScore((prevScore) => prevScore + 1);
      }
      setAnsweredOptions((prevOptions) => ({
        ...prevOptions,
        [questionIndex]: {
          selected: true,
          correct: selectedAnswer === correctAnswer,
        },
      }));
    }
  };

  return (
    <div>
      <style>
        {`
          .blurred {
            filter: blur(5px);
          }
          .options button {
            margin: 5px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
          }
          .correct {
            background-color: lightgreen;
          }
          .incorrect {
            background-color: lightcoral;
          }
        `}
      </style>
      <h1>Quiz Questions</h1>
      <p>Score: {score}</p> 
      
      <button onClick={fetchQuestions} disabled={loading}>
        {loading ? 'Loading...' : 'Get New Questions'}
      </button>

      {error && <p>{error}</p>}

      {!loading && questions && questions.length > 0 && (
        questions.map((question, index) => (
          <div key={index} className="question-container">
            <p className="question">{question.question}</p>
            <ul className="options">
              {question.options.map((option, i) => {
                const isBlurred = answeredOptions[index] && answeredOptions[index].selected;
                const isCorrect = answeredOptions[index] && option === question.correct_answer;

                return (
                  <li key={i} className={isBlurred ? (isCorrect ? 'correct' : 'incorrect') : ''}>
                    <button
                      onClick={() => handleAnswerClick(option, question.correct_answer, index)}
                      disabled={answeredOptions[index]?.selected} 
                    >
                      {option}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Quiz;

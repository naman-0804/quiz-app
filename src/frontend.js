import React, { useState, useEffect } from 'react';
import './frontend.css'; 
import AuthPopup from './auth'; 

function decodeHtmlEntities(str) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
}

const Quiz = () => {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredOptions, setAnsweredOptions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false); 
  const [showAuthPopup, setShowAuthPopup] = useState(true); 

  const fetchQuestions = async () => {
    if (!isQuizActive) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://opentdb.com/api.php?amount=3');
      const data = await response.json();
      console.log('Fetched Data:', data);
      if (data.results && data.results.length > 0) {
        const sortedQuestions = data.results.map(question => ({
          ...question,
          question: decodeHtmlEntities(question.question),
          options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5)
        }));
        setQuestions(sortedQuestions);
        setAnsweredOptions({});
        setCurrentQuestionIndex(0);
        setTimer(30);
        setIsTimerActive(true);
      } else {
        setError('');
      }
    } catch (error) {
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isQuizActive) {
      fetchQuestions(); 
    }
  }, [isQuizActive]);

  useEffect(() => {
    let timerInterval;
    if (isTimerActive) {
      timerInterval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(timerInterval);
            setIsTimerActive(false);
            handleAnswerClick(null, null, currentQuestionIndex); 
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [isTimerActive, currentQuestionIndex]);

  const handleAnswerClick = (selectedAnswer, correctAnswer, questionIndex) => {
    if (!answeredOptions[questionIndex] && isQuizActive) {
      if (selectedAnswer === correctAnswer) {
        setScore(prevScore => prevScore + 1);
      }
      setAnsweredOptions(prevOptions => ({
        ...prevOptions,
        [questionIndex]: {
          selected: true,
          correct: selectedAnswer === correctAnswer,
        },
      }));

      setTotalQuestionsAnswered(prevCount => prevCount + 1);

      setTimeout(() => {
        setCurrentQuestionIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < questions.length) {
            setTimer(30); 
            setIsTimerActive(true);
            return nextIndex;
          } else {
            fetchQuestions();
            return 0; 
          }
        });
      }, 500); 
    }
  };

  const handleStopQuiz = () => {
    setIsQuizActive(false);
    setIsTimerActive(false); 
  };

  const handleStartQuiz = () => {
    setIsQuizActive(true);
    fetchQuestions();
  };

  const handleRefreshQuiz = () => {
    fetchQuestions();
  };

  if (questions && currentQuestionIndex >= questions.length && isQuizActive) {
    return <div><h1>Quiz Completed!</h1><p>Your final score is {score}</p></div>;
  }

  return (
    <div>
      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
      <h1>Quiz Questions</h1>
      <div className="container">
        <div className="box">
          <p>Score: {score}</p>
          <p>Total Questions Answered: {totalQuestionsAnswered}</p>
          <p>Timer: {timer}s</p>
          {isQuizActive ? (
            <>
              <button className="stop-button" onClick={handleStopQuiz} disabled={!isQuizActive}>Stop Quiz</button>
              <button className="refresh-button" onClick={handleRefreshQuiz}>Refresh Quiz</button>
            </>
          ) : (
            <button className="start-button" onClick={handleStartQuiz}>Start Quiz</button>
          )}
        </div>
      </div>
      {error && <p>{error}</p>}
      {!loading && questions && questions.length > 0 && isQuizActive && (
        currentQuestionIndex < questions.length && (
          <div className="question-container">
            <p className="question">{questions[currentQuestionIndex].question}</p>
            <div className="options">
              {questions[currentQuestionIndex].options.map((option, i) => {
                const isBlurred = answeredOptions[currentQuestionIndex] && answeredOptions[currentQuestionIndex].selected;
                const isCorrect = answeredOptions[currentQuestionIndex] && option === questions[currentQuestionIndex].correct_answer;

                return (
                  <button
                    key={i}
                    className={isBlurred ? (isCorrect ? 'correct' : 'incorrect') : ''}
                    onClick={() => handleAnswerClick(option, questions[currentQuestionIndex].correct_answer, currentQuestionIndex)}
                    disabled={answeredOptions[currentQuestionIndex]?.selected} 
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Quiz;
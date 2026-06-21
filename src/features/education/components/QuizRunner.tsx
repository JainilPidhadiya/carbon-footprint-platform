import React, { useState } from 'react';
import type { Quiz } from '../../../types';
import { CardHeader, CardBody, CardFooter, Button } from '../../../components/ui';
import { HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface QuizRunnerProps {
  activeQuiz: Quiz;
  setActiveQuiz: (quiz: Quiz | null) => void;
  completeQuiz: (quizId: string, xpReward: number) => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  activeQuiz,
  setActiveQuiz,
  completeQuiz,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === activeQuiz.questions[currentQuestionIndex].correctOptionIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      const minPassingScore = activeQuiz.questions.length;
      if (score >= minPassingScore - 1) {
        completeQuiz(activeQuiz.id, activeQuiz.xpReward);
      }
      setIsAnswered(true);
      setCurrentQuestionIndex(activeQuiz.questions.length);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform transition-all">
        <CardHeader className="p-5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
          <span className="text-xs font-bold text-emerald-650 dark:text-emerald-450 uppercase flex items-center gap-1">
            <HelpCircle className="w-4 h-4" />
            {activeQuiz.title}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveQuiz(null)}
            className="w-8 h-8 p-0 rounded-full cursor-pointer text-slate-400"
            aria-label="Exit quiz"
          >
            ×
          </Button>
        </CardHeader>

        {/* Question Screen */}
        {currentQuestionIndex < activeQuiz.questions.length ? (
          <div>
            <CardBody className="p-6 space-y-5">
              {/* Progress info */}
              <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
                <span>Current Score: {score}</span>
              </div>

              {/* Question Title */}
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 text-left">
                {activeQuiz.questions[currentQuestionIndex].question}
              </h4>

              {/* Options List */}
              <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Quiz answer options">
                {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const showCorrect = isAnswered && idx === activeQuiz.questions[currentQuestionIndex].correctOptionIndex;
                  const showIncorrect = isAnswered && isSelected && idx !== activeQuiz.questions[currentQuestionIndex].correctOptionIndex;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      role="radio"
                      aria-checked={isSelected ? 'true' : 'false'}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-sm text-left transition-all font-semibold flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${
                        showCorrect
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-750 dark:text-emerald-400'
                          : showIncorrect
                          ? 'bg-rose-500/10 border-rose-500 text-rose-750 dark:text-rose-450'
                          : isSelected
                          ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 dark:border-slate-100'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{option}</span>
                      {showCorrect && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      {showIncorrect && <AlertCircle className="w-4 h-4 text-rose-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Inline Explanation */}
              {isAnswered && (
                <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs text-left text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Explanation:</span>
                  <p>{activeQuiz.questions[currentQuestionIndex].explanation}</p>
                </div>
              )}
            </CardBody>

            <CardFooter className="p-5 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/10">
              {!isAnswered ? (
                <Button
                  variant="primary"
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className="cursor-pointer"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNextQuestion}
                  className="cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  {currentQuestionIndex === activeQuiz.questions.length - 1 ? 'Show Results' : 'Next Question'}
                </Button>
              )}
            </CardFooter>
          </div>
        ) : (
          // Quiz Results Screen
          <div>
            <CardBody className="p-8 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quiz Completed!</h4>
              
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 inline-block">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-200">
                  {score} / {activeQuiz.questions.length}
                </span>
                <span className="text-xs text-slate-400 block mt-1">Correct Answers</span>
              </div>

              <p className="text-sm text-slate-500">
                {score >= activeQuiz.questions.length - 1 
                  ? `Congratulations! You passed the quiz and earned +${activeQuiz.xpReward} XP.` 
                  : `You got ${score} correct. Try again to get 100% and unlock your XP rewards.`}
              </p>
            </CardBody>
            <CardFooter className="p-5 bg-slate-50/50 dark:bg-slate-900/10 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedOption(null);
                  setIsAnswered(false);
                  setScore(0);
                }}
                className="cursor-pointer"
              >
                Retry Quiz
              </Button>
              <Button
                variant="primary"
                onClick={() => setActiveQuiz(null)}
                className="cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500"
              >
                Close Results
              </Button>
            </CardFooter>
          </div>
        )}
      </div>
    </div>
  );
};
export default QuizRunner;

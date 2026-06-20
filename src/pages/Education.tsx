import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Quiz, EducationArticle } from '../types';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  Award,
  Zap
} from 'lucide-react';

const MOCK_ARTICLES: EducationArticle[] = [
  {
    id: 'art-1',
    title: 'The Hidden Cost of Beef: Nutrition vs Emissions',
    slug: 'cost-of-beef',
    summary: 'Discover how dietary choices represent the single quickest individual pathway to footprint reduction.',
    readTimeMinutes: 4,
    category: 'Food',
    content: 'The livestock sector is a major stressor on many ecosystems and the planet. Beef production is especially carbon-intensive. Cattle emit methane (a greenhouse gas with 28x the warming potential of CO2) during digestion. Swapping beef for beans, chickpeas, or poultry can reduce individual food-related emissions by up to 50% overnight. It requires 20x less land and emits 20x fewer greenhouse gases to produce a gram of protein from beans compared to beef.'
  },
  {
    id: 'art-2',
    title: 'Electrifying Everything: The Home Heat Pump Revolution',
    slug: 'heat-pump-revolution',
    summary: 'Traditional gas and oil heating represents a massive chunk of carbon baselines. Here is why heat pumps are the future.',
    readTimeMinutes: 5,
    category: 'Energy',
    content: 'Heat pumps do not create heat; they transfer it from the outside air or ground into your home. This makes them up to 300% to 400% efficient compared to the best gas boilers which operate at around 90% efficiency. By combining heat pumps with solar panels or a green utility plan, residential heating footprints can fall close to absolute zero.'
  },
  {
    id: 'art-3',
    title: 'Mythbusting Recycling: What actually happens to Plastic?',
    slug: 'mythbusting-recycling',
    summary: 'Understanding the priorities of waste sorting. Why reducing consumption is 10x more powerful than recycling.',
    readTimeMinutes: 3,
    category: 'Waste',
    content: 'While recycling is beneficial, only about 9% of all plastic waste generated globally gets recycled. The rest ends up in landfills or polluting oceans. Aluminum, cardboard, and glass can be recycled almost indefinitely without losing quality. For plastic, however, the process degrades the polymers, limiting its reuse. The absolute priority should always be: Refuse, Reduce, Reuse, and only then Recycle.'
  }
];

const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'q-1',
    title: 'Carbon Footprint Basics',
    description: 'Learn the primary definitions and scale of carbon calculations.',
    xpReward: 50,
    questions: [
      {
        id: 'q1-1',
        question: 'What is the average global carbon footprint per person per year?',
        options: ['~1 tonne CO2e', '~4 tonnes CO2e', '~10 tonnes CO2e', '~20 tonnes CO2e'],
        correctOptionIndex: 1, // ~4 tonnes is global avg. US avg is 16.
        explanation: 'The average global footprint is around 4 tonnes CO2e, but to avoid the worst effects of climate change, the target global average needs to drop under 2 tonnes by 2050.'
      },
      {
        id: 'q1-2',
        question: 'Which of these greenhouse gases has the highest warming potency over 100 years?',
        options: ['Carbon Dioxide (CO2)', 'Water Vapor', 'Methane (CH4)', 'Nitrous Oxide (N2O)'],
        correctOptionIndex: 3, // N2O is ~298x potent. CH4 is ~28x. CO2 is 1.
        explanation: 'Nitrous Oxide (N2O) is nearly 300 times more potent than Carbon Dioxide, mainly originating from synthetic fertilizers and industrial processes.'
      },
      {
        id: 'q1-3',
        question: 'Which sector is globally responsible for the largest share of greenhouse gas emissions?',
        options: ['Transportation', 'Agriculture & Land Use', 'Electricity & Heat Production', 'Industrial Manufacturing'],
        correctOptionIndex: 2, // Electricity & heat is ~25%.
        explanation: 'Electricity and heat production accounts for roughly 25% of global emissions, followed closely by agriculture, forestry, and industry.'
      }
    ]
  },
  {
    id: 'q-2',
    title: 'Sustainable Nutrition',
    description: 'Test your understanding of emissions behind the food on your plate.',
    xpReward: 50,
    questions: [
      {
        id: 'q2-1',
        question: 'Compared to beans, how much higher are the carbon emissions of beef per gram of protein?',
        options: ['2 times higher', '5 times higher', '10 times higher', '20 times higher'],
        correctOptionIndex: 3,
        explanation: 'Beef emits 20 times more greenhouse gases per gram of protein than plant-based proteins like beans and lentils.'
      },
      {
        id: 'q2-2',
        question: 'Which type of diet results in the lowest annual carbon footprint?',
        options: ['Mediterranean', 'Vegetarian', 'Vegan', 'Paleo'],
        correctOptionIndex: 2,
        explanation: 'A fully plant-based (vegan) diet produces the lowest emissions, saving up to 1.5 tonnes of CO2e per person per year compared to a high-meat diet.'
      }
    ]
  }
];

export const EducationPage: React.FC = () => {
  const { quizzesCompleted, completeQuiz } = useAppStore();

  const [activeArticle, setActiveArticle] = useState<EducationArticle | null>(null);
  
  // Quiz runner states
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !activeQuiz) return;
    
    const isCorrect = selectedOption === activeQuiz.questions[currentQuestionIndex].correctOptionIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;

    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      const minPassingScore = activeQuiz.questions.length;
      if (score >= minPassingScore - 1) {
        // Pass the quiz and grant XP
        completeQuiz(activeQuiz.id, activeQuiz.xpReward);
      }
      setIsAnswered(true); // Flag to show final slide
      setCurrentQuestionIndex(activeQuiz.questions.length); // Step to results step
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-slate-50 mb-1">
          Learn & Earn
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gain knowledge about sustainability metrics and earn XP rewards by completing quizzes.
        </p>
      </div>

      {/* Quizzes Section */}
      <section className="space-y-4 text-left">
        <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-500" />
          Sustainability Quizzes
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {MOCK_QUIZZES.map((quiz) => {
            const isCompleted = quizzesCompleted.includes(quiz.id);
            return (
              <Card key={quiz.id} className="hover:shadow-md transition-all border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between">
                <CardHeader className="p-5 flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-50">{quiz.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{quiz.description}</p>
                  </div>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-650 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Passed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      {quiz.xpReward} XP
                    </span>
                  )}
                </CardHeader>
                <CardBody className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400">
                  {quiz.questions.length} Questions • WCAG accessible formatting
                </CardBody>
                <CardFooter className="p-5 pt-0 bg-transparent flex justify-end">
                  <Button
                    variant={isCompleted ? 'secondary' : 'primary'}
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full sm:w-auto cursor-pointer"
                  >
                    {isCompleted ? 'Retry Quiz' : 'Start Quiz'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Articles Section */}
      <section className="space-y-4 text-left">
        <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          Education Articles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_ARTICLES.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-all border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between">
              <CardBody className="p-5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-450 block mb-2">
                  {article.category} • {article.readTimeMinutes} min read
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-50 mb-2 leading-tight">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </CardBody>
              <CardFooter className="p-5 pt-0 bg-transparent">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveArticle(article)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                  className="w-full cursor-pointer justify-between border-slate-200 dark:border-slate-800"
                >
                  Read Article
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Article Detail Drawer Modal */}
      {activeArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-title"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden max-h-[85vh] flex flex-col transform transition-all">
            <CardHeader className="p-6 flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-450">
                  {activeArticle.category} • {activeArticle.readTimeMinutes} Min Read
                </span>
                <h3 id="article-title" className="text-xl font-bold font-display text-slate-900 dark:text-slate-50 mt-1">
                  {activeArticle.title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 p-0 rounded-full cursor-pointer text-slate-400 shrink-0"
                aria-label="Close article"
              >
                ×
              </Button>
            </CardHeader>
            <CardBody className="p-6 overflow-y-auto text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {activeArticle.summary}
              </p>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 whitespace-pre-line">
                {activeArticle.content}
              </div>
            </CardBody>
            <CardFooter className="p-6 bg-slate-50/50 dark:bg-slate-900/10 flex justify-end">
              <Button variant="secondary" onClick={() => setActiveArticle(null)} className="cursor-pointer">
                Dismiss
              </Button>
            </CardFooter>
          </div>
        </div>
      )}

      {/* Quiz Wizard Modal */}
      {activeQuiz && (
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
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400'
                              : showIncorrect
                              ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-450'
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
                <CardBody className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">Quiz Completed!</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      You answered {score} out of {activeQuiz.questions.length} questions correctly.
                    </p>
                  </div>

                  {score === activeQuiz.questions.length ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-450 p-4 rounded-2xl text-xs max-w-sm mx-auto font-semibold">
                      Perfect Score! You passed and earned <strong>+{activeQuiz.xpReward} XP</strong> to boost your environmental rank.
                    </div>
                  ) : score >= activeQuiz.questions.length - 1 ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-450 p-4 rounded-2xl text-xs max-w-sm mx-auto font-semibold">
                      Passed! You passed and earned <strong>+{activeQuiz.xpReward} XP</strong>.
                    </div>
                  ) : (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-450 p-4 rounded-2xl text-xs max-w-sm mx-auto font-semibold">
                      You missed too many questions. Retry to score a passing mark and earn XP!
                    </div>
                  )}
                </CardBody>
                <CardFooter className="p-5 flex justify-center bg-slate-50/50 dark:bg-slate-900/10">
                  <Button variant="primary" onClick={() => setActiveQuiz(null)} className="w-full sm:w-auto cursor-pointer">
                    Return to Library
                  </Button>
                </CardFooter>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

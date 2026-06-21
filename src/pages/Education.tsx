import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardHeader, CardBody, CardFooter, Button } from '../components/ui';
import type { Quiz, EducationArticle } from '../types';
import { BookOpen, HelpCircle, CheckCircle, ChevronRight, Zap } from 'lucide-react';

// Data and subcomponents
import { MOCK_ARTICLES, MOCK_QUIZZES } from '../features/education/data/educationData';
import { ArticleDrawer } from '../features/education/components/ArticleDrawer';
import { QuizRunner } from '../features/education/components/QuizRunner';

export const EducationPage: React.FC = () => {
  const { quizzesCompleted, completeQuiz } = useAppStore();

  const [activeArticle, setActiveArticle] = useState<EducationArticle | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

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
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Passed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
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
                    onClick={() => setActiveQuiz(quiz)}
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
        <ArticleDrawer 
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
        />
      )}

      {/* Quiz Runner Modal */}
      {activeQuiz && (
        <QuizRunner 
          activeQuiz={activeQuiz}
          setActiveQuiz={setActiveQuiz}
          completeQuiz={completeQuiz}
        />
      )}
    </div>
  );
};
export default EducationPage;

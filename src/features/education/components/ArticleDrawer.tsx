import React from 'react';
import type { EducationArticle } from '../../../types';
import { CardHeader, CardBody, CardFooter, Button } from '../../../components/ui';

interface ArticleDrawerProps {
  article: EducationArticle;
  onClose: () => void;
}

export const ArticleDrawer: React.FC<ArticleDrawerProps> = ({ article, onClose }) => {
  return (
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
              {article.category} • {article.readTimeMinutes} Min Read
            </span>
            <h3 id="article-title" className="text-xl font-bold font-display text-slate-900 dark:text-slate-50 mt-1">
              {article.title}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 rounded-full cursor-pointer text-slate-400 shrink-0"
            aria-label="Close article"
          >
            ×
          </Button>
        </CardHeader>
        <CardBody className="p-6 overflow-y-auto text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {article.summary}
          </p>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 whitespace-pre-line">
            {article.content}
          </div>
        </CardBody>
        <CardFooter className="p-6 bg-slate-50/50 dark:bg-slate-900/10 flex justify-end">
          <Button variant="secondary" onClick={onClose} className="cursor-pointer">
            Dismiss
          </Button>
        </CardFooter>
      </div>
    </div>
  );
};
export default ArticleDrawer;

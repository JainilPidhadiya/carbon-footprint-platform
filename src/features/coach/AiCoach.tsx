/* eslint-disable react-hooks/purity */
import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui';
import { Sparkles, ArrowRight, Bot, User, MessageSquare } from 'lucide-react';
import { 
  type ChatMessage, 
  formatAiMessage, 
  getResponse, 
  quickPrompts 
} from './coachUtils';
import { filterActivitiesByMonth, sumActivitiesCo2e, getEmissionsByCategory } from '../../utils/activityUtils';

export const AiCoach: React.FC = () => {
  const { activities } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your AI Eco Coach. I analyze your carbon log telemetry and help you optimize your baseline. What can I help you with today?`,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const currentMonthActivities = filterActivitiesByMonth(activities);

  const totalMonthlyEmissions = sumActivitiesCo2e(currentMonthActivities);

  // Group emissions by category to target suggestions
  const categorySums = getEmissionsByCategory(currentMonthActivities);

  const handleSendPrompt = (promptKey: string, promptText: string) => {
    if (isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiReplyText = getResponse(promptKey, currentMonthActivities, totalMonthlyEmissions, categorySums);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-left">
        <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-slate-50 mb-1 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-emerald-500 fill-current" />
          AI Sustainability Coach
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Get real-time carbon data analysis and actionable recommendations from your digital eco coach.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Chat Console */}
        <Card className="md:col-span-2 shadow-lg border-slate-200/60 dark:border-slate-800/80 flex flex-col h-[520px]">
          <CardHeader className="p-4 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/10">
            <Bot className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Eco Coach Core v1.0</span>
            {isTyping && (
              <span className="text-[10px] text-emerald-500 font-bold ml-auto animate-pulse flex items-center gap-1">
                Typing...
              </span>
            )}
          </CardHeader>

          {/* Message scroll area */}
          <CardBody className="p-4 flex-1 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isAi ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600' : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950'
                  }`}>
                    {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    {isAi ? (
                      <div 
                        className="p-3.5 rounded-2xl text-sm leading-relaxed bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ 
                          __html: formatAiMessage(msg.text)
                        }}
                      />
                    ) : (
                      <div 
                        className="p-3.5 rounded-2xl text-sm leading-relaxed bg-gradient-to-br from-emerald-500 to-teal-650 text-white rounded-tr-none whitespace-pre-wrap"
                      >
                        {msg.text}
                      </div>
                    )}
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 max-w-[80%] mr-auto text-left">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-0" />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
          </CardBody>

          <CardFooter className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 flex items-center gap-2">
            <div className="flex-1 text-left text-xs text-slate-400 italic pl-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Select a quick prompt on the right to converse.</span>
            </div>
          </CardFooter>
        </Card>

        {/* Quick Prompts Panel */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 text-left">
            Suggested Prompts
          </h3>
          <div className="flex flex-col gap-3">
            {quickPrompts.map((p) => (
              <button
                key={p.key}
                disabled={isTyping}
                onClick={() => handleSendPrompt(p.key, p.text.substring(2))}
                className="w-full text-left p-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-500 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-emerald-500 rounded-2xl shadow-sm transition-all duration-150 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-450">
                    {p.text}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {p.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AiCoach;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  ChevronRight, 
  RotateCcw, 
  Trophy,
  Loader2,
  BookOpen
} from 'lucide-react';
import { Difficulty, GrammarQuestion, UserAnswer } from '../types';
import { generateGrammarQuestions } from '../lib/gemini';
import { GRAMMAR_CATEGORIES, DIFFICULTIES, ENCOURAGING_WORDS } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GrammarExercise: React.FC = () => {
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [category, setCategory] = useState(GRAMMAR_CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState(Difficulty.INTERMEDIATE);

  const fetchQuestions = async () => {
    setLoading(true);
    const newQuestions = await generateGrammarQuestions(category, difficulty);
    setQuestions(newQuestions);
    setLoading(false);
    setCurrentIndex(0);
    setAnswers([]);
    setIsFinished(false);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOptionClick = (option: string) => {
    if (showExplanation) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect
    };
    
    setAnswers([...answers, newAnswer]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const currentQuestion = questions[currentIndex];
  const score = answers.filter(a => a.isCorrect).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} className="text-cyan-400" />
        </motion.div>
        <p className="text-cyan-200 font-medium animate-pulse">汤小米正在深海为你搜寻题目...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#002533]/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto text-center border-4 border-cyan-500/50"
      >
        <Trophy size={80} className="mx-auto text-cyan-400 mb-6" />
        <h2 className="text-4xl font-bold text-white mb-2">探索完成！</h2>
        <div className="text-6xl font-black text-cyan-400 mb-6">
          {score} <span className="text-2xl text-cyan-700">/ {questions.length}</span>
        </div>
        <p className="text-xl text-cyan-100 mb-8 italic">
          "{ENCOURAGING_WORDS[Math.floor(Math.random() * ENCOURAGING_WORDS.length)]}"
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={fetchQuestions}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold text-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={24} />
            再潜一次
          </button>
          
          <div className="pt-6 border-t border-cyan-900">
            <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-wider mb-4">深海知识库</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#" className="px-4 py-2 bg-cyan-900/50 text-cyan-200 rounded-full text-sm hover:bg-cyan-800 transition-colors">语法百科</a>
              <a href="#" className="px-4 py-2 bg-cyan-900/50 text-cyan-200 rounded-full text-sm hover:bg-cyan-800 transition-colors">错题集锦</a>
              <a href="#" className="px-4 py-2 bg-cyan-900/50 text-cyan-200 rounded-full text-sm hover:bg-cyan-800 transition-colors">名师讲堂</a>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-600 text-white px-4 py-1 rounded-full font-bold text-sm">
            {currentQuestion.difficulty}
          </div>
          <div className="bg-cyan-900/40 backdrop-blur px-4 py-1 rounded-full text-cyan-100 font-medium text-sm border border-cyan-400/20">
            {currentQuestion.category}
          </div>
        </div>
        <div className="text-cyan-100 font-bold bg-cyan-900/20 px-4 py-1 rounded-full">
          进度: {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Question Card */}
      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-[#002533]/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border-b-8 border-cyan-600"
      >
        <div className="mb-12">
          <h2 className="text-2xl md:text-4xl font-medium text-white leading-relaxed">
            {currentQuestion.sentence.split('______').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={cn(
                    "inline-block min-w-[120px] border-b-4 mx-2 text-center transition-all px-4",
                    selectedOption ? "text-cyan-400 border-cyan-400" : "text-transparent border-cyan-900"
                  )}>
                    {selectedOption || "______"}
                  </span>
                )}
              </React.Fragment>
            ))}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              disabled={showExplanation}
              onClick={() => handleOptionClick(option)}
              className={cn(
                "py-4 px-6 rounded-2xl text-xl font-medium transition-all text-left flex items-center justify-between group",
                selectedOption === option 
                  ? "bg-cyan-600 text-white shadow-lg scale-[1.02]" 
                  : "bg-cyan-900/30 text-cyan-100 hover:bg-cyan-800/50 border-2 border-cyan-800/50 hover:border-cyan-400/50",
                showExplanation && option === currentQuestion.correctAnswer && "bg-emerald-600 text-white border-emerald-500",
                showExplanation && selectedOption === option && option !== currentQuestion.correctAnswer && "bg-rose-600 text-white border-rose-500"
              )}
            >
              <span>{option}</span>
              {showExplanation && option === currentQuestion.correctAnswer && <CheckCircle2 size={24} />}
              {showExplanation && selectedOption === option && option !== currentQuestion.correctAnswer && <XCircle size={24} />}
            </button>
          ))}
        </div>

        {/* Action Button */}
        {!showExplanation ? (
          <button
            disabled={!selectedOption}
            onClick={handleSubmit}
            className={cn(
              "w-full py-4 rounded-2xl font-bold text-xl shadow-lg transition-all flex items-center justify-center gap-2",
              selectedOption 
                ? "bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer" 
                : "bg-cyan-900/50 text-cyan-700 cursor-not-allowed"
            )}
          >
            提交答案
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-white text-cyan-900 hover:bg-cyan-50 rounded-2xl font-bold text-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            下一题
            <ChevronRight size={24} />
          </button>
        )}
      </motion.div>

      {/* Explanation Card */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 bg-[#002533]/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-l-8 border-cyan-500"
          >
            <div className="flex items-center gap-2 mb-6 text-cyan-400">
              <BookOpen size={28} />
              <h3 className="text-2xl font-bold">详解卡片</h3>
            </div>
            
            <div className="space-y-6">
              <section>
                <h4 className="text-sm font-bold text-cyan-700 uppercase tracking-widest mb-2">语法规则</h4>
                <div className="text-lg text-cyan-100 leading-relaxed">
                  <ReactMarkdown>{currentQuestion.explanation.rule}</ReactMarkdown>
                </div>
              </section>
              
              <section className="bg-cyan-900/40 p-4 rounded-2xl border border-cyan-800">
                <h4 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-2">例句</h4>
                <div className="text-lg text-white font-medium italic">
                  <ReactMarkdown>{`"${currentQuestion.explanation.example}"`}</ReactMarkdown>
                </div>
              </section>
              
              <section>
                <h4 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-2">常见错误辨析</h4>
                <div className="text-lg text-cyan-200">
                  <ReactMarkdown>{currentQuestion.explanation.commonMistakes}</ReactMarkdown>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Settings Bar */}
      <div className="mt-16 flex flex-wrap justify-center gap-4 opacity-30 hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm p-1 rounded-2xl border border-white/5">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent px-3 py-1 text-xs text-cyan-300 font-medium focus:outline-none cursor-pointer"
          >
            {GRAMMAR_CATEGORIES.map(c => <option key={c} value={c} className="bg-[#001d3d]">{c}</option>)}
          </select>
          <div className="w-px h-4 bg-white/10" />
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="bg-transparent px-3 py-1 text-xs text-cyan-300 font-medium focus:outline-none cursor-pointer"
          >
            {DIFFICULTIES.map(d => <option key={d} value={d} className="bg-[#001d3d]">{d}</option>)}
          </select>
          <button 
            onClick={fetchQuestions}
            className="bg-cyan-500/20 text-cyan-400 px-4 py-1 rounded-xl text-xs font-bold hover:bg-cyan-500/40 transition-colors"
          >
            刷新
          </button>
        </div>
      </div>
    </div>
  );
};

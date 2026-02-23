import React from 'react';
import { SeaBubbles } from './components/SeaBubbles';
import { GrammarExercise } from './components/GrammarExercise';
import { Waves } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#001219] relative overflow-x-hidden font-sans text-cyan-50">
      {/* Background Animation */}
      <SeaBubbles />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Minimal Header */}
        <header className="py-12 px-8 flex flex-col items-center justify-center gap-2">
          <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-lg">汤小米英语</h1>
          <div className="h-1 w-12 bg-cyan-500 rounded-full" />
        </header>

        {/* Exercise Component */}
        <main className="pb-20">
          <GrammarExercise />
        </main>

        {/* Footer */}
        <footer className="py-12 text-center text-cyan-900/60 font-medium">
          <p>© 2026 汤小米英语教育 · 沉浸式语法学习</p>
        </footer>
      </div>
    </div>
  );
}

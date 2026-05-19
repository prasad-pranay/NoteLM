import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

export default function QuizAttemptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  // Try public quiz first, fall back to own quiz
  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quizAttempt', id],
    queryFn: async () => {
      try {
        const res = await api.get(`/public/quizzes/${id}`);
        return res.data.data;
      } catch {
        const res = await api.get(`/quiz/${id}`);
        return res.data.data;
      }
    },
  });

  // Timer
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const submitMut = useMutation({
    mutationFn: (payload) => api.post(`/public/quizzes/${id}/attempt`, payload),
    onSuccess: (res) => { setResults(res.data.data); setSubmitted(true); toast.success(`Score: ${res.data.data.score}%`); },
    onError: (err) => toast.error(err.response?.data?.message || 'Submission failed'),
  });

  const handleSelect = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    const formatted = Object.entries(answers).map(([questionId, selectedAnswer]) => ({ questionId, selectedAnswer }));
    submitMut.mutate({ answers: formatted, timeTaken: timeElapsed });
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (isLoading) return <div className="text-center py-12 text-surface-500">Loading quiz...</div>;
  if (!quiz) return <div className="text-center py-16 text-surface-400">Quiz not found</div>;

  const questions = quiz.questions || [];
  const q = questions[currentQ];

  // Results view
  if (submitted && results) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
          <div className={`text-6xl font-bold mb-2 ${results.score >= 70 ? 'text-success' : results.score >= 40 ? 'text-warning' : 'text-danger'}`}>{results.score}%</div>
          <p className="text-surface-400">{results.correctCount} / {results.total} correct • {formatTime(timeElapsed)}</p>
        </motion.div>
        <div className="space-y-4">
          {results.results?.map((r, i) => (
            <div key={i} className={`glass rounded-2xl p-5 border-l-4 ${r.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <div className="flex items-start gap-3">
                {r.isCorrect ? <HiOutlineCheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" /> : <HiOutlineXCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-surface-200 font-medium">{r.questionText}</p>
                  {!r.isCorrect && <p className="text-sm text-red-400 mt-1">Your answer: {r.selectedAnswer}</p>}
                  <p className="text-sm text-green-400 mt-1">Correct: {r.correctAnswer}</p>
                  {r.explanation && <p className="text-xs text-surface-500 mt-2 bg-surface-800/30 rounded-lg p-3">{r.explanation}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center pt-4">
          <button onClick={() => navigate('/explore')} className="px-6 py-2.5 rounded-xl bg-surface-800 text-surface-300 hover:bg-surface-700 transition">Back to Explore</button>
          <button onClick={() => { setSubmitted(false); setResults(null); setAnswers({}); setCurrentQ(0); setTimeElapsed(0); }}
            className="px-6 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition">Retry</button>
        </div>
      </div>
    );
  }

  // Quiz taking view
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-100">{quiz.title}</h1>
          <p className="text-xs text-surface-500">{quiz.topic} • {questions.length} questions</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800/50 border border-white/5">
          <HiOutlineClock className="w-4 h-4 text-surface-400" />
          <span className="text-sm font-mono text-surface-300">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-500 to-accent transition-all duration-300 rounded-full"
          style={{ width: `${((Object.keys(answers).length) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      {q && (
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span className={`px-2 py-0.5 rounded-md capitalize ${q.difficulty === 'easy' ? 'bg-green-500/10 text-green-400' : q.difficulty === 'hard' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{q.difficulty}</span>
            <span className="px-2 py-0.5 rounded-md bg-surface-800 text-surface-400 uppercase">{q.type}</span>
          </div>
          <p className="text-lg text-surface-200 font-medium">{q.questionText}</p>

          {(q.type === 'mcq' || q.type === 'truefalse') && q.options?.length > 0 ? (
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleSelect(q._id, opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${answers[q._id] === opt ? 'border-primary-500 bg-primary-600/15 text-primary-300' : 'border-white/5 bg-surface-800/30 text-surface-300 hover:border-white/10 hover:bg-surface-800/50'}`}>
                  <span className="inline-block w-6 h-6 rounded-full border border-current text-center mr-3 text-xs leading-6">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input value={answers[q._id] || ''} onChange={(e) => handleSelect(q._id, e.target.value)} placeholder="Type your answer..."
              className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-white/10 text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition" />
          )}
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
          className="px-5 py-2.5 rounded-xl bg-surface-800/50 text-surface-300 hover:bg-surface-700/50 disabled:opacity-30 transition text-sm">Previous</button>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQ(i)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition ${currentQ === i ? 'bg-primary-600 text-white' : answers[questions[i]?._id] ? 'bg-primary-600/20 text-primary-400' : 'bg-surface-800/50 text-surface-500'}`}>{i + 1}</button>
          ))}
        </div>
        {currentQ < questions.length - 1 ? (
          <button onClick={() => setCurrentQ(currentQ + 1)} className="px-5 py-2.5 rounded-xl bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 transition text-sm">Next</button>
        ) : (
          <button onClick={handleSubmit} disabled={submitMut.isPending || Object.keys(answers).length === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent text-white font-medium hover:opacity-90 transition disabled:opacity-40 text-sm">
            {submitMut.isPending ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}

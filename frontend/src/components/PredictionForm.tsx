"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle, XCircle, BarChart3, TrendingUp, User, Briefcase, GraduationCap, Phone, Calendar } from 'lucide-react';

interface Result {
  prediction: string;
  confidence: number;
  probabilities: {
    Yes: number;
    No: number;
  };
}

export default function PredictionForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [formData, setFormData] = useState({
    age: 39,
    job: 'management',
    marital: 'married',
    education: 'tertiary',
    default: 'no',
    balance: 550,
    housing: 'yes',
    loan: 'no',
    contact: 'cellular',
    day: 15,
    month: 'may',
    duration: 255,
    campaign: 2,
    pdays: -1,
    previous: 0,
    poutcome: 'unknown'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to backend. Make sure FastAPI is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['age', 'balance', 'day', 'duration', 'campaign', 'pdays', 'previous'].includes(name) 
        ? parseFloat(value) 
        : value
    }));
  };

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 hover:bg-white/10";
  const labelClasses = "block text-gray-400 text-sm mb-2 ml-1 flex items-center gap-2";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto p-4">
      {/* Form Section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card rounded-3xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 text-cyan-500/20">
          <TrendingUp size={120} />
        </div>
        
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent underline decoration-cyan-500/30">
          Lead Intelligence
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}><User size={16}/> Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}><BarChart3 size={16}/> Balance ($)</label>
              <input type="number" name="balance" value={formData.balance} onChange={handleChange} className={inputClasses} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}><Briefcase size={16}/> Occupation</label>
              <select name="job" value={formData.job} onChange={handleChange} className={inputClasses}>
                {['management', 'technician', 'entrepreneur', 'blue-collar', 'retired', 'admin.', 'services', 'self-employed', 'unemployed', 'housemaid', 'student', 'unknown'].map(j => (
                  <option key={j} value={j} className="bg-gray-900">{j}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}><GraduationCap size={16}/> Education</label>
              <select name="education" value={formData.education} onChange={handleChange} className={inputClasses}>
                {['primary', 'secondary', 'tertiary', 'unknown'].map(e => (
                  <option key={e} value={e} className="bg-gray-900">{e}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}><Phone size={16}/> Last Call Duration (s)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}><Calendar size={16}/> Contact Month</label>
              <select name="month" value={formData.month} onChange={handleChange} className={inputClasses}>
                {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(m => (
                  <option key={m} value={m} className="bg-gray-900">{m}</option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-500 ${
              loading 
              ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]'
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Analyzing Dynamics...
              </>
            ) : (
              <>
                <Send size={20} /> Generate Prediction
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Result Section */}
      <div className="flex flex-col gap-6">
        <AnimatePresence mode='wait'>
          {result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`glass-card rounded-3xl p-8 border-t-4 ${
                result.prediction === 'Yes' ? 'border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.2)]' : 'border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.2)]'
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Prediction Outcome</p>
                  <h3 className={`text-5xl font-black ${result.prediction === 'Yes' ? 'text-cyan-400' : 'text-purple-400'}`}>
                    {result.prediction === 'Yes' ? 'SUCCEED' : 'DECLINE'}
                  </h3>
                </div>
                <div className={result.prediction === 'Yes' ? 'text-cyan-400' : 'text-purple-400'}>
                  {result.prediction === 'Yes' ? <CheckCircle size={64} /> : <XCircle size={64} />}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Confidence Score</span>
                    <span className="text-white font-mono">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${result.prediction === 'Yes' ? 'bg-cyan-500' : 'bg-purple-500'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Probability: YES</p>
                    <p className="text-2xl font-bold text-cyan-400">{(result.probabilities.Yes * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Probability: NO</p>
                    <p className="text-2xl font-bold text-purple-400">{(result.probabilities.No * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10 h-full"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
                <BarChart3 size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">Awaiting Intelligence</h3>
              <p className="text-gray-600 max-w-xs">Input customer dynamics to visualize conversion potential in real-time.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

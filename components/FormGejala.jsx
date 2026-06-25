'use client';

import React, { useState } from 'react';
import { Check, ClipboardList, AlertCircle, RefreshCw } from 'lucide-react';

export default function FormGejala({ gejalaList, perangkatNama, onSubmit }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group symptoms by category
  const groupedGejala = gejalaList.reduce((acc, curr) => {
    if (!acc[curr.kategori]) {
      acc[curr.kategori] = [];
    }
    acc[curr.kategori].push(curr);
    return acc;
  }, {});

  const handleToggle = (id) => {
    setError('');
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClear = () => {
    setSelectedIds([]);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      setError('Pilih minimal 1 gejala untuk mendiagnosa kerusakan.');
      return;
    }
    setIsSubmitting(true);
    onSubmit(selectedIds);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
      {/* Form Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Daftar Gejala Kerusakan</h2>
            <p className="text-xs text-slate-400 mt-1">Centang gejala-gejala yang terjadi pada {perangkatNama.toLowerCase()} Anda.</p>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="self-start md:self-auto flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors py-1.5 px-3 bg-rose-950/20 border border-rose-900/30 rounded-lg"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Pilihan ({selectedIds.length})
          </button>
        )}
      </div>

      {/* Symptoms List (Grouped) */}
      <div className="space-y-6">
        {Object.keys(groupedGejala).map((kategori) => (
          <div key={kategori} className="space-y-3">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase bg-slate-800/40 px-3 py-1.5 rounded-lg inline-block">
              {kategori}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {groupedGejala[kategori].map((gejala) => {
                const isChecked = selectedIds.includes(gejala.id);
                return (
                  <label
                    key={gejala.id}
                    onClick={() => handleToggle(gejala.id)}
                    className={`
                      flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none
                      ${isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-white hover:border-emerald-500/60 shadow-lg shadow-emerald-950/10'
                        : 'bg-slate-950/30 border-slate-800/80 text-slate-300 hover:border-slate-700/60 hover:bg-slate-950/40'
                      }
                    `}
                  >
                    {/* Checkbox box */}
                    <div className="mt-0.5 flex-shrink-0">
                      <div className={`
                        h-5 w-5 rounded-md flex items-center justify-center transition-all duration-200 border
                        ${isChecked
                          ? 'bg-emerald-500 border-emerald-500 text-slate-900'
                          : 'bg-slate-900 border-slate-700'
                        }
                      `}>
                        {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Symptom Info */}
                    <div className="flex-1">
                      <span className="text-sm font-medium leading-relaxed block">{gejala.deskripsi}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">{gejala.id}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2.5 p-4 bg-rose-950/20 border border-rose-900/30 text-rose-400 rounded-2xl text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Submission */}
      <div className="border-t border-slate-800 pt-6 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          Terpilih: <span className="font-bold text-emerald-400">{selectedIds.length} gejala</span>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center px-6 py-3 bg-emerald-500 text-slate-900 font-bold rounded-2xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-emerald-500/10 cursor-pointer"
        >
          {isSubmitting ? 'Menganalisis...' : 'Analisis Kerusakan'}
        </button>
      </div>
    </form>
  );
}

'use client'

import { Languages } from 'lucide-react'
import { languageNames, useLanguage, type Language } from '@/lib/language'

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()
  return <div className="flex items-center gap-1 rounded-xl border border-[#d8e7e2] bg-white p-1" aria-label={t('switchLanguage')}><Languages size={16} className="ml-2 text-[#187864]" />{(Object.keys(languageNames) as Language[]).map((option) => <button key={option} type="button" aria-label={languageNames[option]} aria-pressed={language === option} onClick={() => setLanguage(option)} className={`rounded-lg px-2 py-1.5 text-xs font-bold transition ${language === option ? 'bg-[#187864] text-white' : 'text-[#58736c] hover:bg-[#eff7f4]'}`}>{option.toUpperCase()}</button>)}</div>
}

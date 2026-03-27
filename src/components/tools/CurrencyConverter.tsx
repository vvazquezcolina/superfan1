'use client'

import { useState } from 'react'
import { ArrowLeftRight, DollarSign, TrendingUp, RefreshCw, Globe } from 'lucide-react'
import { trackToolUsage } from '@/lib/analytics'

// ---------------------------------------------------------------------------
// Static exchange rates (all relative to USD 1.00)
// Last updated: 2026-03-26 — update manually each quarter
// ---------------------------------------------------------------------------

const RATES_LAST_UPDATED = '2026-03-26'

const RATES_TO_USD: Record<string, number> = {
  USD: 1,
  MXN: 0.0499,    // 1 MXN = 0.0499 USD  (~20.04 MXN per USD)
  CAD: 0.7375,    // 1 CAD = 0.7375 USD  (~1.356 CAD per USD)
  EUR: 1.082,     // 1 EUR = 1.082 USD
  GBP: 1.268,     // 1 GBP = 1.268 USD
  BRL: 0.1765,    // 1 BRL = 0.1765 USD  (~5.66 BRL per USD)
  ARS: 0.000865,  // 1 ARS = 0.000865 USD (~1156 ARS per USD)
  COP: 0.000231,  // 1 COP = 0.000231 USD (~4329 COP per USD)
}

const CURRENCIES = [
  { code: 'USD', label: 'USD — Dólar Estadounidense', flag: '🇺🇸' },
  { code: 'MXN', label: 'MXN — Peso Mexicano', flag: '🇲🇽' },
  { code: 'CAD', label: 'CAD — Dólar Canadiense', flag: '🇨🇦' },
  { code: 'EUR', label: 'EUR — Euro', flag: '🇪🇺' },
  { code: 'GBP', label: 'GBP — Libra Esterlina', flag: '🇬🇧' },
  { code: 'BRL', label: 'BRL — Real Brasileño', flag: '🇧🇷' },
  { code: 'ARS', label: 'ARS — Peso Argentino', flag: '🇦🇷' },
  { code: 'COP', label: 'COP — Peso Colombiano', flag: '🇨🇴' },
]

function convert(amount: number, from: string, to: string): number {
  if (from === to) return amount
  const inUSD = amount * (RATES_TO_USD[from] ?? 1)
  return inUSD / (RATES_TO_USD[to] ?? 1)
}

function formatCurrency(value: number, code: string): string {
  // For very large numbers (ARS, COP) use compact notation
  if (value > 100000) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }
  if (value > 1000) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 })
  }
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface CurrencyConverterDict {
  currencyAmount: string
  currencyFrom: string
  currencyTo: string
  currencyConvert: string
  currencyResult: string
  currencyLastUpdated: string
  currencyDisclaimer: string
  currencyQuickRef: string
  currencyInMexico: string
  currencyInUSA: string
  currencyInCanada: string
}

interface CurrencyConverterProps {
  lang: 'es' | 'en'
  dict: CurrencyConverterDict
}

export function CurrencyConverter({ lang, dict }: CurrencyConverterProps) {
  const [amount, setAmount] = useState('100')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('MXN')
  const [result, setResult] = useState<number | null>(null)
  const [hasConverted, setHasConverted] = useState(false)

  function handleConvert(e: React.FormEvent) {
    e.preventDefault()
    const num = parseFloat(amount)
    if (isNaN(num) || num <= 0) return
    const converted = convert(num, fromCurrency, toCurrency)
    setResult(converted)
    setHasConverted(true)
    trackToolUsage('currency_converter')
  }

  function swapCurrencies() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult(null)
    setHasConverted(false)
  }

  const inputClass =
    'w-full rounded-xl border border-gray-200 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white shadow-sm transition-shadow focus:shadow-md'
  const labelClass = 'flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5'

  // Quick reference: how much is $100 USD in host countries
  const usd100InMXN = convert(100, 'USD', 'MXN')
  const usd100InCAD = convert(100, 'USD', 'CAD')

  const fromCurrencyObj = CURRENCIES.find((c) => c.code === fromCurrency)
  const toCurrencyObj = CURRENCIES.find((c) => c.code === toCurrency)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Converter form */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
        <form onSubmit={handleConvert} className="space-y-5">
          <div>
            <label htmlFor="amount" className={labelClass}>
              <DollarSign className="w-4 h-4 text-primary" />
              {dict.currencyAmount}
            </label>
            <input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setHasConverted(false)
              }}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <div>
              <label htmlFor="fromCurrency" className={labelClass}>
                <TrendingUp className="w-4 h-4 text-primary" />
                {dict.currencyFrom}
              </label>
              <select
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => { setFromCurrency(e.target.value); setHasConverted(false) }}
                className={inputClass}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={swapCurrencies}
              className="mb-0.5 p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-primary/5 hover:border-primary/30 active:scale-95 transition-all duration-150 text-gray-500 hover:text-primary shadow-sm"
              aria-label={lang === 'es' ? 'Intercambiar monedas' : 'Swap currencies'}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            <div>
              <label htmlFor="toCurrency" className={labelClass}>
                <Globe className="w-4 h-4 text-primary" />
                {dict.currencyTo}
              </label>
              <select
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => { setToCurrency(e.target.value); setHasConverted(false) }}
                className={inputClass}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            {dict.currencyConvert}
          </button>
        </form>
      </div>

      {/* Result */}
      {hasConverted && result !== null && (
        <div className="mt-5 rounded-2xl border border-primary/25 bg-white shadow-sm p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary/70 mb-3">
            {dict.currencyResult}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-gray-600">
                {fromCurrencyObj?.flag} {formatCurrency(parseFloat(amount), fromCurrency)}
              </span>
              <span className="text-sm text-gray-400">{fromCurrency}</span>
            </div>
            <span className="text-gray-300 text-2xl font-light">=</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-primary">
                {toCurrencyObj?.flag} {formatCurrency(result, toCurrency)}
              </span>
              <span className="text-base font-semibold text-primary/70">{toCurrency}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
            {dict.currencyLastUpdated} {RATES_LAST_UPDATED} &bull; {dict.currencyDisclaimer}
          </p>
        </div>
      )}

      {/* All currencies table */}
      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 px-1">
          <Globe className="w-4 h-4 text-primary" />
          {lang === 'es'
            ? `1 ${fromCurrency} en todas las monedas`
            : `1 ${fromCurrency} in all currencies`}
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {lang === 'es' ? 'Moneda' : 'Currency'}
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  {lang === 'es' ? `1 ${fromCurrency} =` : `1 ${fromCurrency} =`}
                </th>
              </tr>
            </thead>
            <tbody>
              {CURRENCIES.filter((c) => c.code !== fromCurrency).map((c, i) => (
                <tr
                  key={c.code}
                  className={`transition-colors duration-100 hover:bg-primary/5 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-4 py-3 text-gray-700">
                    {c.flag} {c.label}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    {formatCurrency(convert(1, fromCurrency, c.code), c.code)}{' '}
                    <span className="text-gray-500 font-normal">{c.code}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Reference Card */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          {dict.currencyQuickRef}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center transition-transform duration-150 hover:scale-[1.02]">
            <p className="text-2xl mb-1">🇲🇽</p>
            <p className="text-xs text-gray-500 mb-1">{dict.currencyInMexico}</p>
            <p className="text-xl font-bold text-green-700">
              {formatCurrency(usd100InMXN, 'MXN')} MXN
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-center transition-transform duration-150 hover:scale-[1.02]">
            <p className="text-2xl mb-1">🇺🇸</p>
            <p className="text-xs text-gray-500 mb-1">{dict.currencyInUSA}</p>
            <p className="text-xl font-bold text-blue-700">$100.00 USD</p>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center transition-transform duration-150 hover:scale-[1.02]">
            <p className="text-2xl mb-1">🇨🇦</p>
            <p className="text-xs text-gray-500 mb-1">{dict.currencyInCanada}</p>
            <p className="text-xl font-bold text-red-700">
              {formatCurrency(usd100InCAD, 'CAD')} CAD
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          {dict.currencyLastUpdated} {RATES_LAST_UPDATED}
        </p>
      </div>
    </div>
  )
}

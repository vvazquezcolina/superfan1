'use client';

import React from 'react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Analytics de Transacciones
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Análisis detallado de transacciones, tendencias y métricas del sistema Mandala Wallet.
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-mandala-primary text-white rounded-lg text-sm font-medium">
          Hoy
        </button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600">
          Esta Semana
        </button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600">
          Este Mes
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transacciones</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">1,247</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l3-3m0 0l3 3m-3-3v8" />
            </svg>
            <span className="ml-1 text-sm font-medium text-green-600">+12.5%</span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">vs período anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Volumen Total</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">$2.85M MXN</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l3-3m0 0l3 3m-3-3v8" />
            </svg>
            <span className="ml-1 text-sm font-medium text-green-600">+18.7%</span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">vs período anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ticket Promedio</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">$2,284 MXN</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l3-3m0 0l3 3m-3-3v8" />
            </svg>
            <span className="ml-1 text-sm font-medium text-green-600">+5.8%</span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">vs período anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasa de Éxito</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">96.8%</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span className="ml-1 text-sm font-medium text-red-600">-0.3%</span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">vs período anterior</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Transactions Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Transacciones por Hora
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">21:00</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-mandala-primary h-3 rounded-full" style={{width: '95%'}}></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">189</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">20:00</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-mandala-primary h-3 rounded-full" style={{width: '84%'}}></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">167</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">19:00</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-mandala-primary h-3 rounded-full" style={{width: '73%'}}></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">145</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">18:00</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="bg-mandala-primary h-3 rounded-full" style={{width: '62%'}}></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">124</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Métodos de Pago
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Tarjeta de Crédito</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">43.5%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Wallet Balance</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">31.2%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Efectivo</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">18.8%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Crypto</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">6.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Insights Clave
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Método de Pago Preferido</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tarjeta de Crédito es el método más utilizado (43.5% del volumen total)
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Hora Pico</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                21:00-22:00 registra la mayor actividad transaccional (189 transacciones)
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Tendencia General</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Crecimiento del 18.7% en volumen vs período anterior (+12.5% en cantidad)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Exportar Datos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Descarga reportes detallados para análisis externo
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Exportar CSV
            </button>
            <button className="px-4 py-2 bg-mandala-primary text-white rounded-lg hover:bg-mandala-primary/90 transition-colors">
              Exportar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
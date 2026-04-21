import { Wallet, TrendingUp, TrendingDown, CreditCard, Banknote } from 'lucide-react';

interface DashboardProps {
  totalBalance: number;
  cashBalance: number;
  transferBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export function Dashboard({
  totalBalance,
  cashBalance,
  transferBalance,
  monthlyIncome,
  monthlyExpenses
}: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Balance Total */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg">
        <div className="relative z-10">
          <p className="text-blue-100 text-sm opacity-90">Balance Total</p>
          <h1 className="text-white text-4xl mt-2">${totalBalance.toLocaleString('es-AR')}</h1>
          <div className="flex items-center gap-2 mt-4">
            <Wallet className="text-blue-100" size={18} />
            <p className="text-blue-50 text-sm">Saldo disponible</p>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10"></div>
        <div className="absolute -right-4 -bottom-4 size-24 rounded-full bg-white/5"></div>
      </div>

      {/* Desglose Efectivo vs Transferencias */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-full bg-emerald-100 p-2">
              <Banknote className="text-emerald-600" size={18} />
            </div>
            <p className="text-gray-600 text-sm">Efectivo</p>
          </div>
          <p className="text-gray-900 text-2xl">${cashBalance.toLocaleString('es-AR')}</p>
        </div>

        <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-full bg-purple-100 p-2">
              <CreditCard className="text-purple-600" size={18} />
            </div>
            <p className="text-gray-600 text-sm">Bancos</p>
          </div>
          <p className="text-gray-900 text-2xl">${transferBalance.toLocaleString('es-AR')}</p>
        </div>
      </div>

      {/* Resumen Mensual */}
      <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
        <h3 className="text-gray-900 mb-4">Resumen del Mes</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <TrendingUp className="text-green-600" size={18} />
              </div>
              <span className="text-gray-700">Ingresos</span>
            </div>
            <span className="text-green-600">${monthlyIncome.toLocaleString('es-AR')}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <TrendingDown className="text-red-600" size={18} />
              </div>
              <span className="text-gray-700">Egresos</span>
            </div>
            <span className="text-red-600">-${monthlyExpenses.toLocaleString('es-AR')}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Balance</span>
              <span className={monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'}>
                ${(monthlyIncome - monthlyExpenses).toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

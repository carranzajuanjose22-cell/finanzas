import { Home, Zap, Wifi, Phone, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  icon: string;
  dueDay: number;
}

interface RecurringExpensesProps {
  expenses: RecurringExpense[];
  onAdd: (expense: Omit<RecurringExpense, 'id'>) => void;
  onDelete: (id: string) => void;
}

const iconOptions: Record<string, any> = {
  home: Home,
  zap: Zap,
  wifi: Wifi,
  phone: Phone
};

export function RecurringExpenses({ expenses, onAdd, onDelete }: RecurringExpensesProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [icon, setIcon] = useState('zap');
  const [dueDay, setDueDay] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      amount: parseFloat(amount),
      icon,
      dueDay: parseInt(dueDay)
    });
    setName('');
    setAmount('');
    setIcon('zap');
    setDueDay('1');
    setShowForm(false);
  };

  const getDaysUntilDue = (dueDay: number) => {
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    if (dueDay >= currentDay) {
      return dueDay - currentDay;
    } else {
      return (daysInMonth - currentDay) + dueDay;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Gastos Fijos</h2>
          <p className="text-gray-500 text-sm">Pagos recurrentes mensuales</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full p-3 bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-lg"
        >
          <Plus size={20} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm space-y-4">
          <div>
            <label className="text-gray-700 text-sm mb-2 block">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Alquiler, Internet..."
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm mb-2 block">Monto</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              step="0.01"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm mb-2 block">Día de vencimiento</label>
            <input
              type="number"
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              min="1"
              max="31"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm mb-2 block">Ícono</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(iconOptions).map(([key, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setIcon(key)}
                  className={`rounded-xl p-4 border-2 transition-all ${
                    icon === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Icon size={24} className={icon === key ? 'text-blue-600 mx-auto' : 'text-gray-600 mx-auto'} />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white py-3 transition-colors"
          >
            Agregar Gasto Fijo
          </button>
        </form>
      )}

      <div className="space-y-2">
        {expenses.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No hay gastos fijos configurados</p>
          </div>
        ) : (
          expenses.map((expense) => {
            const Icon = iconOptions[expense.icon];
            const daysUntil = getDaysUntilDue(expense.dueDay);
            const isUrgent = daysUntil <= 3;

            return (
              <div
                key={expense.id}
                className={`rounded-2xl bg-white border-2 p-4 shadow-sm transition-all ${
                  isUrgent ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`rounded-full p-3 ${
                      isUrgent ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <Icon size={20} className={isUrgent ? 'text-orange-600' : 'text-gray-600'} />
                    </div>
                    <div>
                      <p className="text-gray-900">{expense.name}</p>
                      <p className={`text-sm ${isUrgent ? 'text-orange-600' : 'text-gray-500'}`}>
                        {daysUntil === 0 ? 'Vence hoy' : `Vence en ${daysUntil} ${daysUntil === 1 ? 'día' : 'días'}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-gray-900">${expense.amount.toLocaleString('es-AR')}</p>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="rounded-full p-2 hover:bg-red-100 text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

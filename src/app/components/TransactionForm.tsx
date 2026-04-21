import { useState } from 'react';
import { X, Calendar, Tag, FileText, DollarSign, CreditCard, Banknote } from 'lucide-react';

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (transaction: Transaction) => void;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  method: 'cash' | 'transfer';
  description: string;
  date: string;
}

const categories = {
  income: ['Salario', 'Freelance', 'Venta', 'Inversión', 'Otro'],
  expense: ['Alimentos', 'Transporte', 'Servicios', 'Entretenimiento', 'Salud', 'Ropa', 'Otro']
};

export function TransactionForm({ onClose, onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [method, setMethod] = useState<'cash' | 'transfer'>('transfer');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      category: category || categories[type][0],
      method,
      description,
      date
    };

    onSubmit(transaction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900">Nuevo Movimiento</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tipo de Transacción */}
          <div>
            <label className="text-gray-700 text-sm mb-2 block">Tipo</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`rounded-2xl p-4 border-2 transition-all ${
                  type === 'income'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className={type === 'income' ? 'text-green-700' : 'text-gray-700'}>
                  Ingreso
                </span>
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`rounded-2xl p-4 border-2 transition-all ${
                  type === 'expense'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className={type === 'expense' ? 'text-red-700' : 'text-gray-700'}>
                  Egreso
                </span>
              </button>
            </div>
          </div>

          {/* Monto */}
          <div>
            <label className="text-gray-700 text-sm mb-2 block">Monto</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                step="0.01"
                className="w-full rounded-2xl border border-gray-200 px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Método de Pago */}
          <div>
            <label className="text-gray-700 text-sm mb-2 block">Método de Pago</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`rounded-2xl p-4 border-2 transition-all flex items-center justify-center gap-2 ${
                  method === 'cash'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Banknote size={18} className={method === 'cash' ? 'text-emerald-600' : 'text-gray-600'} />
                <span className={method === 'cash' ? 'text-emerald-700' : 'text-gray-700'}>
                  Efectivo
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('transfer')}
                className={`rounded-2xl p-4 border-2 transition-all flex items-center justify-center gap-2 ${
                  method === 'transfer'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <CreditCard size={18} className={method === 'transfer' ? 'text-purple-600' : 'text-gray-600'} />
                <span className={method === 'transfer' ? 'text-purple-700' : 'text-gray-700'}>
                  Banco
                </span>
              </button>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="text-gray-700 text-sm mb-2 block">Categoría</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {categories[type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="text-gray-700 text-sm mb-2 block">Fecha</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-gray-700 text-sm mb-2 block">Descripción (opcional)</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-gray-400" size={20} />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Agregar notas..."
                rows={3}
                className="w-full rounded-2xl border border-gray-200 px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600 text-white py-4 transition-colors shadow-lg shadow-blue-500/30"
          >
            Guardar Movimiento
          </button>
        </form>
      </div>
    </div>
  );
}

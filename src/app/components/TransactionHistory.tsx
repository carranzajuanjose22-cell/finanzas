import { ShoppingCart, Car, Zap, Smile, Heart, Shirt, DollarSign, Briefcase, TrendingUp, CreditCard, Banknote, Filter } from 'lucide-react';
import { useState } from 'react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  method: 'cash' | 'transfer';
  description: string;
  date: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const categoryIcons: Record<string, any> = {
  'Alimentos': ShoppingCart,
  'Transporte': Car,
  'Servicios': Zap,
  'Entretenimiento': Smile,
  'Salud': Heart,
  'Ropa': Shirt,
  'Salario': Briefcase,
  'Freelance': Briefcase,
  'Venta': TrendingUp,
  'Inversión': TrendingUp,
  'Otro': DollarSign
};

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterMethod, setFilterMethod] = useState<'all' | 'cash' | 'transfer'>('all');

  const filteredTransactions = transactions.filter(t => {
    const typeMatch = filterType === 'all' || t.type === filterType;
    const methodMatch = filterMethod === 'all' || t.method === filterMethod;
    return typeMatch && methodMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groupedByDate = sortedTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-1 rounded-full bg-white border border-gray-200 p-1 shadow-sm shrink-0">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              filterType === 'all' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              filterType === 'income' ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              filterType === 'expense' ? 'bg-red-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Egresos
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-white border border-gray-200 p-1 shadow-sm shrink-0">
          <button
            onClick={() => setFilterMethod('all')}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              filterMethod === 'all' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterMethod('cash')}
            className={`rounded-full px-3 py-2 text-sm transition-colors flex items-center gap-1 ${
              filterMethod === 'cash' ? 'bg-emerald-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Banknote size={14} />
          </button>
          <button
            onClick={() => setFilterMethod('transfer')}
            className={`rounded-full px-3 py-2 text-sm transition-colors flex items-center gap-1 ${
              filterMethod === 'transfer' ? 'bg-purple-500 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CreditCard size={14} />
          </button>
        </div>
      </div>

      {/* Lista de Transacciones */}
      <div className="space-y-6">
        {Object.entries(groupedByDate).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Filter size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No hay movimientos para mostrar</p>
          </div>
        ) : (
          Object.entries(groupedByDate).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-gray-500 text-sm mb-3 px-1">{formatDate(date)}</h3>
              <div className="space-y-2">
                {items.map((transaction) => {
                  const Icon = categoryIcons[transaction.category] || DollarSign;
                  return (
                    <div
                      key={transaction.id}
                      className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`rounded-full p-3 shrink-0 ${
                            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <Icon
                              size={20}
                              className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 truncate">{transaction.category}</p>
                            {transaction.description && (
                              <p className="text-gray-500 text-sm truncate">{transaction.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {transaction.method === 'cash' ? (
                                <Banknote size={12} className="text-emerald-600" />
                              ) : (
                                <CreditCard size={12} className="text-purple-600" />
                              )}
                              <span className="text-gray-400 text-xs">
                                {transaction.method === 'cash' ? 'Efectivo' : 'Banco'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className={`${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('es-AR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

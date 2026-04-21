import { useState } from 'react';
import { Plus, Home, History, Calendar, Settings } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionHistory } from './components/TransactionHistory';
import { RecurringExpenses } from './components/RecurringExpenses';
import { UpcomingReminders } from './components/UpcomingReminders';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  method: 'cash' | 'transfer';
  description: string;
  date: string;
}

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  icon: string;
  dueDay: number;
}

interface Reminder {
  id: string;
  title: string;
  amount: number;
  date: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'recurring' | 'reminders'>('home');
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      amount: 150000,
      category: 'Salario',
      method: 'transfer',
      description: 'Salario mensual',
      date: '2026-04-01'
    },
    {
      id: '2',
      type: 'expense',
      amount: 45000,
      category: 'Alimentos',
      method: 'transfer',
      description: 'Supermercado',
      date: '2026-04-18'
    },
    {
      id: '3',
      type: 'expense',
      amount: 8500,
      category: 'Transporte',
      method: 'cash',
      description: 'Combustible',
      date: '2026-04-19'
    },
    {
      id: '4',
      type: 'income',
      amount: 25000,
      category: 'Freelance',
      method: 'transfer',
      description: 'Proyecto web',
      date: '2026-04-15'
    },
    {
      id: '5',
      type: 'expense',
      amount: 12000,
      category: 'Entretenimiento',
      method: 'transfer',
      description: 'Cine y cena',
      date: '2026-04-20'
    }
  ]);

  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([
    { id: '1', name: 'Alquiler', amount: 60000, icon: 'home', dueDay: 5 },
    { id: '2', name: 'Internet', amount: 8500, icon: 'wifi', dueDay: 10 },
    { id: '3', name: 'Luz', amount: 12000, icon: 'zap', dueDay: 15 }
  ]);

  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', title: 'Pago Cliente XYZ', amount: 80000, date: '2026-04-25' },
    { id: '2', title: 'Freelance - Diseño Logo', amount: 35000, date: '2026-04-30' }
  ]);

  const calculateTotals = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const cashBalance = transactions
      .filter(t => t.method === 'cash')
      .reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);

    const transferBalance = transactions
      .filter(t => t.method === 'transfer')
      .reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyIncome = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'income' &&
               tDate.getMonth() === currentMonth &&
               tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' &&
               tDate.getMonth() === currentMonth &&
               tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance: totalIncome - totalExpenses,
      cashBalance,
      transferBalance,
      monthlyIncome,
      monthlyExpenses
    };
  };

  const totals = calculateTotals();

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const handleAddRecurringExpense = (expense: Omit<RecurringExpense, 'id'>) => {
    setRecurringExpenses([...recurringExpenses, { ...expense, id: Date.now().toString() }]);
  };

  const handleDeleteRecurringExpense = (id: string) => {
    setRecurringExpenses(recurringExpenses.filter(e => e.id !== id));
  };

  const handleAddReminder = (reminder: Omit<Reminder, 'id'>) => {
    setReminders([...reminders, { ...reminder, id: Date.now().toString() }]);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-gray-900">Finanzas</h1>
          <p className="text-gray-500 text-sm">Gestiona tus movimientos</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-6 pb-28">
        {activeTab === 'home' && (
          <Dashboard
            totalBalance={totals.totalBalance}
            cashBalance={totals.cashBalance}
            transferBalance={totals.transferBalance}
            monthlyIncome={totals.monthlyIncome}
            monthlyExpenses={totals.monthlyExpenses}
          />
        )}

        {activeTab === 'history' && (
          <TransactionHistory transactions={transactions} />
        )}

        {activeTab === 'recurring' && (
          <RecurringExpenses
            expenses={recurringExpenses}
            onAdd={handleAddRecurringExpense}
            onDelete={handleDeleteRecurringExpense}
          />
        )}

        {activeTab === 'reminders' && (
          <UpcomingReminders
            reminders={reminders}
            onAdd={handleAddReminder}
            onDelete={handleDeleteReminder}
          />
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowTransactionForm(true)}
        className="fixed bottom-24 right-6 z-30 size-16 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-2xl shadow-blue-500/40 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
      >
        <Plus size={28} />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Home size={22} />
              <span className="text-xs">Inicio</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'history' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <History size={22} />
              <span className="text-xs">Historial</span>
            </button>

            <button
              onClick={() => setActiveTab('recurring')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'recurring' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Settings size={22} />
              <span className="text-xs">Fijos</span>
            </button>

            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'reminders' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Calendar size={22} />
              <span className="text-xs">Cobros</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          onClose={() => setShowTransactionForm(false)}
          onSubmit={handleAddTransaction}
        />
      )}
    </div>
  );
}
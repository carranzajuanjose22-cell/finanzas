import { Calendar, Plus, Trash2, Bell } from 'lucide-react';
import { useState } from 'react';

interface Reminder {
  id: string;
  title: string;
  amount: number;
  date: string;
}

interface UpcomingRemindersProps {
  reminders: Reminder[];
  onAdd: (reminder: Omit<Reminder, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function UpcomingReminders({ reminders, onAdd, onDelete }: UpcomingRemindersProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      amount: parseFloat(amount),
      date
    });
    setTitle('');
    setAmount('');
    setDate('');
    setShowForm(false);
  };

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
  };

  const sortedReminders = [...reminders].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Próximos Cobros</h2>
          <p className="text-gray-500 text-sm">Ingresos programados</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full p-3 bg-green-500 hover:bg-green-600 text-white transition-colors shadow-lg"
        >
          <Plus size={20} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm space-y-4">
          <div>
            <label className="text-gray-700 text-sm mb-2 block">Descripción</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Pago cliente ABC..."
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm mb-2 block">Monto esperado</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              step="0.01"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-gray-700 text-sm mb-2 block">Fecha estimada</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-green-500 hover:bg-green-600 text-white py-3 transition-colors"
          >
            Agregar Recordatorio
          </button>
        </form>
      )}

      <div className="space-y-2">
        {sortedReminders.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8 text-center">
            <Bell size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">No hay cobros programados</p>
          </div>
        ) : (
          sortedReminders.map((reminder) => {
            const daysUntil = getDaysUntil(reminder.date);
            const isToday = daysUntil === 0;
            const isSoon = daysUntil <= 3 && daysUntil > 0;

            return (
              <div
                key={reminder.id}
                className={`rounded-2xl border-2 p-4 shadow-sm transition-all ${
                  isToday
                    ? 'bg-green-50 border-green-300'
                    : isSoon
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`rounded-full p-3 ${
                      isToday
                        ? 'bg-green-100'
                        : isSoon
                        ? 'bg-amber-100'
                        : 'bg-gray-100'
                    }`}>
                      <Calendar
                        size={20}
                        className={
                          isToday
                            ? 'text-green-600'
                            : isSoon
                            ? 'text-amber-600'
                            : 'text-gray-600'
                        }
                      />
                    </div>
                    <div>
                      <p className="text-gray-900">{reminder.title}</p>
                      <p className={`text-sm ${
                        isToday
                          ? 'text-green-600'
                          : isSoon
                          ? 'text-amber-600'
                          : 'text-gray-500'
                      }`}>
                        {isToday
                          ? '¡Hoy!'
                          : daysUntil < 0
                          ? `Hace ${Math.abs(daysUntil)} ${Math.abs(daysUntil) === 1 ? 'día' : 'días'}`
                          : daysUntil === 1
                          ? 'Mañana'
                          : `En ${daysUntil} días - ${formatDate(reminder.date)}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-green-600">+${reminder.amount.toLocaleString('es-AR')}</p>
                    <button
                      onClick={() => onDelete(reminder.id)}
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

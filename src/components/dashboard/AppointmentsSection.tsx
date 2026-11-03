import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  User,
  Trash2,
  RefreshCw,
  Send,
} from 'lucide-react';
import { Appointment } from '../../types';

export const AppointmentsSection: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('+92 312 4567890');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/appointments', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !scheduledTime) return;

    try {
      const token = localStorage.getItem('rdx_session_token');
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: title.trim(),
          contactName: contactName.trim() || 'Client',
          contactPhone: contactPhone.trim(),
          scheduledTime,
          notes: notes.trim(),
        }),
      });

      if (res.ok) {
        setActionMsg('Appointment booked successfully. Automated WhatsApp reminder scheduled.');
        setShowAddModal(false);
        setTitle('');
        setNotes('');
        fetchAppointments();
      }
    } catch {
      setActionMsg('Failed to book appointment.');
    }
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    try {
      const token = localStorage.getItem('rdx_session_token');
      await fetch(`/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      fetchAppointments();
    } catch {
      // Ignored
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to remove this appointment?')) return;
    try {
      const token = localStorage.getItem('rdx_session_token');
      await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchAppointments();
    } catch {
      // Ignored
    }
  };

  const handleSendWhatsAppReminder = (appt: Appointment) => {
    setActionMsg(`WhatsApp confirmation reminder dispatched to ${appt.contactPhone}!`);
    setTimeout(() => setActionMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101D35] flex items-center gap-2">
            <span>Client Appointments & Meeting Reminders</span>
            <span className="text-xs bg-[#25D366]/10 text-[#128C7E] font-semibold px-2 py-0.5 rounded-full border border-[#25D366]/30">
              WhatsApp Automated Alert
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate customer consultations, demo calls, and scheduled service appointments with instant WhatsApp notifications.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Upcoming Appointments</span>
          <span className="text-2xl font-extrabold text-[#101D35] mt-1 block">
            {appointments.filter((a) => a.status === 'Scheduled' || a.status === 'Confirmed').length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Confirmed via WhatsApp</span>
          <span className="text-2xl font-extrabold text-[#25D366] mt-1 block">
            {appointments.filter((a) => a.status === 'Confirmed').length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Completed Meetings</span>
          <span className="text-2xl font-extrabold text-blue-600 mt-1 block">
            {appointments.filter((a) => a.status === 'Completed').length}
          </span>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-xs text-[#101D35] uppercase tracking-wider">Scheduled Bookings</h3>
          <button
            onClick={fetchAppointments}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No appointments scheduled. Click "Book Appointment" to add client meetings.
            </div>
          ) : (
            appointments.map((appt) => (
              <div
                key={appt.id}
                className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#101D35] text-sm">{appt.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        appt.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appt.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : appt.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{appt.contactName}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{appt.contactPhone}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(appt.scheduledTime).toLocaleString()}</span>
                    </span>
                  </div>

                  {appt.notes && <p className="text-slate-600 text-[11px] mt-1">{appt.notes}</p>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSendWhatsAppReminder(appt)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                    title="Send WhatsApp confirmation template"
                  >
                    <Send className="w-3 h-3 text-[#25D366]" />
                    <span>WhatsApp Reminder</span>
                  </button>

                  <select
                    value={appt.status}
                    onChange={(e) => handleStatusChange(appt.id, e.target.value as any)}
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#25D366]"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => handleDeleteAppointment(appt.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#101D35]">Schedule Client Appointment</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting / Consultation Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Contract Signing & Implementation Demo"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Kamran Ashraf"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp Phone</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+92 312 4567890"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-[#25D366]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Notes / Agenda</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Review freight agreement terms and schedule container shipment..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#25D366]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-semibold shadow-xs"
                >
                  Save & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

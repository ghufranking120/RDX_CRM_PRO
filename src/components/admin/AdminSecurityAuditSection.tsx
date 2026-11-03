import React, { useState } from 'react';
import { ShieldCheck, Lock, Activity, Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AuditLog } from '../../types';
import { storageService } from '../../services/storage';

export const AdminSecurityAuditSection: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(storageService.getAuditLogs());

  const permissionsMatrix = [
    { permission: 'Manage Global CMS & Platform Themes', superAdmin: true, bizAdmin: false, agent: false },
    { permission: 'Manage Multi-Tenant Quotas & Limits', superAdmin: true, bizAdmin: false, agent: false },
    { permission: 'Access Isolated Tenant Customer Data', superAdmin: true, bizAdmin: true, agent: true },
    { permission: 'Assign Deals & Move Pipeline Stages', superAdmin: true, bizAdmin: true, agent: true },
    { permission: 'Invite & Manage Tenant Agent Seats', superAdmin: true, bizAdmin: true, agent: false },
    { permission: 'Configure Meta Webhooks & Tokens', superAdmin: true, bizAdmin: false, agent: false },
  ];

  const handleExportLogs = () => {
    const headers = ['ID,Timestamp,Actor,Role,Action,Target,IPAddress,Status'];
    const rows = logs.map((l) =>
      `"${l.id}","${l.timestamp}","${l.actor}","${l.role}","${l.action}","${l.target}","${l.ipAddress}","${l.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `rdx_security_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">J. Security, Roles & Platform Audit Logs</h2>
          <p className="text-xs text-slate-400">
            Immutable administrative activity logs, session policies, and RBAC permission matrices.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Role Permission Matrix */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-800/80 border-b border-slate-700">
          <h3 className="font-bold text-sm text-white">Role-Based Access Control (RBAC) Matrix</h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/40 text-slate-300 font-bold border-b border-slate-700">
            <tr>
              <th className="py-3 px-4">Permission Scope</th>
              <th className="py-3 px-4 text-center">Super Admin</th>
              <th className="py-3 px-4 text-center">Business Admin</th>
              <th className="py-3 px-4 text-center">Support Agent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {permissionsMatrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30">
                <td className="py-2.5 px-4 font-medium text-white">{row.permission}</td>
                <td className="py-2.5 px-4 text-center">
                  {row.superAdmin ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">—</span>}
                </td>
                <td className="py-2.5 px-4 text-center">
                  {row.bizAdmin ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">—</span>}
                </td>
                <td className="py-2.5 px-4 text-center">
                  {row.agent ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Administrative Activity Audit Trail</h3>
          <span className="text-xs text-slate-400 font-mono">{logs.length} logged events</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/40 text-slate-300 font-bold border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Detail</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-4 font-semibold text-white truncate max-w-[180px]">{log.actor}</td>
                  <td className="py-2.5 px-4 font-mono text-[#55B9F5] text-[11px]">{log.action}</td>
                  <td className="py-2.5 px-4 text-slate-300 truncate max-w-[220px]">{log.target}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                  <td className="py-2.5 px-4 text-right">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

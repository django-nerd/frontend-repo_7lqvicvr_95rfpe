import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';
import { ListOrdered } from 'lucide-react';

export default function AuditLog() {
  const { audit } = useContext(AuthContext);

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <ListOrdered className="h-5 w-5 text-purple-600" />
        <h2 className="font-semibold text-gray-800">Audit trail</h2>
      </div>
      {audit.length === 0 ? (
        <p className="text-sm text-gray-500">No actions yet.</p>
      ) : (
        <ul className="space-y-2">
          {audit.map((e) => (
            <li key={e.id} className="rounded-md border bg-white p-3 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{e.action}</span>
                <span className="text-xs text-gray-500">{new Date(e.at).toLocaleTimeString()}</span>
              </div>
              <div className="text-xs text-gray-500">By {e.actorName} • Target: {e.target}</div>
              {e.note && <div className="mt-1 text-gray-700">{e.note}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

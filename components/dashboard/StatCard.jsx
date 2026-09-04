import { FileText, Globe, Phone, MapPin } from 'lucide-react';

const ICONS = { registrations: FileText, leads: Globe, callback: Phone, districts: MapPin };

export default function StatCard({ icon, tone, value, label }) {
  const Icon = ICONS[icon];
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${tone}`}>
        <Icon size={19} strokeWidth={1.8} />
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

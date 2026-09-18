import { School, Users, GraduationCap, MapPin } from 'lucide-react';

const ICONS = {
  schools: School,
  strength: Users,
  participated: GraduationCap,
  districts: MapPin,
};

export default function StatCard({ icon, variant, value, label }) {
  const Icon = ICONS[icon];
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card-grain" />
      <div className="stat-card-content">
        <span className="stat-card-icon"><Icon size={22} strokeWidth={1.7} /></span>
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">{value}</span>
      </div>
    </div>
  );
}

import type { BookingTrendPoint, ClassroomUtilizationPoint } from "../types";

export function UtilizationChart({ points }: { points: ClassroomUtilizationPoint[] }) {
  const max = Math.max(...points.map((point) => point.total), 1);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Classroom utilization by building</h3>
          <p className="mt-1 text-xs text-slate-500">Occupied and reserved rooms against catalog capacity.</p>
        </div>
        <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
          Live catalog
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {points.map((point) => {
          const occupiedWidth = (point.occupied / max) * 100;
          const reservedWidth = (point.reserved / max) * 100;
          return (
            <div key={`${point.campusId}-${point.label}`}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{point.label}</span>
                <span className="text-slate-500">
                  {point.utilizationPercent}% · {point.occupied + point.reserved}/{point.total}
                </span>
              </div>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="bg-violet-600" style={{ width: `${occupiedWidth}%` }} />
                <div className="bg-amber-400" style={{ width: `${reservedWidth}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex gap-4 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-violet-600" /> Occupied
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-400" /> Reserved
        </span>
      </div>
    </section>
  );
}

export function BookingTrendsChart({ points }: { points: BookingTrendPoint[] }) {
  const max = Math.max(...points.map((point) => point.approved + point.pending + point.rejected), 1);
  const height = 160;
  const width = 560;
  const pad = 16;
  const step = points.length > 1 ? (width - pad * 2) / (points.length - 1) : width;

  const polyline = (key: keyof Pick<BookingTrendPoint, "approved" | "pending" | "rejected">) =>
    points
      .map((point, index) => {
        const x = pad + index * step;
        const y = height - pad - (point[key] / max) * (height - pad * 2);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Booking trends</h3>
        <p className="mt-1 text-xs text-slate-500">Approved, pending and declined requisitions this week.</p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full min-w-[28rem]" role="img" aria-label="Booking trends">
          <polyline fill="none" stroke="#7c3aed" strokeWidth="2.5" points={polyline("approved")} />
          <polyline fill="none" stroke="#d97706" strokeWidth="2.5" points={polyline("pending")} />
          <polyline fill="none" stroke="#e11d48" strokeWidth="2.5" points={polyline("rejected")} />
          {points.map((point, index) => (
            <text
              key={point.date}
              x={pad + index * step}
              y={height - 2}
              textAnchor="middle"
              className="fill-slate-400"
              fontSize="10"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>
      <div className="mt-2 flex gap-4 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-violet-600" /> Approved
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-600" /> Pending
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-rose-600" /> Declined
        </span>
      </div>
    </section>
  );
}

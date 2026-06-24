"use client";

interface GanttCard {
  id: string;
  title: string;
  listTitle: string;
  startDate: string;
  dueDate: string;
}

interface GanttViewProps {
  cards: GanttCard[];
}

/** Colores de barra por índice de lista, usando la paleta */
const BAR_COLORS: Record<number, { bg: string; border: string }> = {
  0: { bg: "bg-glow/50", border: "border-glow/60" },
  1: { bg: "bg-accent/50", border: "border-accent/60" },
  2: { bg: "bg-subtle/50", border: "border-subtle/60" },
  3: { bg: "bg-muted/50", border: "border-muted/60" },
};

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isWeekend(d: Date) {
  return d.getDay() === 0 || d.getDay() === 6;
}

function fmtShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es", { day: "numeric", month: "short" });
}

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DAYS_ES = ["do", "lu", "ma", "mi", "ju", "vi", "sa"];

export function GanttView({ cards }: GanttViewProps) {
  const scheduled = cards.filter((c) => c.startDate && c.dueDate);
  const unscheduled = cards.filter((c) => !c.startDate || !c.dueDate);

  if (scheduled.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted">Sin tareas con fechas</p>
          <p className="mt-1 text-xs text-muted/60">
            Agregá fecha de inicio y límite a tus tarjetas para verlas acá
          </p>
        </div>
      </div>
    );
  }

  // Compute range
  const allStarts = scheduled.map((c) => new Date(c.startDate));
  const allEnds = scheduled.map((c) => new Date(c.dueDate));
  const rangeStart = new Date(Math.min(...allStarts.map((d) => d.getTime())));
  const rangeEnd = new Date(Math.max(...allEnds.map((d) => d.getTime())));
  rangeStart.setDate(rangeStart.getDate() - rangeStart.getDay());
  rangeEnd.setDate(rangeEnd.getDate() + (6 - rangeEnd.getDay()));

  const totalDays = daysBetween(rangeStart, rangeEnd) + 1;
  const days: Date[] = Array.from({ length: totalDays }, (_, i) => addDays(rangeStart, i));
  const today = new Date();
  const listTitles = [...new Set(scheduled.map((c) => c.listTitle))];

  // Group bars by month changes for the month row
  const monthMarkers: { label: string; col: number }[] = [];
  let lastMonth = -1;
  days.forEach((d, i) => {
    if (d.getMonth() !== lastMonth && d.getDate() <= 7) {
      monthMarkers.push({ label: MONTHS_ES[d.getMonth()], col: i });
      lastMonth = d.getMonth();
    }
  });
  // Ensure first month is always marked
  if (monthMarkers.length === 0 || monthMarkers[0].col > 0) {
    monthMarkers.unshift({ label: MONTHS_ES[days[0].getMonth()], col: 0 });
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Legend */}
      {listTitles.length > 1 && (
        <div className="flex items-center gap-4 border-b border-surface/40 px-6 py-2">
          <span className="text-[10px] font-medium text-muted">Columnas:</span>
          {listTitles.map((title, i) => (
            <span key={title} className="flex items-center gap-1.5 text-[10px] text-light">
              <span className={`h-2.5 w-2.5 rounded-sm ${BAR_COLORS[i % 4].bg}`} />
              {title}
            </span>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[700px]">
          {/* Month row */}
          <div className="flex border-b border-surface/30 bg-deep px-4 sticky top-0 z-20">
            <div className="w-36 shrink-0" />
            <div className="flex flex-1">
              {monthMarkers.map((m, i) => {
                const nextCol = monthMarkers[i + 1]?.col ?? totalDays;
                const span = nextCol - m.col;
                return (
                  <div
                    key={i}
                    className="text-[11px] font-semibold text-light py-1.5"
                    style={{ width: `${(span / totalDays) * 100}%` }}
                  >
                    {m.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day headers */}
          <div className="flex border-b border-surface/20 bg-deep px-4 sticky top-[30px] z-10">
            <div className="w-36 shrink-0" />
            <div className="flex flex-1">
              {days.map((day, i) => (
                <div
                  key={i}
                  className={`flex-1 py-1.5 text-center text-[10px] font-medium ${
                    sameDay(day, today)
                      ? "rounded-t-md bg-glow/10 text-glow"
                      : isWeekend(day)
                        ? "text-muted/50"
                        : "text-muted"
                  }`}
                >
                  {DAYS_ES[day.getDay()]}
                  <br />
                  <span className={`text-[9px] ${sameDay(day, today) ? "text-glow" : "text-muted/40"}`}>
                    {day.getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid & bars */}
          <div className="relative px-4">
            {/* Today line */}
            {days.some((d) => sameDay(d, today)) && (
              <div
                className="absolute top-0 bottom-0 w-px bg-glow/30 z-0"
                style={{
                  left: `calc(144px + ${((days.findIndex((d) => sameDay(d, today)) + 0.5) / totalDays) * 100}%)`,
                }}
              />
            )}

            {scheduled.map((card, idx) => {
              const start = new Date(card.startDate);
              const end = new Date(card.dueDate);
              const offsetDays = daysBetween(rangeStart, start);
              const durationDays = Math.max(1, daysBetween(start, end) + 1);
              const colorIdx = listTitles.indexOf(card.listTitle) % 4;
              const colors = BAR_COLORS[colorIdx] ?? BAR_COLORS[0];

              return (
                <div
                  key={card.id}
                  className="flex items-center border-b border-surface/10"
                  style={{ height: 36 }}
                >
                  {/* Label */}
                  <div className="w-36 shrink-0 pr-3">
                    <p className="truncate text-[11px] font-medium text-light leading-tight">
                      {card.title}
                    </p>
                  </div>

                  {/* Bar area */}
                  <div className="relative flex-1 h-full flex items-center">
                    {/* Weekend columns */}
                    {days.map((day, di) =>
                      isWeekend(day) ? (
                        <div
                          key={di}
                          className="absolute top-0 bottom-0 bg-surface/5"
                          style={{
                            left: `${(di / totalDays) * 100}%`,
                            width: `${(1 / totalDays) * 100}%`,
                          }}
                        />
                      ) : null,
                    )}

                    {/* Bar */}
                    <div
                      className={`absolute top-1.5 h-6 rounded border ${colors.bg} ${colors.border} flex items-center px-2 overflow-hidden transition-all hover:brightness-125`}
                      style={{
                        left: `${(offsetDays / totalDays) * 100}%`,
                        width: `calc(${(durationDays / totalDays) * 100}% - 2px)`,
                        minWidth: durationDays === 0 ? 6 : undefined,
                      }}
                    >
                      <span className="truncate text-[10px] font-medium text-light/90 leading-none">
                        {fmtShort(card.startDate)} → {fmtShort(card.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unscheduled */}
      {unscheduled.length > 0 && (
        <div className="border-t border-surface/40 bg-surface/5 px-6 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-muted/50" />
            <p className="text-[11px] font-medium text-muted">
              Sin programar ({unscheduled.length})
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {unscheduled.map((card) => (
              <span
                key={card.id}
                className="rounded-md border border-surface/30 bg-surface/10 px-2.5 py-1 text-[11px] text-muted"
              >
                {card.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

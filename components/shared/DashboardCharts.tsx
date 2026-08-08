"use client";

type Slice = { label: string; value: number; color: string };

export function SimpleBarChart({
  title,
  data,
}: {
  title: string;
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      <div className="flex h-48 items-end gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{item.value}</span>
            <div
              className="w-full rounded-t-lg bg-primary/80 transition-all"
              style={{ height: `${(item.value / max) * 100}%`, minHeight: item.value ? 8 : 2 }}
            />
            <span className="text-[11px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SimplePieChart({ title, data }: { title: string; data: Slice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulative = 0;
  const gradient = data
    .map((slice) => {
      const start = (cumulative / total) * 100;
      cumulative += slice.value;
      const end = (cumulative / total) * 100;
      return `${slice.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      <div className="flex items-center gap-6">
        <div
          className="size-36 shrink-0 rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
          aria-hidden
        />
        <ul className="space-y-2 text-sm">
          {data.map((slice) => (
            <li key={slice.label} className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: slice.color }} />
              <span className="text-muted-foreground">{slice.label}</span>
              <span className="ml-auto font-medium">{slice.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

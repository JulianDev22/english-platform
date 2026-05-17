import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useEffect, useState } from 'react';
import type { Module, Unit } from '@/types';

interface SidebarNode {
  module: Module;
  units: Unit[];
}

export function Sidebar() {
  const { sidebarOpen, modules } = useAppStore();
  const location = useLocation();
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));
  const [sidebarData, setSidebarData] = useState<SidebarNode[]>([]);

  useEffect(() => {
    fetch('/api/modules')
      .then((r) => r.json())
      .then(async (mods: Module[]) => {
        const data: SidebarNode[] = [];
        for (const mod of mods) {
          const res = await fetch(`/api/modules/${mod.id}`);
          const modData = await res.json();
          data.push({ module: mod, units: modData.units || [] });
        }
        setSidebarData(data);
      })
      .catch(() => {});
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-border bg-surface-1">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <span className="text-lg font-bold text-accent">English B1</span>
      </div>
      <nav className="h-[calc(100vh-3.5rem)] overflow-y-auto p-3">
        {sidebarData.map(({ module: mod, units }) => (
          <div key={mod.id} className="mb-1">
            <button
              onClick={() => toggleExpand(mod.id)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-3 cursor-pointer"
            >
              <span className={`transition-transform duration-200 ${expanded.has(mod.id) ? 'rotate-90' : ''}`}>▶</span>
              <span className="text-xs text-text-secondary font-mono">M{mod.number}</span>
              <span className="truncate">{mod.title}</span>
            </button>
            {expanded.has(mod.id) && units.length > 0 && (
              <div className="ml-4 border-l border-border pl-2">
                {units.map((unit) => {
                  const isActive = location.pathname.includes(`/modulo/${mod.number}/unidad/${unit.number}`);
                  return (
                    <Link
                      key={unit.id}
                      to={`/modulo/${mod.number}/unidad/${unit.number}`}
                      className={`block rounded-md px-3 py-1.5 text-xs transition-colors ${
                        isActive
                          ? 'bg-accent/10 text-accent'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-3'
                      }`}
                    >
                      {unit.number} — {unit.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

import { useEffect, useState, type ReactNode } from 'react';
import { Badge } from '../components/ui/badge';
import { getConnectionStatus } from '../lib/bridge';
import type { ConnectionStatus } from '../lib/types';
import { DemoDataNote } from '../components/memory/States';

export function SettingsPage({ demoMode }: { demoMode: boolean }) {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getConnectionStatus()
      .then((result) => { if (!cancelled) setStatus(result); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Status unavailable.'); });
    return () => { cancelled = true; };
  }, [demoMode]);

  const effective = status ?? {
    mode: 'demo' as const,
    bridgeAvailable: false,
    nasConnected: false,
    library: { name: 'Loading…', status: 'unknown' },
    capabilities: [],
    skillStatus: 'checking',
    privacy: '',
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-primary/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(238,234,254,0.82))] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <Badge className="mb-4 border-primary/15 bg-white/80 text-primary-dark">Settings & NAS status</Badge>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Connection, scope, and privacy.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          RecallVault never stores NAS credentials in this interface. Live data appears only when an officially supported host bridge is present.
        </p>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-5 lg:grid-cols-2">
        <Panel title="UGREEN NAS connection">
          <Row label="Data mode" value={effective.mode === 'live' ? 'Live bridge' : 'Demo preview'} />
          <Row label="Host bridge" value={effective.bridgeAvailable ? 'Detected' : 'Not detected'} />
          <Row label="NAS connection" value={effective.nasConnected ? 'Connected' : effective.bridgeAvailable ? 'Status not reported' : 'Demo only'} />
          <Row label="Skill status" value={effective.skillStatus} />
        </Panel>

        <Panel title="Authorized library scope">
          <Row label="Library" value={effective.library.name} />
          {effective.library.type && <Row label="Type" value={effective.library.type} />}
          {effective.library.status && <Row label="Status" value={effective.library.status} />}
          {effective.library.note && <p className="mt-3 rounded-2xl bg-primary-soft/50 px-4 py-3 text-xs leading-5 text-primary-dark">{effective.library.note}</p>}
        </Panel>

        <Panel title="Skill capabilities" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {effective.capabilities.map((capability) => (
              <div key={capability.name} className="rounded-2xl border border-line bg-white/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-ink">{capability.name}</h3>
                  <Badge className={
                    capability.status === 'documented' ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : capability.status === 'approval-required' ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-line bg-slate-50 text-muted'
                  }>{capability.status}</Badge>
                </div>
                <p className="mt-1 text-xs font-semibold text-primary-dark">{capability.agent}</p>
                <p className="mt-2 text-xs leading-5 text-muted">{capability.detail}</p>
              </div>
            ))}
            {effective.capabilities.length === 0 && <p className="text-sm text-muted">Capability list unavailable.</p>}
          </div>
        </Panel>

        <Panel title="Developer: simulated NAS bridge">
          <p className="text-sm leading-7 text-muted">
            A mock <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">window.ugreenRecallVault</code> bridge can exercise the live code path with synthetic host-shaped payloads. It is clearly labelled and never represents a real device.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => { window.localStorage.setItem('recallvault-mock-nas', '1'); window.location.reload(); }}
              className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800 transition hover:bg-amber-100"
            >
              Enable simulated bridge
            </button>
            <button
              type="button"
              onClick={() => { window.localStorage.removeItem('recallvault-mock-nas'); window.location.reload(); }}
              className="rounded-2xl border border-line bg-white px-4 py-2.5 text-sm font-bold text-muted transition hover:text-ink"
            >
              Disable
            </button>
          </div>
          {effective.skillStatus.includes('mock') && (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">Simulated bridge is currently active.</p>
          )}
        </Panel>

        <Panel title="Privacy & permissions">
          <p className="text-sm leading-7 text-muted">{effective.privacy}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Read-only operations are the default.</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />Album creation requires explicit confirmation and platform approval.</li>
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />No credentials, tokens, or NAS passwords are stored in this UI.</li>
          </ul>
        </Panel>

        <Panel title="About RecallVault">
          <Row label="Product" value="RecallVault AI — Your memories, rediscovered." />
          <Row label="Powered by" value="UGREEN AI NAS Skill (Uliya)" />
          <Row label="Companion UI" value="React + Vite + TypeScript" />
          <Row label="Data boundary" value={demoMode ? 'Demo data only' : 'Host bridge'} />
          <Row label="Last checked" value={status ? 'On page load' : 'Pending'} />
        </Panel>
      </section>

      {demoMode && <DemoDataNote />}
    </div>
  );
}

function Panel({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[28px] border border-line bg-white p-6 shadow-[var(--shadow-soft)] ${className}`}>
      <h2 className="mb-4 font-heading text-xl font-extrabold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line/70 py-3 last:border-0">
      <span className="text-sm font-semibold text-muted">{label}</span>
      <span className="text-right text-sm font-bold text-ink">{value}</span>
    </div>
  );
}

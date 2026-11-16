import { Images, Compass, Settings2, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { ConnectionStatus } from '../../lib/types';

const navItems = [
  { to: '/explore', label: 'Discover', icon: Compass },
  { to: '/timeline', label: 'Timeline', icon: Images },
  { to: '/collections', label: 'Collections', icon: Sparkles },
  { to: '/about', label: 'About', icon: Settings2 },
];

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <NavLink to="/" className="flex items-center gap-3" aria-label="RecallVault home">
      <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-[0_14px_28px_rgba(87,70,216,0.28)]">
        <Sparkles className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-accent" />
      </div>
      {!compact && (
        <div>
          <div className="font-heading text-lg font-extrabold leading-none tracking-tight">RecallVault</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">AI Memory Intelligence</div>
        </div>
      )}
    </NavLink>
  );
}

function Nav() {
  return (
    <nav className="flex items-center gap-1" aria-label="Primary">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => cn(
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            isActive ? 'bg-primary-soft text-primary-dark' : 'text-muted hover:bg-white/80 hover:text-ink',
          )}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function StatusPill({ connection, demoMode }: { connection: ConnectionStatus; demoMode: boolean }) {
  const simulated = connection.library.status === 'simulated';
  const live = connection.bridgeAvailable && connection.nasConnected && !demoMode && !simulated;
  return (
    <NavLink
      to="/settings"
      className={cn('hidden items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition sm:inline-flex', live ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : simulated ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-primary/20 bg-primary-soft text-primary-dark')}
      title="NAS connection status"
    >
      <span className={cn('h-2 w-2 rounded-full', live ? 'bg-emerald-500' : simulated ? 'bg-amber-500' : 'bg-secondary')} />
      {live ? 'NAS connected' : simulated ? 'Simulated bridge' : 'Demo mode'}
    </NavLink>
  );
}

function Avatar() {
  return (
    <NavLink to="/settings" className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(87,70,216,0.3)] transition hover:scale-105" aria-label="Profile and settings">
      RV
    </NavLink>
  );
}

export function AppLayout({ connection, demoMode, onToggleDemo, children }: {
  connection: ConnectionStatus;
  demoMode: boolean;
  onToggleDemo: (value: boolean) => void;
  children: ReactNode;
}) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-8">
            <Wordmark />
            <div className="hidden lg:block"><Nav /></div>
          </div>
          <div className="flex items-center gap-2.5">
            <StatusPill connection={connection} demoMode={demoMode} />
            <button
              type="button"
              onClick={() => onToggleDemo(!demoMode)}
              className={cn('hidden rounded-full border px-3 py-2 text-[11px] font-bold transition md:inline-flex', demoMode ? 'border-primary/25 bg-primary-soft text-primary-dark' : 'border-line bg-white text-muted hover:text-ink')}
              aria-pressed={demoMode}
            >
              {demoMode ? 'Demo data' : 'Host bridge'}
            </button>
            <Avatar />
          </div>
        </div>
        <div className="border-t border-line/60 px-5 py-2.5 lg:hidden">
          <Nav />
        </div>
      </header>

      {(demoMode || connection.library.status === 'simulated') && (
        <div className="border-b border-primary/15 bg-primary-soft/70">
          <div className="mx-auto max-w-[1440px] px-5 py-2.5 text-[13px] font-medium text-primary-dark sm:px-8">
            {connection.library.status === 'simulated'
              ? 'Simulated NAS bridge is active — responses are synthetic and shaped like host payloads. Not retrieved from a real UGREEN NAS.'
              : 'Demo mode — all memories shown are synthetic examples, not files from a UGREEN NAS.'}
          </div>
        </div>
      )}

      <main className={cn('mx-auto max-w-[1440px] px-5 sm:px-8', isHome ? 'pt-10 lg:pt-16' : 'py-8 lg:py-12')}>
        {children}
      </main>

      <footer className="mt-16 border-t border-line/80 bg-white/60">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
              Every memory has a story. RecallVault helps you find, understand, and organize the photos, videos, and documents stored on your UGREEN AI NAS — using only documented, authorized capabilities.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Explore</div>
            <ul className="mt-3 space-y-2 text-sm font-semibold">
              <li><NavLink to="/explore" className="text-muted transition hover:text-primary-dark">Discover memories</NavLink></li>
              <li><NavLink to="/timeline" className="text-muted transition hover:text-primary-dark">Timeline</NavLink></li>
              <li><NavLink to="/collections" className="text-muted transition hover:text-primary-dark">Collections</NavLink></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Trust</div>
            <ul className="mt-3 space-y-2 text-sm font-semibold">
              <li><NavLink to="/about" className="text-muted transition hover:text-primary-dark">How it works</NavLink></li>
              <li><NavLink to="/settings" className="text-muted transition hover:text-primary-dark">NAS & privacy</NavLink></li>
            </ul>
            <p className="mt-4 text-xs leading-5 text-muted">Read-only by default. Album creation requires your explicit approval.</p>
          </div>
        </div>
        <div className="border-t border-line/60 py-4 text-center text-xs text-muted">
          RecallVault AI · Built for the UGREEN AI NAS ecosystem · Demo data is clearly labeled and never represents NAS content.
        </div>
      </footer>
    </div>
  );
}

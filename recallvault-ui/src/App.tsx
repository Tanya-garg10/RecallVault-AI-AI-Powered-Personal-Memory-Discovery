import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ToastProvider } from './components/ui/toast';
import { useToast } from './components/ui/toast-context';
import { getConnectionStatus } from './lib/bridge';
import type { ConnectionStatus } from './lib/types';
import { AboutPage } from './pages/AboutPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ExplorePage } from './pages/ExplorePage';
import { HomePage } from './pages/HomePage';
import { MemoryDetailPage } from './pages/MemoryDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { TimelinePage } from './pages/TimelinePage';

function Shell() {
  const { push } = useToast();
  const [demoMode, setDemoMode] = useState(true);
  const [connection, setConnection] = useState<ConnectionStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    getConnectionStatus()
      .then((status) => { if (!cancelled) { setConnection(status); setDemoMode(!status.bridgeAvailable); } })
      .catch(() => { if (!cancelled) setConnection(null); });
    return () => { cancelled = true; };
  }, []);

  const notify = useCallback((message: string) => {
    const kind = /fail|error|denied|cannot/i.test(message) ? 'error' : /demo|not verified|no write/i.test(message) ? 'warning' : 'success';
    push(message, kind);
  }, [push]);

  const status: ConnectionStatus = connection ?? {
    mode: 'demo',
    bridgeAvailable: false,
    nasConnected: false,
    library: { name: 'Status unavailable', status: 'unknown' },
    capabilities: [],
    skillStatus: 'bridge-check-pending',
    privacy: 'Read-only by default. Album and file writes require explicit confirmation and platform approval.',
  };

  return (
    <AppLayout connection={status} demoMode={demoMode} onToggleDemo={setDemoMode}>
      <Routes>
        <Route path="/" element={<HomePage demoMode={demoMode} />} />
        <Route path="/explore" element={<ExplorePage demoMode={demoMode} />} />
        <Route path="/timeline" element={<TimelinePage demoMode={demoMode} />} />
        <Route path="/collections" element={<CollectionsPage demoMode={demoMode} onToast={notify} />} />
        <Route path="/collections/:collectionId" element={<CollectionDetailPage demoMode={demoMode} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/memories/:memoryId" element={<MemoryDetailPage demoMode={demoMode} />} />
        <Route path="/settings" element={<SettingsPage demoMode={demoMode} />} />
        <Route path="*" element={<HomePage demoMode={demoMode} />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </BrowserRouter>
  );
}

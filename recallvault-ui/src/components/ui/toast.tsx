import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { ToastContext, type ToastItem, type ToastKind } from './toast-context';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const push = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, kind, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4200);
  }, []);
  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[min(92vw,420px)] flex-col gap-3" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = icons[toast.kind];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className={cn('pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur', {
                  'border-emerald-200': toast.kind === 'success',
                  'border-red-200': toast.kind === 'error',
                  'border-amber-200': toast.kind === 'warning',
                  'border-line': toast.kind === 'info',
                })}
              >
                <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', {
                  'text-emerald-600': toast.kind === 'success',
                  'text-red-600': toast.kind === 'error',
                  'text-amber-600': toast.kind === 'warning',
                  'text-primary': toast.kind === 'info',
                })} />
                <p className="text-sm font-medium leading-6 text-ink">{toast.message}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

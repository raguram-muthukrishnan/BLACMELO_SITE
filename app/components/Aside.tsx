import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { destroyLenis, recreateLenis } from '~/lib/lenis';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const { type: activeType, close } = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      destroyLenis();

      // Save scroll position so we can restore it on close
      const scrollY = window.scrollY;
      (document.body as any).__asideScrollY = scrollY;

      // ── Touch-scroll fix (StackOverflow solution) ──────────────────────────
      // Do NOT set overflow:hidden on html/body — that blocks touch events from
      // reaching the scrollable <aside main> panel on iOS (the scroll-lock bug).
      // Instead, intercept touchmove on the body and cancel it only when the
      // touch is NOT inside a designated scroll container inside the aside.
      const preventBodyScroll = (e: TouchEvent) => {
        const scrollEl = (e.target as Element)?.closest?.(
          '.overlay aside main, .mobile-menu-scroll-area',
        );
        if (!scrollEl) {
          e.preventDefault();
        }
      };

      document.body.addEventListener('touchmove', preventBodyScroll, {
        passive: false,
        signal: abortController.signal,
      } as AddEventListenerOptions);
      // ────────────────────────────────────────────────────────────────────────

      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') close();
        },
        { signal: abortController.signal },
      );

      return () => {
        abortController.abort();

        // Recreate Lenis from scratch (restores smooth scroll)
        recreateLenis();
      };
    } else {
      return () => {
        abortController.abort();
      };
    }
  }, [close, expanded]);

  if (!expanded) return null;

  return (
    <div
      aria-modal
      className="overlay expanded"
      role="dialog"
      data-type={type}
    >
      {/* Clicking outside closes the aside */}
      {type !== 'mobile' && (
        <button className="close-outside" onClick={close} />
      )}

      <aside>
        {/* Header with close button - Show for everything except the main mobile menu panel */}
        {type !== 'mobile' && (
          <header className="aside-header">
            <h3>{heading}</h3>
            <button className="close reset" onClick={close} aria-label="Close">
              ✕
            </button>
          </header>
        )}

        {/* Scrollable content area */}
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

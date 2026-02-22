import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {stopLenis, startLenis} from '~/lib/lenis';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      // Stop Lenis smooth scroll
      stopLenis();
      
      // Save current scroll position
      const scrollY = window.scrollY;
      const body = document.body;
      
      // Store original styles
      const originalOverflow = body.style.overflow;
      const originalPosition = body.style.position;
      const originalTop = body.style.top;
      const originalWidth = body.style.width;
      
      // Lock body scroll using position fixed method
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';

      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );

      return () => {
        abortController.abort();
        
        // Restore body styles
        body.style.position = originalPosition;
        body.style.top = originalTop;
        body.style.width = originalWidth;
        body.style.overflow = originalOverflow;
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
        
        // Restart Lenis smooth scroll
        startLenis();
      };
    } else {
      return () => {
        abortController.abort();
      };
    }
  }, [close, expanded]);

  // Don't render anything if not expanded to avoid layout issues
  if (!expanded) {
    return null;
  }

  return (
    <div
      aria-modal
      className="overlay expanded"
      role="dialog"
      data-type={type}
    >
      <button className="close-outside" onClick={close} />
      <aside>
        {type !== 'mobile' && (
          <header>
            <h3>{heading}</h3>
            <button className="close reset" onClick={close} aria-label="Close">
              ✕
            </button>
          </header>
        )}
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
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

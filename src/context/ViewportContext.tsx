import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

interface ViewportState {
  isMobile: boolean;
  isMobileSmall: boolean;
}

// Crear el contexto
const ViewportContext = createContext<ViewportState | undefined>(undefined);

// Hook personalizado para usar el contexto fácilmente
export const useViewport = (): ViewportState => {
  const context = useContext(ViewportContext);
  if (!context) {
    throw new Error('useViewport debe usarse dentro de un ViewportProvider');
  }
  return context;
};

interface ViewportProviderProps {
  children: ReactNode;
}

// Proveedor del contexto
export const ViewportProvider = ({ children }: ViewportProviderProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 720);
  const [isMobileSmall, setIsMobileSmall] = useState(window.innerWidth <= 500);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 720);
      setIsMobileSmall(window.innerWidth <= 500);
    };

    // Agregar event listener
    window.addEventListener('resize', handleResize);

    // Cleanup: remover event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ViewportContext.Provider value={{ isMobile, isMobileSmall }}>
      {children}
    </ViewportContext.Provider>
  );
};

export default ViewportContext;

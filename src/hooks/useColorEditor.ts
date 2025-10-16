import { useContext } from 'react';
import { ColorEditorContext } from '@/contexts/ColorEditorContext';

/**
 * Hook to access the Color Editor context
 */
export function useColorEditor() {
  const context = useContext(ColorEditorContext);
  
  if (context === undefined) {
    throw new Error('useColorEditor must be used within a ColorEditorProvider');
  }
  
  return context;
}

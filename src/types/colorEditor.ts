export interface CSSVariable {
  name: string;
  value: string;
  displayName: string;
  category?: string;
}

export interface ColorEditorContextType {
  cssVariables: CSSVariable[];
  updateVariable: (name: string, value: string) => void;
  resetVariable: (name: string) => void;
  resetAllVariables: () => void;
  exportVariables: () => string;
  importVariables: (css: string) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

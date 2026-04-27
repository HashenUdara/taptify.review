import { create } from "zustand";
import { validateField } from "@/schemas/review-link";
import { ReviewLinkConfig } from "@/types/google-business";
import { defaultConfig } from "@/components/config";

type PreviewStep =
  | "rating"
  | "feedback"
  | "redirect"
  | "thankyou"
  | "smart-editor";

type ReviewLinkState = {
  // Config state
  config: ReviewLinkConfig;
  setConfig: (updates: Partial<ReviewLinkConfig>) => void;
  setConfigFull: (cfg: ReviewLinkConfig) => void;

  // Validation state
  errors: Record<string, string>;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  validateField: (field: keyof ReviewLinkConfig, value: unknown) => boolean;
  clearAllErrors: () => void;

  // Preview state
  previewRating: number;
  setPreviewRating: (r: number) => void;
  previewStep: PreviewStep;
  setPreviewStep: (s: PreviewStep) => void;
  resetPreview: () => void;

  // Wizard step navigation (replaces useStepNavigation hook)
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // History & Change Tracking
  lastSavedConfig: ReviewLinkConfig;
  undoStack: ReviewLinkConfig[];
  redoStack: ReviewLinkConfig[];
  undo: () => void;
  redo: () => void;
  resetConfig: () => void; // Now goes to First Edit (Point 1)
  resetToSaved: () => void; // Goes to Saved Point (Point 0)
  jumpToFirstEdit: () => void;
  jumpToLatest: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
  canReset: boolean;
  canJumpToFirst: boolean;
  canJumpToLatest: boolean;

  // Actions
  saveDraft: () => ReviewLinkConfig;
  publish: () => ReviewLinkConfig;
};

// Lightweight, optimized zustand store - single source of truth.
// Eliminates prop drilling and useState/useEffect across all children.
export const useReviewLinkStore = create<ReviewLinkState>((set, get) => ({
  // Config state
  config: defaultConfig,
  lastSavedConfig: defaultConfig,
  undoStack: [],
  redoStack: [],
  canUndo: false,
  canRedo: false,
  isDirty: false,
  canReset: false,
  canJumpToFirst: false,
  canJumpToLatest: false,

  setConfig: (updates: Partial<ReviewLinkConfig>) => {
    const currentState = get().config;
    // Optimization: Only push to history if values actually changed
    const hasChanges = Object.entries(updates).some(
      ([key, value]) => currentState[key as keyof ReviewLinkConfig] !== value,
    );

    if (!hasChanges) return;

    set((state) => {
      const nextConfig = { ...state.config, ...updates };
      const isDirty =
        JSON.stringify(nextConfig) !== JSON.stringify(state.lastSavedConfig);
      const nextUndoStack = [...state.undoStack, state.config];
      return {
        config: nextConfig,
        undoStack: nextUndoStack,
        redoStack: [], // Clear redo stack on new change
        canUndo: true,
        canRedo: false,
        isDirty,
        canReset: isDirty,
        canJumpToFirst: nextUndoStack.length > 1,
        canJumpToLatest: false,
      };
    });
  },

  setConfigFull: (cfg: ReviewLinkConfig) => {
    set({
      config: cfg,
      lastSavedConfig: cfg,
      undoStack: [],
      redoStack: [],
      canUndo: false,
      canRedo: false,
      isDirty: false,
      canReset: false,
      canJumpToFirst: false,
      canJumpToLatest: false,
    });
  },

  undo: () => {
    const { undoStack, config, redoStack, lastSavedConfig } = get();
    if (undoStack.length === 0) return;

    const prevConfig = undoStack[undoStack.length - 1];
    const nextUndoStack = undoStack.slice(0, -1);
    const nextRedoStack = [config, ...redoStack];

    const isDirty =
      JSON.stringify(prevConfig) !== JSON.stringify(lastSavedConfig);
    set({
      config: prevConfig,
      undoStack: nextUndoStack,
      redoStack: nextRedoStack,
      canUndo: nextUndoStack.length > 0,
      canRedo: true,
      isDirty,
      canReset: isDirty,
      canJumpToFirst:
        nextUndoStack.length > 1 ||
        (nextUndoStack.length === 0 && nextRedoStack.length > 0),
      canJumpToLatest: true,
    });
  },

  redo: () => {
    const { redoStack, config, undoStack, lastSavedConfig } = get();
    if (redoStack.length === 0) return;

    const nextConfig = redoStack[0];
    const nextRedoStack = redoStack.slice(1);
    const nextUndoStack = [...undoStack, config];

    const isDirty =
      JSON.stringify(nextConfig) !== JSON.stringify(lastSavedConfig);
    set({
      config: nextConfig,
      undoStack: nextUndoStack,
      redoStack: nextRedoStack,
      canUndo: true,
      canRedo: nextRedoStack.length > 0,
      isDirty,
      canReset: isDirty,
      canJumpToFirst:
        nextUndoStack.length > 1 ||
        (nextUndoStack.length === 0 && nextRedoStack.length > 0),
      canJumpToLatest: nextRedoStack.length > 0,
    });
  },

  resetConfig: () => {
    const { undoStack, config, redoStack, lastSavedConfig } = get();

    // Find "First Edit" (Point 1)
    let targetConfig: ReviewLinkConfig | null = null;

    if (undoStack.length > 1) targetConfig = undoStack[1];
    else if (undoStack.length === 1) targetConfig = config;
    else if (redoStack.length > 0) targetConfig = redoStack[0];

    // If no first edit found or already there, fallback to saved point
    if (
      !targetConfig ||
      JSON.stringify(config) === JSON.stringify(targetConfig)
    ) {
      get().resetToSaved();
      return;
    }

    const isDirty =
      JSON.stringify(targetConfig) !== JSON.stringify(lastSavedConfig);
    const nextUndoStack = [...undoStack, config];
    set({
      config: targetConfig,
      undoStack: nextUndoStack,
      redoStack: [],
      canUndo: true,
      canRedo: false,
      isDirty,
      canReset: isDirty,
      canJumpToFirst: nextUndoStack.length > 1,
      canJumpToLatest: false,
    });
  },

  resetToSaved: () => {
    const { lastSavedConfig, config, undoStack } = get();
    if (JSON.stringify(config) === JSON.stringify(lastSavedConfig)) return;

    set({
      config: lastSavedConfig,
      undoStack: [...undoStack, config],
      redoStack: [],
      canUndo: true,
      canRedo: false,
      isDirty: false,
      canReset: false,
      canJumpToFirst: undoStack.length + 1 > 1,
      canJumpToLatest: false,
    });
  },

  jumpToFirstEdit: () => {
    const { undoStack, config, redoStack, lastSavedConfig } = get();
    let targetConfig: ReviewLinkConfig | null = null;
    let newUndoStack: ReviewLinkConfig[] = [];
    let newRedoStack: ReviewLinkConfig[] = [];

    if (undoStack.length > 1) {
      targetConfig = undoStack[1];
      newUndoStack = [undoStack[0]];
      newRedoStack = [...undoStack.slice(2), config, ...redoStack];
    } else if (undoStack.length === 0 && redoStack.length > 0) {
      targetConfig = redoStack[0];
      newUndoStack = [config];
      newRedoStack = redoStack.slice(1);
    } else return;

    const isDirty =
      JSON.stringify(targetConfig) !== JSON.stringify(lastSavedConfig);
    set({
      config: targetConfig,
      undoStack: newUndoStack,
      redoStack: newRedoStack,
      canUndo: newUndoStack.length > 0,
      canRedo: newRedoStack.length > 0,
      isDirty,
      canReset: isDirty,
      canJumpToFirst: false, // We ARE at Point 1
      canJumpToLatest: newRedoStack.length > 0,
    });
  },

  jumpToLatest: () => {
    const { redoStack, undoStack, config, lastSavedConfig } = get();
    if (redoStack.length === 0) return;

    const latestConfig = redoStack[redoStack.length - 1];
    const newUndoStack = [...undoStack, config, ...redoStack.slice(0, -1)];

    const isDirty =
      JSON.stringify(latestConfig) !== JSON.stringify(lastSavedConfig);
    set({
      config: latestConfig,
      undoStack: newUndoStack,
      redoStack: [],
      canUndo: true,
      canRedo: false,
      isDirty,
      canReset: isDirty,
      canJumpToFirst: newUndoStack.length > 1,
      canJumpToLatest: false,
    });
  },

  // Validation state
  errors: {},
  setError: (field: string, message: string) =>
    set((state) => ({
      errors: { ...state.errors, [field]: message },
    })),
  clearError: (field: string) =>
    set((state) => {
      const newErrors = { ...state.errors };
      delete newErrors[field];
      return { errors: newErrors };
    }),
  validateField: (field: keyof ReviewLinkConfig, value: unknown) => {
    const error = validateField(field, value);
    if (error) {
      get().setError(field, error);
      return false;
    } else {
      get().clearError(field);
      return true;
    }
  },
  clearAllErrors: () => set({ errors: {} }),

  // Preview state
  previewRating: 0,
  setPreviewRating: (r: number) => set({ previewRating: r }),

  previewStep: "rating",
  setPreviewStep: (s: PreviewStep) => set({ previewStep: s }),

  resetPreview: () => set({ previewRating: 0, previewStep: "rating" }),

  // Wizard step navigation (4 steps total)
  currentStep: 1,
  totalSteps: 4,
  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps) set({ currentStep: currentStep + 1 });
  },
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) set({ currentStep: currentStep - 1 });
  },
  goToStep: (step: number) => {
    const { totalSteps } = get();
    if (step >= 1 && step <= totalSteps) set({ currentStep: step });
  },

  // Actions
  saveDraft: () => {
    const config = get().config;
    const nextConfig = { ...config, status: "draft" as const };
    set({
      config: nextConfig,
      lastSavedConfig: nextConfig,
      undoStack: [],
      redoStack: [],
      canUndo: false,
      canRedo: false,
      isDirty: false,
      canReset: false,
      canJumpToFirst: false,
      canJumpToLatest: false,
    });
    return nextConfig;
  },

  publish: () => {
    const config = get().config;
    const nextConfig = { ...config, status: "published" as const };
    set({
      config: nextConfig,
      lastSavedConfig: nextConfig,
      undoStack: [],
      redoStack: [],
      canUndo: false,
      canRedo: false,
      isDirty: false,
      canReset: false,
      canJumpToFirst: false,
      canJumpToLatest: false,
    });
    return nextConfig;
  },
}));

export default useReviewLinkStore;

import { create } from "zustand";

export interface BlockConfig {
  id: string;
  type: string;
  properties: Record<string, any>;
  styles: Record<string, any>; // can have device overrides: { padding: { desktop: "48px", tablet: "32px", mobile: "16px" } }
  animation: Record<string, any>;
}

export interface PageConfig {
  id: string;
  title: string;
  heading?: string;
  subheading?: string;
  quote?: string;
  buttonText?: string;
  footerText?: string;
  blocks: BlockConfig[];
}

export interface ThemeConfig {
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  foregroundColor: string;
  radius: string;
  shadows: string;
  cursor: "heart" | "star" | "sparkle" | "flower" | "none";
  loader: "gift" | "cake" | "heart" | "star";
  fontHeading: string;
  fontBody: string;
  fontHandwriting: string;
  backgroundAnimation: "balloons" | "confetti" | "hearts" | "stars" | "petals" | "none";
  stickers: string[];
  icons: string;
  balloonsEnabled: boolean;
  confettiEnabled: boolean;
  fireworksEnabled: boolean;
  buttonStyle: "rounded" | "pills" | "square" | "glass";
  cardStyle: "flat" | "shadow" | "glass" | "bordered";
  pageTransition: "fade" | "slide" | "scale" | "flip";
}

export interface MascotConfig {
  type: string;
  customUrl?: string;
  defaultPose: string;
  animationStyle: "floating" | "bounce" | "wiggle" | "none";
  size: number;
  positionX: number;
  positionY: number;
  enableFloating: boolean;
  enableInteractions: boolean;
  enableBirthdayOutfit: boolean;
}

export interface EditorState {
  projectId: string;
  slug: string;
  recipientName: string;
  countdownDate: string;
  bgMusicUrl: string;
  passwords: {
    friend?: string;
    relationship?: string;
    family?: string;
  };
  occasion: "birthday" | "best_friend" | "anniversary" | "graduation" | "proposal";
  theme: ThemeConfig;
  mascot: MascotConfig;
  pages: PageConfig[];
  status: "draft" | "preview" | "private" | "published" | "archived";
  selectedPageId: string;
  selectedBlockId: string | null;
  previewDevice: "mobile-se" | "mobile-15" | "android" | "fold" | "tablet-p" | "tablet-l" | "laptop" | "desktop" | "ultrawide";
  canvasZoom: number; // e.g. 1 (100%), 0.75 (75%)
  activeSidebarTab: "pages" | "add" | "theme" | "mascot" | "captions" | "assets" | "ai";
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  undoStack: string[];
  redoStack: string[];
  
  // Actions
  initStore: (initialData: Partial<EditorState>) => void;
  updateProject: (data: Partial<Omit<EditorState, "theme" | "mascot" | "pages">>) => void;
  updateTheme: (data: Partial<ThemeConfig>) => void;
  updateMascot: (data: Partial<MascotConfig>) => void;
  setPreviewDevice: (device: EditorState["previewDevice"]) => void;
  setCanvasZoom: (zoom: number) => void;
  setSelectedPageId: (id: string) => void;
  setSelectedBlockId: (id: string | null) => void;
  setActiveSidebarTab: (tab: EditorState["activeSidebarTab"]) => void;
  
  // Pages & Blocks manipulation
  addPage: (title: string) => void;
  deletePage: (id: string) => void;
  reorderPages: (pages: PageConfig[]) => void;
  addBlock: (pageId: string, blockType: string) => void;
  updateBlock: (blockId: string, data: Partial<BlockConfig>) => void;
  deleteBlock: (blockId: string) => void;
  reorderBlocks: (pageId: string, blocks: BlockConfig[]) => void;
  duplicateBlock: (pageId: string, blockId: string) => void;
  toggleHideBlock: (pageId: string, blockId: string) => void;
  toggleLockBlock: (pageId: string, blockId: string) => void;
  
  // Undo/Redo & Save States
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  setSaving: (saving: boolean) => void;
  setUnsaved: (unsaved: boolean) => void;
}

const DEFAULT_THEME: ThemeConfig = {
  themeName: "Birthday Theme",
  primaryColor: "#FFD1DC",
  secondaryColor: "#E8DEF8",
  backgroundColor: "#FFF8F8",
  foregroundColor: "#4A3B32",
  radius: "24px",
  shadows: "md",
  cursor: "sparkle",
  loader: "cake",
  fontHeading: "Poppins",
  fontBody: "Nunito",
  fontHandwriting: "Caveat",
  backgroundAnimation: "balloons",
  stickers: ["🎈", "🎂", "🎉", "🎁"],
  icons: "outline",
  balloonsEnabled: true,
  confettiEnabled: true,
  fireworksEnabled: true,
  buttonStyle: "rounded",
  cardStyle: "shadow",
  pageTransition: "fade",
};

const DEFAULT_MASCOT: MascotConfig = {
  type: "giraffe",
  defaultPose: "idle",
  animationStyle: "floating",
  size: 160,
  positionX: 50,
  positionY: 80,
  enableFloating: true,
  enableInteractions: true,
  enableBirthdayOutfit: true,
};

export const useEditorStore = create<EditorState>((set, get) => {
  const serializeSnapshot = (state: EditorState) => {
    return JSON.stringify({
      recipientName: state.recipientName,
      countdownDate: state.countdownDate,
      bgMusicUrl: state.bgMusicUrl,
      passwords: state.passwords,
      occasion: state.occasion,
      theme: state.theme,
      mascot: state.mascot,
      pages: state.pages,
      status: state.status,
    });
  };

  const applySnapshot = (snapshotStr: string) => {
    try {
      const data = JSON.parse(snapshotStr);
      set({
        recipientName: data.recipientName,
        countdownDate: data.countdownDate,
        bgMusicUrl: data.bgMusicUrl,
        passwords: data.passwords,
        occasion: data.occasion,
        theme: data.theme,
        mascot: data.mascot,
        pages: data.pages,
        status: data.status,
        hasUnsavedChanges: true,
      });
    } catch (e) {
      console.error("Failed to restore history snapshot", e);
    }
  };

  return {
    projectId: "",
    slug: "",
    recipientName: "Gourav",
    countdownDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    bgMusicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    passwords: { relationship: "love123", friend: "friend123", family: "family123" },
    occasion: "birthday",
    theme: DEFAULT_THEME,
    mascot: DEFAULT_MASCOT,
    pages: [],
    status: "draft",
    activeSidebarTab: "pages",
    selectedPageId: "",
    selectedBlockId: null,
    previewDevice: "mobile-15",
    canvasZoom: 1,
    isSaving: false,
    hasUnsavedChanges: false,
    undoStack: [],
    redoStack: [],

    initStore: (initialData) => {
      const pages = (initialData as any).pages || [];
      const firstPageId = pages.length > 0 ? pages[0].id : "";
      set({
        ...initialData,
        activeSidebarTab: "pages",
        hasUnsavedChanges: false,
        undoStack: [],
        redoStack: [],
        selectedPageId: (initialData as any).selectedPageId || firstPageId,
      } as any);
    },

    pushHistory: () => {
      const state = get();
      const snapshot = serializeSnapshot(state);
      set((prev) => ({
        undoStack: [...prev.undoStack, snapshot],
        redoStack: [], // clear redo on new action
      }));
    },

    undo: () => {
      const { undoStack, redoStack } = get();
      if (undoStack.length === 0) return;
      
      const currentSnapshot = serializeSnapshot(get());
      const previousSnapshot = undoStack[undoStack.length - 1];
      const newUndoStack = undoStack.slice(0, -1);
      
      applySnapshot(previousSnapshot);
      set({
        undoStack: newUndoStack,
        redoStack: [...redoStack, currentSnapshot],
      });
    },

    redo: () => {
      const { undoStack, redoStack } = get();
      if (redoStack.length === 0) return;
      
      const currentSnapshot = serializeSnapshot(get());
      const nextSnapshot = redoStack[redoStack.length - 1];
      const newRedoStack = redoStack.slice(0, -1);
      
      applySnapshot(nextSnapshot);
      set({
        undoStack: [...undoStack, currentSnapshot],
        redoStack: newRedoStack,
      });
    },

    updateProject: (data) => {
      get().pushHistory();
      set({ ...data, hasUnsavedChanges: true });
    },

    updateTheme: (data) => {
      get().pushHistory();
      set((prev) => ({
        theme: { ...prev.theme, ...data },
        hasUnsavedChanges: true,
      }));
    },

    updateMascot: (data) => {
      get().pushHistory();
      set((prev) => ({
        mascot: { ...prev.mascot, ...data },
        hasUnsavedChanges: true,
      }));
    },

    setPreviewDevice: (previewDevice) => set({ previewDevice }),
    setCanvasZoom: (canvasZoom) => set({ canvasZoom }),
    setSelectedPageId: (selectedPageId) => set({ selectedPageId }),
    setSelectedBlockId: (selectedBlockId) => set({ selectedBlockId }),
    setActiveSidebarTab: (activeSidebarTab) => set({ activeSidebarTab }),

    addPage: (title) => {
      get().pushHistory();
      const newPage: PageConfig = {
        id: `page-${Date.now()}`,
        title,
        heading: `Welcome to ${title}`,
        subheading: "Customize this heading in the Caption Manager",
        quote: "Write a special message or quote here",
        buttonText: "Proceed",
        footerText: "Made with ❤️",
        blocks: [],
      };
      set((prev) => ({
        pages: [...prev.pages, newPage],
        selectedPageId: prev.selectedPageId || newPage.id,
        hasUnsavedChanges: true,
      }));
    },

    deletePage: (id) => {
      get().pushHistory();
      set((prev) => {
        const filteredPages = prev.pages.filter((p) => p.id !== id);
        let nextSelectedPage = prev.selectedPageId;
        if (prev.selectedPageId === id) {
          nextSelectedPage = filteredPages.length > 0 ? filteredPages[0].id : "";
        }
        return {
          pages: filteredPages,
          selectedPageId: nextSelectedPage,
          hasUnsavedChanges: true,
        };
      });
    },

    reorderPages: (pages) => {
      get().pushHistory();
      set({ pages, hasUnsavedChanges: true });
    },

    addBlock: (pageId, blockType) => {
      get().pushHistory();
      const newBlock: BlockConfig = {
        id: `blk-${Date.now()}`,
        type: blockType,
        properties: {},
        styles: { padding: "16px" },
        animation: { type: "slide-up", duration: 0.6, delay: 0.1 },
      };
      
      // Seed default props for specific block types
      if (blockType === "heading") {
        newBlock.properties = { title: "Custom Heading", subtitle: "Happy Birthday!" };
      } else if (blockType === "text") {
        newBlock.properties = { text: "Write something special here..." };
      } else if (blockType === "countdown") {
        newBlock.properties = { targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString() };
      } else if (blockType === "mascot") {
        newBlock.properties = { state: "idle", size: 150, caption: "Tap me!" };
      } else if (blockType === "quote") {
        newBlock.properties = { quote: "This is a beautiful quote.", author: "Author" };
      }
      
      set((prev) => ({
        pages: prev.pages.map((p) => {
          if (p.id === pageId) {
            return { ...p, blocks: [...p.blocks, newBlock] };
          }
          return p;
        }),
        selectedBlockId: newBlock.id,
        hasUnsavedChanges: true,
      }));
    },

    updateBlock: (blockId, data) => {
      get().pushHistory();
      set((prev) => ({
        pages: prev.pages.map((p) => ({
          ...p,
          blocks: p.blocks.map((b) => {
            if (b.id === blockId) {
              return {
                ...b,
                properties: { ...b.properties, ...(data.properties || {}) },
                styles: { ...b.styles, ...(data.styles || {}) },
                animation: { ...b.animation, ...(data.animation || {}) },
                type: data.type || b.type,
              };
            }
            return b;
          }),
        })),
        hasUnsavedChanges: true,
      }));
    },

    deleteBlock: (blockId) => {
      get().pushHistory();
      set((prev) => ({
        pages: prev.pages.map((p) => ({
          ...p,
          blocks: p.blocks.filter((b) => b.id !== blockId),
        })),
        selectedBlockId: prev.selectedBlockId === blockId ? null : prev.selectedBlockId,
        hasUnsavedChanges: true,
      }));
    },

    reorderBlocks: (pageId, blocks) => {
      get().pushHistory();
      set((prev) => ({
        pages: prev.pages.map((p) => {
          if (p.id === pageId) {
            return { ...p, blocks };
          }
          return p;
        }),
        hasUnsavedChanges: true,
      }));
    },

    duplicateBlock: (pageId, blockId) => {
      get().pushHistory();
      set((prev) => ({
        pages: prev.pages.map((p) => {
          if (p.id === pageId) {
            const index = p.blocks.findIndex((b) => b.id === blockId);
            if (index === -1) return p;
            const blockToCopy = p.blocks[index];
            const duplicate: BlockConfig = {
              ...blockToCopy,
              id: `blk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              properties: {
                ...blockToCopy.properties,
                title: blockToCopy.properties.title ? `${blockToCopy.properties.title} (Copy)` : undefined
              },
            };
            const newBlocks = [...p.blocks];
            newBlocks.splice(index + 1, 0, duplicate);
            return { ...p, blocks: newBlocks };
          }
          return p;
        }),
        hasUnsavedChanges: true,
      }));
    },

    toggleHideBlock: (pageId, blockId) => {
      get().pushHistory();
      set((prev) => ({
        pages: prev.pages.map((p) => {
          if (p.id === pageId) {
            return {
              ...p,
              blocks: p.blocks.map((b) => {
                if (b.id === blockId) {
                  return { ...b, properties: { ...b.properties, hidden: !b.properties.hidden } };
                }
                return b;
              }),
            };
          }
          return p;
        }),
        hasUnsavedChanges: true,
      }));
    },

    toggleLockBlock: (pageId, blockId) => {
      get().pushHistory();
      set((prev) => ({
        pages: prev.pages.map((p) => {
          if (p.id === pageId) {
            return {
              ...p,
              blocks: p.blocks.map((b) => {
                if (b.id === blockId) {
                  return { ...b, properties: { ...b.properties, locked: !b.properties.locked } };
                }
                return b;
              }),
            };
          }
          return p;
        }),
        hasUnsavedChanges: true,
      }));
    },

    setSaving: (isSaving) => set({ isSaving }),
    setUnsaved: (hasUnsavedChanges) => set({ hasUnsavedChanges }),
  };
});

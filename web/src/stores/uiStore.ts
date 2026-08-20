import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SessionFilter = 'with-tasks' | 'all' | 'active';
export type ViewMode = 'session' | 'all';
export type BoardView = 'kanban' | 'timeline';
export type KanbanTab = 'pending' | 'in-progress' | 'completed';
export type SessionLimit = number | 'all';

interface UiState {
  // selection (not persisted -- lives in the URL instead)
  selectedSessionId: string | null;
  selectedTaskId: string | null;
  viewMode: ViewMode;
  drawerOpen: boolean;
  // persisted preferences
  boardView: BoardView;
  kanbanTab: KanbanTab;
  sessionFilter: SessionFilter;
  sessionLimit: SessionLimit;
  filterProject: string;
  notificationsEnabled: boolean;
  archivedExpanded: boolean;
  // transient
  searchQuery: string;

  selectSession: (id: string | null) => void;
  selectTask: (id: string | null) => void;
  setViewMode: (m: ViewMode) => void;
  setDrawerOpen: (b: boolean) => void;
  setBoardView: (v: BoardView) => void;
  setKanbanTab: (t: KanbanTab) => void;
  setSessionFilter: (f: SessionFilter) => void;
  setSessionLimit: (l: SessionLimit) => void;
  setFilterProject: (p: string) => void;
  setNotificationsEnabled: (b: boolean) => void;
  setArchivedExpanded: (b: boolean) => void;
  setSearchQuery: (q: string) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      selectedSessionId: null,
      selectedTaskId: null,
      viewMode: 'session',
      drawerOpen: false,
      boardView: 'kanban',
      kanbanTab: 'pending',
      // Task-less sessions outnumber the rest ~4:1, so showing everything by
      // default buries what people opened the app to look at.
      sessionFilter: 'with-tasks',
      sessionLimit: 20,
      filterProject: '',
      notificationsEnabled: false,
      archivedExpanded: false,
      searchQuery: '',

      selectSession: (id) => set({ selectedSessionId: id, viewMode: 'session', drawerOpen: false }),
      selectTask: (id) => set({ selectedTaskId: id }),
      setViewMode: (viewMode) => set({ viewMode }),
      setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
      setBoardView: (boardView) => set({ boardView }),
      setKanbanTab: (kanbanTab) => set({ kanbanTab }),
      setSessionFilter: (sessionFilter) => set({ sessionFilter }),
      setSessionLimit: (sessionLimit) => set({ sessionLimit }),
      setFilterProject: (filterProject) => set({ filterProject }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setArchivedExpanded: (archivedExpanded) => set({ archivedExpanded }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: 'ctv-ui',
      // One declarative list replaces the eight scattered localStorage.setItem
      // calls the vanilla app made. Selection is deliberately excluded: it
      // belongs in the URL so links are shareable.
      partialize: (s) => ({
        boardView: s.boardView,
        kanbanTab: s.kanbanTab,
        sessionFilter: s.sessionFilter,
        sessionLimit: s.sessionLimit,
        filterProject: s.filterProject,
        notificationsEnabled: s.notificationsEnabled,
        archivedExpanded: s.archivedExpanded,
      }),
    },
  ),
);

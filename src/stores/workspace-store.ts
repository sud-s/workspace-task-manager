import { create } from "zustand"

interface WorkspaceStore {
  currentWorkspaceId: string | null
  setCurrentWorkspaceId: (id: string) => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  currentWorkspaceId: null,
  setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),
}))

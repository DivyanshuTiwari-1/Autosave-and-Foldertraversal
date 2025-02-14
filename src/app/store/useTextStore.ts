import { create } from "zustand";
import { diff_match_patch } from "diff-match-patch";

interface SaveTextResponse {
  success: boolean;
  savedText?: string;
  message?: string;
}

interface TextStore {
  text: string;
  lastText: string;
  setText: (newText: string) => void;
  saveText: () => Promise<SaveTextResponse>; // Ensure saveText returns a promise
}

// Create Zustand store for the text box
export const useTextStore = create<TextStore>((set, get) => ({
  text: "",
  lastText: "",
  
  setText: (newText) => set({ text: newText }),
  
  saveText: async () => {
    const { text, lastText } = get();
    const dmp = new diff_match_patch();
    const diffs = dmp.diff_main(lastText, text);
    dmp.diff_cleanupSemantic(diffs);
  
    try {
      const response = await fetch("/api/SaveText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diffs, startTime: Date.now(), endTime: Date.now() }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.patchedText) {
        set({ lastText: text });
        return { success: true, savedText: text }; // Return text when saved
      } else {
        return { success: false, message: data.message || "Failed to save text" }; // Handle response errors
      }
    } catch (error) {
      console.error("Error during save operation:", error);
      return { success: false, message: "Network error" }; // Handle network errors
    }
  }
}));

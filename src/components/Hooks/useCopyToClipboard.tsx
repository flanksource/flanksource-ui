import { toast } from "react-hot-toast";

type CopyFn = (text: string) => Promise<boolean>;

export function useCopyToClipboard(): CopyFn {
  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      toast.error("Clipboard not available");
      return false;
    }
    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
      return true;
    } catch (error) {
      toast.error("Failed to copy to clipboard");
      return false;
    }
  };

  return copy;
}

/**
 * Copy text to clipboard and optionally show a toast notification
 * @param text The text to copy to clipboard
 * @param toast Optional toast function to show success/error messages
 * @returns A promise that resolves to true if successful, false otherwise
 */
export const copyToClipboard = async (
  text: string,
  toast?: (options: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => void,
): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);

    // Show success toast if toast function is provided
    if (toast) {
      toast({
        title: "Copied to clipboard",
        description: "Link copied to your clipboard",
      });
    }

    return true;
  } catch (error) {
    console.error("Failed to copy text: ", error);

    // Show error toast if toast function is provided
    if (toast) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }

    return false;
  }
};

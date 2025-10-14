import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchButtonProps {
  onClick: () => void;
}

export const SearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "h-14 w-14 rounded-full",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "hover:scale-110"
      )}
      style={{ backgroundColor: '#172554' }}
      aria-label="פתח חיפוש"
    >
      <Search className="h-6 w-6 text-white" />
    </Button>
  );
};

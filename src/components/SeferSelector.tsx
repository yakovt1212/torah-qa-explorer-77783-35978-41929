import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SeferSelectorProps {
  selectedSefer: number;
  onSeferSelect: (seferId: number) => void;
}

const SEFARIM = [
  { id: 1, name: "בראשית", color: "from-blue-600 to-blue-800" },
  { id: 2, name: "שמות", color: "from-indigo-600 to-indigo-800" },
  { id: 3, name: "ויקרא", color: "from-purple-600 to-purple-800" },
  { id: 4, name: "במדבר", color: "from-amber-600 to-amber-800" },
  { id: 5, name: "דברים", color: "from-emerald-600 to-emerald-800" }
];

export const SeferSelector = ({ selectedSefer, onSeferSelect }: SeferSelectorProps) => {
  return (
    <div className="grid grid-cols-5 gap-3 p-4 rounded-lg shadow-md" style={{ backgroundColor: '#1e40af' }}>
      {SEFARIM.map((sefer) => (
        <Button
          key={sefer.id}
          variant={selectedSefer === sefer.id ? "default" : "outline"}
          onClick={() => onSeferSelect(sefer.id)}
          className={cn(
            "h-auto py-6 flex flex-col gap-2 transition-all",
            selectedSefer === sefer.id && "shadow-lg scale-105"
          )}
          style={{ backgroundColor: selectedSefer === sefer.id ? '#1e3a8a' : 'transparent' }}
        >
          <BookOpen className="h-6 w-6" />
          <span className="text-lg font-bold">{sefer.name}</span>
        </Button>
      ))}
    </div>
  );
};

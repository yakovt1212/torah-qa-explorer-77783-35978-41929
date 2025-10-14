import { Skeleton } from "@/components/ui/skeleton";

export const PasukSkeleton = () => (
  <div className="space-y-4 animate-in fade-in duration-200">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border rounded-lg p-4 bg-card/50">
        <Skeleton className="h-6 w-32 mb-3 bg-muted/30" />
        <Skeleton className="h-4 w-full mb-2 bg-muted/30" />
        <Skeleton className="h-4 w-4/5 mb-4 bg-muted/30" />
        <Skeleton className="h-16 w-full bg-muted/30" />
      </div>
    ))}
  </div>
);

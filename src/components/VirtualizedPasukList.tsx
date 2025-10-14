import { useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { FlatPasuk } from "@/types/torah";
import { PasukDisplay } from "@/components/PasukDisplay";

interface VirtualizedPasukListProps {
  pesukim: FlatPasuk[];
  seferId: number;
}

export const VirtualizedPasukList = ({ pesukim, seferId }: VirtualizedPasukListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const estimateSize = useCallback((index: number) => {
    const pasuk = pesukim[index];
    const baseHeight = 150;
    const questionsCount = pasuk.content.reduce(
      (sum, c) => sum + c.questions.length, 0
    );
    const questionsHeight = questionsCount * 80;
    return baseHeight + questionsHeight;
  }, [pesukim]);

  const virtualizer = useVirtualizer({
    count: pesukim.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan: 3,
    measureElement: (el) => el?.getBoundingClientRect().height,
  });

  if (pesukim.length === 0) {
    return null;
  }

  return (
    <div
      ref={parentRef}
      className="space-y-4"
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const pasuk = pesukim[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <PasukDisplay pasuk={pasuk} seferId={seferId} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

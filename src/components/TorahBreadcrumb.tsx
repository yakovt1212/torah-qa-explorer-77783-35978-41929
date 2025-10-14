import { ChevronLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sefer } from "@/types/torah";

interface TorahBreadcrumbProps {
  seferData: Sefer | null;
  selectedParsha: number | null;
  selectedPerek: number | null;
  selectedPasuk: number | null;
  onNavigate: (level: 'sefer' | 'parsha' | 'perek', value?: number) => void;
}

export const TorahBreadcrumb = ({
  seferData,
  selectedParsha,
  selectedPerek,
  selectedPasuk,
  onNavigate,
}: TorahBreadcrumbProps) => {
  if (!seferData) return null;

  const parshaData = seferData.parshiot.find(p => p.parsha_id === selectedParsha);

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList className="flex-wrap">
        {/* Sefer */}
        <BreadcrumbItem>
          {selectedParsha === null && selectedPerek === null ? (
            <BreadcrumbPage className="text-base font-semibold text-primary">
              {seferData.sefer_name}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink
              onClick={() => onNavigate('sefer')}
              className="text-base font-semibold cursor-pointer hover:text-primary transition-colors"
            >
              {seferData.sefer_name}
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {/* Parsha */}
        {parshaData && (
          <>
            <BreadcrumbSeparator>
              <ChevronLeft className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {selectedPerek === null ? (
                <BreadcrumbPage className="text-base font-semibold text-primary">
                  {parshaData.parsha_name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  onClick={() => onNavigate('parsha', selectedParsha || undefined)}
                  className="text-base font-semibold cursor-pointer hover:text-primary transition-colors"
                >
                  {parshaData.parsha_name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        )}

        {/* Perek */}
        {selectedPerek !== null && (
          <>
            <BreadcrumbSeparator>
              <ChevronLeft className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {selectedPasuk === null ? (
                <BreadcrumbPage className="text-base font-semibold text-primary">
                  פרק {selectedPerek}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  onClick={() => onNavigate('perek', selectedPerek)}
                  className="text-base font-semibold cursor-pointer hover:text-primary transition-colors"
                >
                  פרק {selectedPerek}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        )}

        {/* Pasuk */}
        {selectedPasuk !== null && (
          <>
            <BreadcrumbSeparator>
              <ChevronLeft className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-base font-semibold text-primary">
                פסוק {selectedPasuk}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

import { Badge } from "@/components/ui/badge";
import type { AvailabilitySource } from "@/types";

export function AvailabilitySourceBadge({ source }: { source: AvailabilitySource }) {
  if (source === "SERVER_CONFIRMED") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-50 text-[10px] font-semibold text-emerald-800"
      >
        Server-confirmed
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-amber-200 bg-amber-50 text-[10px] font-semibold text-amber-800"
    >
      Provisional
    </Badge>
  );
}

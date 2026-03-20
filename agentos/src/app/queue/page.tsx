"use client";

import { useState } from "react";
import { QueueList } from "@/components/queue/queue-list";
import { QueueDetail } from "@/components/queue/queue-detail";
import { OperationsFilter, OperationsFilterValues } from "@/components/operations/operations-filter";

export default function QueuePage() {
  const [filters, setFilters] = useState<OperationsFilterValues>({
    aopId: null,
    dateFrom: "",
    dateTo: "",
  });

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-3rem)] -m-6">
      <div className="border-b px-4 py-3">
        <OperationsFilter value={filters} onChange={setFilters} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0 overflow-auto border-r p-4">
          <QueueList />
        </div>
        <div className="flex-1 overflow-auto p-6">
          <QueueDetail />
        </div>
      </div>
    </div>
  );
}

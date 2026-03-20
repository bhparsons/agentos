"use client";

import { useState } from "react";
import { ConversationTable } from "@/components/analytics/conversation-table";
import { OperationsFilter, OperationsFilterValues } from "@/components/operations/operations-filter";

export default function ConversationsPage() {
  const [filters, setFilters] = useState<OperationsFilterValues>({
    aopId: null,
    dateFrom: "",
    dateTo: "",
  });

  return (
    <div className="space-y-6">
      <OperationsFilter value={filters} onChange={setFilters} />
      <ConversationTable />
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
] as const;

const SORT_OPTIONS = [
  { value: "votes", label: "Most Voted" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
] as const;

interface SearchAndFiltersProps {
  currentFilters: {
    search: string;
    status: string;
    sort: string;
  };
}

export function SearchAndFilters({ currentFilters }: SearchAndFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const [searchValue, setSearchValue] = useState(currentFilters.search);
  const debouncedSearch = useDebounce(searchValue, 300);

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (!value || value === "all" || value === "votes") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const query = params.toString();
      router.push(query ? `?${query}` : "/feature-requests", { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    // Only update URL when debounced search actually differs from current URL param
    const currentSearch = searchParamsRef.current.get("search") ?? "";
    if (debouncedSearch === currentSearch) return;
    updateParams("search", debouncedSearch);
  }, [debouncedSearch, updateParams]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey-400" />
        <Input
          placeholder="Search requests..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-10 rounded-lg border-grey-200/60 bg-grey-100/50 pl-9 text-sm placeholder:text-grey-400 focus-visible:bg-blanq-white"
        />
      </div>

      {/* Filters row */}
      <div className="flex items-center justify-between gap-3">
        {/* Status tabs */}
        <Tabs
          value={currentFilters.status}
          onValueChange={(v) => updateParams("status", v)}
          className="flex-1"
        >
          <TabsList variant="line" className="w-full justify-start gap-0 sm:w-auto">
            {STATUS_OPTIONS.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="px-2.5 text-xs sm:text-sm"
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Sort */}
        <div className="hidden items-center gap-1 sm:flex">
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="xs"
              onClick={() => updateParams("sort", option.value)}
              className={cn(
                "rounded-md text-xs font-normal",
                currentFilters.sort === option.value
                  ? "bg-grey-100 text-blanq-black"
                  : "text-grey-400 hover:text-grey-600",
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

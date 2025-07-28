import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface PaginationProps {
  pageNumber: number;
  totalPages: number;
  setPageNumber: (n: number) => void;
}

export default function Pagination({
  pageNumber,
  totalPages,
  setPageNumber,
}: PaginationProps) {
  const pageItems = generatePageNumbers(pageNumber, totalPages);

  return (
    <div className="flex justify-center items-center gap-2  select-none">
      <Button
        onClick={() => setPageNumber(pageNumber - 1)}
        variant={"ghost"}
        disabled={pageNumber <= 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </Button>

      {pageItems.map((item, idx) =>
        item === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2">
            ...
          </span>
        ) : (
          <Button
            size={"icon"}
            variant={item === pageNumber ? "companyBtn" : "ghost"}
            key={item}
            onClick={() => setPageNumber(item as number)}
            disabled={item === pageNumber}
            className={`px-3 py-1 border rounded `}
          >
            {item}
          </Button>
        )
      )}

      <Button
        onClick={() => setPageNumber(pageNumber + 1)}
        variant={"ghost"}
        disabled={pageNumber >= totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  );
}

function generatePageNumbers(
  current: number,
  total: number,
  delta = 2
): (number | string)[] {
  const range: number[] = [];
  const pages: (number | string)[] = [];
  let l: number | null = null;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l !== null) {
      if (i - l === 2) {
        pages.push(l + 1);
      } else if (i - l > 2) {
        pages.push("...");
      }
    }
    pages.push(i);
    l = i;
  }

  return pages;
}

export function PaginationSkeleton() {
  return (
    <div className="flex justify-center items-center gap-2 ">
      <Skeleton className="h-8 w-14 rounded bg-muted-foreground" />

      {Array.from({ length: 3 }).map((_, idx) => (
        <Skeleton key={idx} className="h-8 w-8 bg-muted-foreground rounded" />
      ))}

      <Skeleton className="h-8 w-14 rounded bg-muted-foreground" />
    </div>
  );
}

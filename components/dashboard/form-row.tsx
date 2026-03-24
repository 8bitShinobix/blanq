"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { FormRowActions } from "./form-row-actions";

interface FormRowProps {
  form: {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    updatedAt: string | Date;
    workspaceId: string;
    workspaceName: string;
  };
}

export function FormRow({ form }: FormRowProps) {
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      router.push(`/forms/${form.slug}`);
    });
  };

  return (
    <TableRow
      className="cursor-pointer"
      onClick={handleClick}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          {isNavigating ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate font-medium">{form.title}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {form.workspaceName}
      </TableCell>
      <TableCell>
        <Badge variant={form.published ? "default" : "secondary"}>
          {form.published ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(form.updatedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <FormRowActions formId={form.id} workspaceId={form.workspaceId} />
      </TableCell>
    </TableRow>
  );
}

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth-guard";
import { getFormBySlug } from "@/db/queries/forms";
import { EditorWrapper } from "@/components/editor/editor-wrapper";
import { FormPage } from "@/components/editor/form-page";
import type { CoverValue } from "@/components/editor/cover-picker";
import type { Block } from "@/components/editor/types";

export const metadata: Metadata = {
  title: "Untitled",
};

export default async function FormEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await requireAuth();

  const form = await getFormBySlug(slug);

  // Form belongs to a different user
  if (form && form.userId !== session.user.id) {
    redirect("/dashboard");
  }

  // Build cover from flat columns
  const cover: CoverValue | null =
    form?.coverType && form?.coverValue
      ? {
          type: form.coverType as CoverValue["type"],
          value: form.coverValue,
          positionY: form.coverPositionY ?? 50,
        }
      : null;

  const initialData = form
    ? {
        formId: form.id,
        workspaceId: form.workspaceId ?? "",
        title: form.title,
        icon: form.icon,
        cover,
        published: form.published,
        blocks: (form.formData?.blocks ?? []) as unknown as Block[],
        customization: form.formData?.customization ?? {},
      }
    : null;

  return (
    <EditorWrapper initialData={initialData}>
      <FormPage />
    </EditorWrapper>
  );
}

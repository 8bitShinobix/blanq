export function resolveContent(
  content: string,
  mentions: Array<{ displayText: string; blockId: string }> | undefined,
  formData: Record<string, unknown>
): string {
  if (!mentions?.length) return content;
  // If any mention is unresolved, hide the entire text
  const allResolved = mentions.every((m) => {
    const v = formData[m.blockId];
    return v != null && v !== "";
  });
  if (!allResolved) return "";
  let resolved = content;
  for (const m of mentions) {
    resolved = resolved.replace(m.displayText, String(formData[m.blockId]));
  }
  return resolved;
}

"use client";

import { useState, useMemo, useCallback } from "react";
import { ArrowRight, ArrowLeft, ChevronLeft, Check, Loader2, ShieldCheck } from "lucide-react";
import { ReCaptchaProvider, useReCaptcha } from "next-recaptcha-v3";
import { Button } from "@/components/ui/button";
import { PreviewBlock } from "./preview-block";
import { validatePage } from "@/lib/form-validation";
import { useCustomizationStore, FONT_MAP } from "@/stores/customization-store";
import type { Block, ConditionalRule } from "@/components/editor/types";
import type { CoverValue } from "@/components/editor/cover-picker";

interface FormPreviewProps {
  formId?: string | null;
  blocks: Block[];
  title: string;
  icon: string | null;
  cover: CoverValue | null;
  onClose: () => void;
}

/** Split blocks into pages using new_page dividers.
 *  Conditional logic blocks are collected separately for evaluation. */
function splitPages(blocks: Block[]): {
  pages: Block[][];
  thankYou: Block | null;
  conditionalBlocks: Block[];
} {
  const pages: Block[][] = [[]];
  let thankYou: Block | null = null;
  const conditionalBlocks: Block[] = [];

  for (const block of blocks) {
    if (block.type === "thank_you_page") {
      thankYou = block;
      continue;
    }
    if (block.type === "new_page") {
      pages.push([]);
      continue;
    }
    if (block.type === "conditional_logic") {
      conditionalBlocks.push(block);
      continue;
    }
    if (block.type === "recaptcha") {
      continue;
    }
    pages[pages.length - 1].push(block);
  }

  return { pages: pages.filter((p) => p.length > 0), thankYou, conditionalBlocks };
}

/** Evaluate a single condition rule against formData. */
function evaluateRule(
  rule: ConditionalRule,
  formData: Record<string, unknown>
): boolean {
  const raw = formData[rule.field];
  const target = rule.value ?? "";

  // Empty checks — handle arrays, nulls, and strings
  if (rule.operator === "is_empty") {
    if (raw == null) return true;
    if (Array.isArray(raw)) return raw.length === 0;
    return String(raw) === "";
  }
  if (rule.operator === "is_not_empty") {
    if (raw == null) return false;
    if (Array.isArray(raw)) return raw.length > 0;
    return String(raw) !== "";
  }

  // Multi-choice array operators
  if (rule.operator === "includes") {
    return Array.isArray(raw) ? raw.includes(target) : false;
  }
  if (rule.operator === "does_not_include") {
    return Array.isArray(raw) ? !raw.includes(target) : true;
  }

  // Numeric operators
  if (
    rule.operator === "greater_than" ||
    rule.operator === "less_than" ||
    rule.operator === "greater_or_equal" ||
    rule.operator === "less_or_equal"
  ) {
    const numValue = Number(raw);
    const numTarget = Number(target);
    if (isNaN(numValue) || isNaN(numTarget)) return false;
    switch (rule.operator) {
      case "greater_than":
        return numValue > numTarget;
      case "less_than":
        return numValue < numTarget;
      case "greater_or_equal":
        return numValue >= numTarget;
      case "less_or_equal":
        return numValue <= numTarget;
    }
  }

  // Date / Time operators (ISO dates and HH:MM sort lexicographically)
  if (rule.operator === "is_before") {
    const value = raw == null ? "" : String(raw);
    return value !== "" && target !== "" && value < target;
  }
  if (rule.operator === "is_after") {
    const value = raw == null ? "" : String(raw);
    return value !== "" && target !== "" && value > target;
  }

  // String operators
  const value = raw == null ? "" : String(raw);

  switch (rule.operator) {
    case "is":
      return value === target;
    case "is_not":
      return value !== target;
    case "contains":
      return value.includes(target);
    case "does_not_contain":
      return !value.includes(target);
    case "starts_with":
      return value.startsWith(target);
    case "does_not_start_with":
      return !value.startsWith(target);
    case "ends_with":
      return value.endsWith(target);
    case "does_not_end_with":
      return !value.endsWith(target);
    default:
      return false;
  }
}

/** Evaluate all conditions on a conditional block.
 *  Connectors: first rule always applies, subsequent use "and"/"or". */
function evaluateConditions(
  conditions: ConditionalRule[],
  formData: Record<string, unknown>
): boolean {
  if (!conditions.length) return false;

  let result = evaluateRule(conditions[0], formData);

  for (let i = 1; i < conditions.length; i++) {
    const ruleResult = evaluateRule(conditions[i], formData);
    if (conditions[i].connector === "or") {
      result = result || ruleResult;
    } else {
      result = result && ruleResult;
    }
  }

  return result;
}

/** Compute the set of block IDs that should be hidden based on conditional logic.
 *  - show_blocks: targets are hidden by default, shown when conditions match
 *  - hide_blocks: targets are shown by default, hidden when conditions match */
function computeHiddenBlocks(
  conditionalBlocks: Block[],
  formData: Record<string, unknown>
): Set<string> {
  const hidden = new Set<string>();
  const shown = new Set<string>();

  // First pass: collect all blocks controlled by show_blocks actions.
  // These are hidden by default (only shown when their condition matches).
  for (const block of conditionalBlocks) {
    for (const action of block.actions ?? []) {
      if (action.type === "show_blocks") {
        for (const id of action.targetBlocks) {
          hidden.add(id);
        }
      }
    }
  }

  // Second pass: evaluate conditions and apply actions.
  for (const block of conditionalBlocks) {
    const conditions = block.conditions ?? [];
    const matched = evaluateConditions(conditions, formData);

    for (const action of block.actions ?? []) {
      if (matched) {
        if (action.type === "show_blocks") {
          for (const id of action.targetBlocks) {
            shown.add(id);
          }
        }
        if (action.type === "hide_blocks") {
          for (const id of action.targetBlocks) {
            hidden.add(id);
          }
        }
      }
    }
  }

  // Remove shown blocks from hidden set
  for (const id of shown) {
    hidden.delete(id);
  }

  return hidden;
}

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function FormPreview(props: FormPreviewProps) {
  if (recaptchaSiteKey) {
    return (
      <ReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
        <FormPreviewInner {...props} />
      </ReCaptchaProvider>
    );
  }
  return <FormPreviewInner {...props} />;
}

function FormPreviewInner({
  formId,
  blocks,
  title,
  icon,
  cover,
  onClose,
}: FormPreviewProps) {
  const custom = useCustomizationStore((s) => s.state);
  const { pages, thankYou, conditionalBlocks } = useMemo(() => splitPages(blocks), [blocks]);
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasRecaptcha = useMemo(
    () => blocks.some((b) => b.type === "recaptcha"),
    [blocks]
  );
  const { executeRecaptcha } = useReCaptcha();

  const hiddenBlocks = useMemo(
    () => computeHiddenBlocks(conditionalBlocks, formData),
    [conditionalBlocks, formData]
  );

  const isLastPage = currentPage >= pages.length - 1;
  const currentBlocks = pages[currentPage] || [];
  const visibleBlocks = useMemo(
    () => currentBlocks.filter((b) => !hiddenBlocks.has(b.id)),
    [currentBlocks, hiddenBlocks]
  );

  const handleFieldChange = useCallback((blockId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [blockId]: value }));
    setErrors((prev) => {
      if (!prev[blockId]) return prev;
      const next = { ...prev };
      delete next[blockId];
      return next;
    });
  }, []);

  const handleNext = useCallback(async () => {
    const pageErrors = validatePage(visibleBlocks, formData);
    if (Object.keys(pageErrors).length > 0) {
      setErrors(pageErrors);
      return;
    }

    if (!isLastPage) {
      setCurrentPage((p) => p + 1);
      return;
    }

    // Submit the form
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        formId,
        data: formData,
      };

      // Add reCAPTCHA token if needed
      if (hasRecaptcha && recaptchaSiteKey) {
        payload.recaptchaToken = await executeRecaptcha("form_submit");
      }

      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrors({ _form: body.error || "Something went wrong. Please try again." });
        setSubmitting(false);
        return;
      }
    } catch {
      setErrors({ _form: "Something went wrong. Please try again." });
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
  }, [isLastPage, visibleBlocks, formData, formId, hasRecaptcha, executeRecaptcha]);

  const handleBack = useCallback(() => {
    setCurrentPage((p) => Math.max(0, p - 1));
  }, []);

  const btnJustify =
    custom.btnAlignment === "center"
      ? "center"
      : custom.btnAlignment === "right"
        ? "flex-end"
        : "flex-start";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundColor: custom.bgColor,
        color: custom.textColor,
        fontFamily: FONT_MAP[custom.font] ?? FONT_MAP["google-sans"],
        fontSize: `${custom.baseFontSize}px`,
      }}
    >
      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center px-4">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to editor
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Cover */}
        {cover && (
          <div style={{ height: `${custom.coverHeight}vh` }}>
            {cover.type === "url" ? (
              <img
                src={cover.value}
                alt="Cover"
                className="h-full w-full object-cover"
                style={{ objectPosition: `center ${cover.positionY ?? 50}%` }}
              />
            ) : (
              <div className={`h-full w-full ${cover.value}`} />
            )}
          </div>
        )}

        <div
          className="mx-auto px-6"
          style={{ maxWidth: `${custom.pageWidth}px` }}
        >
          <div className={cover ? "pt-4" : "pt-24"} />

          {/* Icon */}
          {icon && (
            <div className={cover ? "-mt-8" : ""} style={{
              marginBottom: "1rem",
              fontSize: `${custom.logoWidth}px`,
              lineHeight: 1,
            }}>
              {icon}
            </div>
          )}

          {/* Title */}
          {title && (
            <h1 className="mb-8 text-3xl font-bold">{title}</h1>
          )}

          {submitted ? (
            /* ── Thank you page ── */
            <div className="flex flex-col items-center py-16 text-center">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: custom.accentColor, color: custom.btnText }}
              >
                <Check className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">
                {thankYou?.content || "Thank you!"}
              </h2>
              <p className="mt-2 opacity-60">
                Your response has been recorded.
              </p>
            </div>
          ) : (
            /* ── Form page ── */
            <>
              {/* Back button */}
              {currentPage > 0 && (
                <button
                  onClick={handleBack}
                  className="mb-8 flex items-center gap-2 text-base opacity-60 hover:opacity-100 transition-opacity"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}

              {/* Blocks */}
              <div style={{ display: "flex", flexDirection: "column", gap: `${custom.inputMarginBottom}px` }}>
                {visibleBlocks.map((block) => (
                  <PreviewBlock
                    key={block.id}
                    block={block}
                    value={formData[block.id]}
                    formData={formData}
                    onChange={(v) => handleFieldChange(block.id, v)}
                    error={errors[block.id]}
                    inputStyle={{
                      backgroundColor: custom.inputBg,
                      borderColor: custom.inputBorder,
                      borderWidth: `${custom.inputBorderWidth}px`,
                      borderRadius: `${custom.inputBorderRadius}px`,
                      height: `${custom.inputHeight}px`,
                      padding: `0 ${custom.inputHPadding}px`,
                      color: custom.textColor,
                      width: custom.inputWidth === "full" ? "100%" : `${custom.inputWidth}px`,
                    }}
                    placeholderColor={custom.inputPlaceholder}
                    accentColor={custom.accentColor}
                  />
                ))}
              </div>

              {/* Form-level error */}
              {errors._form && (
                <p className="mt-4 text-sm text-red-400">{errors._form}</p>
              )}

              {/* Next / Submit button */}
              <div
                className="pb-24"
                style={{
                  marginTop: `${custom.btnVMargin}px`,
                  display: "flex",
                  justifyContent: btnJustify,
                }}
              >
                <div>
                  <button
                    onClick={handleNext}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{
                      backgroundColor: custom.btnBg,
                      color: custom.btnText,
                      borderRadius: `${custom.btnCornerRadius}px`,
                      fontSize: `${custom.btnFontSize}px`,
                      height: `${custom.btnHeight}px`,
                      padding: `0 ${custom.btnHPadding}px`,
                      width: custom.btnWidth === "auto" ? undefined : custom.btnWidth === "full" ? "100%" : `${custom.btnWidth}px`,
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        {isLastPage ? "Submit" : "Next"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  {/* reCAPTCHA indicator */}
                  {hasRecaptcha && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 opacity-40" />
                      <span className="text-[11px] opacity-40">
                        Protected by reCAPTCHA
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

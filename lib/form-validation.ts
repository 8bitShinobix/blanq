import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import type { Block, BlockType } from "@/components/editor/types";

/** Returns an error message string if the value is invalid, or null if valid. */
export function validateBlock(block: Block, value: unknown): string | null {
  const schema = VALIDATION_MAP[block.type];
  if (!schema) return null;

  const result = schema.safeParse(value);
  if (result.success) return null;

  return ERROR_MESSAGES[block.type] ?? "This field is required";
}

/** Validates all input blocks on a page. Returns a map of blockId → error message. */
export function validatePage(
  blocks: Block[],
  formData: Record<string, unknown>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const block of blocks) {
    const error = validateBlock(block, formData[block.id]);
    if (error) {
      errors[block.id] = error;
    }
  }

  return errors;
}

// ── Schemas ─────────────────────────────────────────────────────

const requiredString = z.string().min(1);

const VALIDATION_MAP: Partial<Record<BlockType, z.ZodType>> = {
  short_answer: requiredString,
  long_answer: requiredString,
  number: z.string().min(1).refine((v) => !isNaN(Number(v)), "Invalid number"),
  email: z.string().min(1).email(),
  phone: z
    .string()
    .min(1)
    .refine((v) => isValidPhoneNumber(v), "Invalid phone number"),
  link: z.string().min(1).url(),
  date: requiredString,
  time: requiredString,
  multiple_choice: requiredString,
  dropdown: requiredString,
  checkboxes: z.array(z.string()).min(1),
  multi_select: z.array(z.string()).min(1),
  linear_scale: z.number().min(0),
  rating: z.number().min(1),
};

// ── Error messages ──────────────────────────────────────────────

const ERROR_MESSAGES: Partial<Record<BlockType, string>> = {
  short_answer: "This field is required",
  long_answer: "This field is required",
  number: "Please enter a valid number",
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  link: "Please enter a valid URL",
  date: "Please select a date",
  time: "Please select a time",
  multiple_choice: "Please select an option",
  dropdown: "Please select an option",
  checkboxes: "Please select at least one option",
  multi_select: "Please select at least one option",
  linear_scale: "Please select a value",
  rating: "Please select a rating",
};

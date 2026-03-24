export const BLOCK_CATEGORIES = [
  "Input blocks",
  "Layout blocks",
  "Embed blocks",
  "Advanced blocks",
] as const;

export type BlockCategory = (typeof BLOCK_CATEGORIES)[number];

export const BLOCK_TYPES = [
  // Input blocks
  {
    type: "short_answer",
    label: "Short answer",
    icon: "Minus",
    category: "Input blocks",
  },
  {
    type: "long_answer",
    label: "Long answer",
    icon: "AlignLeft",
    category: "Input blocks",
  },
  {
    type: "multiple_choice",
    label: "Multiple choice",
    icon: "CircleCheck",
    category: "Input blocks",
  },
  {
    type: "checkboxes",
    label: "Checkboxes",
    icon: "SquareCheck",
    category: "Input blocks",
  },
  {
    type: "dropdown",
    label: "Dropdown",
    icon: "ChevronDown",
    category: "Input blocks",
  },
  {
    type: "multi_select",
    label: "Multi-select",
    icon: "Check",
    category: "Input blocks",
  },
  { type: "number", label: "Number", icon: "Hash", category: "Input blocks" },
  { type: "email", label: "Email", icon: "AtSign", category: "Input blocks" },
  {
    type: "phone",
    label: "Phone number",
    icon: "Phone",
    category: "Input blocks",
  },
  { type: "link", label: "Link", icon: "Link", category: "Input blocks" },
  {
    type: "file_upload",
    label: "File upload",
    icon: "Upload",
    category: "Input blocks",
  },
  { type: "date", label: "Date", icon: "Calendar", category: "Input blocks" },
  { type: "time", label: "Time", icon: "Clock", category: "Input blocks" },
  {
    type: "linear_scale",
    label: "Linear scale",
    icon: "MoreHorizontal",
    category: "Input blocks",
  },
  {
    type: "matrix",
    label: "Matrix",
    icon: "Grid3X3",
    category: "Input blocks",
  },
  { type: "rating", label: "Rating", icon: "Star", category: "Input blocks" },
  {
    type: "payment",
    label: "Payment",
    icon: "CreditCard",
    category: "Input blocks",
  },
  {
    type: "signature",
    label: "Signature",
    icon: "PenLine",
    category: "Input blocks",
  },
  {
    type: "ranking",
    label: "Ranking",
    icon: "Trophy",
    category: "Input blocks",
  },
  {
    type: "wallet_connect",
    label: "Wallet Connect",
    icon: "Wallet",
    category: "Input blocks",
  },

  // Layout blocks
  {
    type: "new_page",
    label: "New page",
    icon: "FilePlus",
    category: "Layout blocks",
  },
  {
    type: "thank_you_page",
    label: "'Thank you' page",
    icon: "Smile",
    category: "Layout blocks",
  },
  { type: "text", label: "Text", icon: "Type", category: "Layout blocks" },
  {
    type: "heading_1",
    label: "Heading 1",
    icon: "Heading1",
    category: "Layout blocks",
  },
  {
    type: "heading_2",
    label: "Heading 2",
    icon: "Heading2",
    category: "Layout blocks",
  },
  {
    type: "heading_3",
    label: "Heading 3",
    icon: "Heading3",
    category: "Layout blocks",
  },
  {
    type: "divider",
    label: "Divider",
    icon: "SeparatorHorizontal",
    category: "Layout blocks",
  },
  {
    type: "title",
    label: "Title",
    icon: "Bookmark",
    category: "Layout blocks",
  },
  { type: "label", label: "Label", icon: "Tag", category: "Layout blocks" },

  // Embed blocks
  { type: "image", label: "Image", icon: "Image", category: "Embed blocks" },
  { type: "video", label: "Video", icon: "Video", category: "Embed blocks" },
  { type: "audio", label: "Audio", icon: "Volume2", category: "Embed blocks" },
  {
    type: "embed",
    label: "Embed anything",
    icon: "Globe",
    category: "Embed blocks",
  },

  // Advanced blocks
  {
    type: "conditional_logic",
    label: "Conditional logic",
    icon: "GitBranch",
    category: "Advanced blocks",
  },
  {
    type: "recaptcha",
    label: "reCAPTCHA",
    icon: "ShieldCheck",
    category: "Advanced blocks",
  },
  {
    type: "respondents_country",
    label: "Respondent's country",
    icon: "Globe",
    category: "Advanced blocks",
  },
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number]["type"];

// ── Conditional logic types ─────────────────────────────────────

export type ConditionalOperator =
  | "is"
  | "is_not"
  | "contains"
  | "does_not_contain"
  | "starts_with"
  | "does_not_start_with"
  | "ends_with"
  | "does_not_end_with"
  | "is_empty"
  | "is_not_empty"
  // Numeric
  | "greater_than"
  | "less_than"
  | "greater_or_equal"
  | "less_or_equal"
  // Date / Time
  | "is_before"
  | "is_after"
  // Multi-choice
  | "includes"
  | "does_not_include";

export type ConditionalActionType =
  | "jump_to_page"
  | "calculate"
  | "require_answer"
  | "show_blocks"
  | "hide_blocks"
  | "disable_submit";

export type ConditionalConnector = "and" | "or";

export interface ConditionalRule {
  field: string;
  operator: ConditionalOperator;
  value: string;
  connector?: ConditionalConnector;
}

export interface ConditionalAction {
  type: ConditionalActionType;
  targetBlocks: string[];
}

export const CONDITIONAL_OPERATORS: { value: ConditionalOperator; label: string }[] = [
  { value: "is", label: "Is" },
  { value: "is_not", label: "Is not" },
  { value: "contains", label: "Contains" },
  { value: "does_not_contain", label: "Does not contain" },
  { value: "starts_with", label: "Starts with" },
  { value: "does_not_start_with", label: "Does not start with" },
  { value: "ends_with", label: "Ends with" },
  { value: "does_not_end_with", label: "Does not end with" },
  { value: "is_empty", label: "Is empty" },
  { value: "is_not_empty", label: "Is not empty" },
  // Numeric
  { value: "greater_than", label: "Greater than" },
  { value: "less_than", label: "Less than" },
  { value: "greater_or_equal", label: "Greater than or equal to" },
  { value: "less_or_equal", label: "Less than or equal to" },
  // Date / Time
  { value: "is_before", label: "Is before" },
  { value: "is_after", label: "Is after" },
  // Multi-choice
  { value: "includes", label: "Includes" },
  { value: "does_not_include", label: "Does not include" },
];

// ── Field category → operator mapping ───────────────────────────

export type FieldCategory =
  | "text"
  | "number"
  | "single_choice"
  | "multi_choice"
  | "date"
  | "time"
  | "file_only";

export const BLOCK_TYPE_TO_FIELD_CATEGORY: Partial<Record<BlockType, FieldCategory>> = {
  short_answer: "text",
  long_answer: "text",
  email: "text",
  phone: "text",
  link: "text",
  number: "number",
  linear_scale: "number",
  rating: "number",
  multiple_choice: "single_choice",
  dropdown: "single_choice",
  checkboxes: "multi_choice",
  multi_select: "multi_choice",
  date: "date",
  time: "time",
  file_upload: "file_only",
  signature: "file_only",
  ranking: "file_only",
  matrix: "file_only",
  payment: "file_only",
  wallet_connect: "file_only",
};

const OPERATORS_BY_CATEGORY: Record<FieldCategory, ConditionalOperator[]> = {
  text: [
    "is", "is_not", "contains", "does_not_contain",
    "starts_with", "does_not_start_with", "ends_with", "does_not_end_with",
    "is_empty", "is_not_empty",
  ],
  number: [
    "is", "is_not", "greater_than", "less_than",
    "greater_or_equal", "less_or_equal", "is_empty", "is_not_empty",
  ],
  single_choice: ["is", "is_not", "is_empty", "is_not_empty"],
  multi_choice: ["includes", "does_not_include", "is_empty", "is_not_empty"],
  date: ["is", "is_not", "is_before", "is_after", "is_empty", "is_not_empty"],
  time: ["is", "is_not", "is_before", "is_after", "is_empty", "is_not_empty"],
  file_only: ["is_empty", "is_not_empty"],
};

/** Get the valid operators for a given block type. Returns all operators if type is unknown. */
export function getOperatorsForBlockType(blockType: BlockType | undefined): ConditionalOperator[] {
  if (!blockType) return CONDITIONAL_OPERATORS.map((o) => o.value);
  const category = BLOCK_TYPE_TO_FIELD_CATEGORY[blockType];
  if (!category) return CONDITIONAL_OPERATORS.map((o) => o.value);
  return OPERATORS_BY_CATEGORY[category];
}

export const CONDITIONAL_ACTIONS: { value: ConditionalActionType; label: string }[] = [
  { value: "jump_to_page", label: "Jump to page" },
  { value: "calculate", label: "Calculate" },
  { value: "require_answer", label: "Require answer" },
  { value: "show_blocks", label: "Show blocks" },
  { value: "hide_blocks", label: "Hide blocks" },
  { value: "disable_submit", label: "Hide button to disable completion" },
];

// ── Shared block-type sets ───────────────────────────────────────

export const QUESTION_BLOCK_TYPES = new Set<BlockType>([
  "short_answer",
  "long_answer",
  "multiple_choice",
  "checkboxes",
  "dropdown",
  "multi_select",
  "number",
  "email",
  "phone",
  "link",
  "file_upload",
  "date",
  "time",
  "linear_scale",
  "matrix",
  "rating",
  "payment",
  "signature",
  "ranking",
  "wallet_connect",
]);

export const TEXT_INPUT_TYPES = new Set<BlockType>(["short_answer", "long_answer"]);

// Hidden from block picker — uncomment when ready to implement
export const HIDDEN_BLOCK_TYPES = new Set<BlockType>([
  "payment",
  "wallet_connect",
  "recaptcha",
]);

// ── Block interface ─────────────────────────────────────────────

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  placeholder?: string;
  options?: string[];
  conditions?: ConditionalRule[];
  actions?: ConditionalAction[];

  // Common
  required?: boolean;
  hidden?: boolean;
  defaultAnswer?: string;

  // Text inputs (short_answer, long_answer)
  minChars?: number;
  maxChars?: number;

  // Choice types (multiple_choice, checkboxes, dropdown, multi_select)
  otherOption?: boolean;
  randomizeOptions?: boolean;
  minChoices?: number;
  maxChoices?: number;
  badge?: string;
  colorCodeOptions?: boolean;

  // Number
  numberFormat?: string;
  minNumber?: number;
  maxNumber?: number;

  // Phone
  internationalFormat?: boolean;
  defaultCountryCode?: string;

  // Email
  verifyEmail?: boolean;

  // File upload
  multipleFiles?: boolean;
  maxFileSize?: number;
  allowedFiles?: string;

  // Date
  dateFormat?: string;
  disableDays?: string;
  beforeDate?: string;
  afterDate?: string;
  dateRange?: string;
  specificDates?: string;
  startWeekOn?: string;

  // Linear scale
  scaleStart?: number;
  scaleEnd?: number;
  scaleStep?: number;
  leftLabel?: string;
  centerLabel?: string;
  rightLabel?: string;

  // Rating
  ratingStars?: number;

  // Signature
  signatureLabel?: string;

  // Matrix
  multipleSelection?: boolean;
  randomizeRows?: boolean;

  // Answer piping
  mentions?: Array<{ displayText: string; blockId: string }>;
}

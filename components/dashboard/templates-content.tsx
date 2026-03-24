"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowDownToLine } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TemplateField {
  label: string;
  required?: boolean;
  type?: "text" | "textarea" | "select" | "file";
}

interface TemplateSection {
  heading?: string;
  fields: TemplateField[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  longDescription: string[];
  category: string;
  author: string;
  authorAvatar?: string;
  uses: number;
  fields: string[];
  sections: TemplateSection[];
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All",
  "By my team",
  "Creators",
  "Product",
  "Marketing",
  "HR",
  "Office",
  "Personal",
];

const MOCK_TEMPLATES: Template[] = [
  {
    id: "t1",
    name: "Registration Form Template",
    description: "Let's start with your personal details",
    longDescription: [
      "This Registration Form Template allows you to collect registrations in a clear and structured way for events, programs, or online access.",
      "The template includes common registration form fields such as name, email address, professional information, and can be easily customized to fit different registration flows.",
      "This free registration form template helps you manage signups efficiently and reduce manual follow up.",
    ],
    category: "Creators",
    author: "Blanq Templates",
    uses: 83374,
    fields: ["First Name", "Last Name", "Email address", "Where do you work?", "Company", "Job Title", "Country"],
    sections: [
      {
        heading: "Let's start with your personal details",
        fields: [
          { label: "First Name", required: true },
          { label: "Last Name", required: true },
          { label: "Email address", required: true },
          { label: "Phone number", required: true },
        ],
      },
      {
        heading: "Where do you work?",
        fields: [
          { label: "Company", required: true },
          { label: "Job Title" },
        ],
      },
      {
        heading: "What country do you live in?",
        fields: [{ label: "Country", type: "select", required: true }],
      },
    ],
  },
  {
    id: "t2",
    name: "Contact Form Template",
    description: "Get in touch with us",
    longDescription: [
      "This Contact Form Template makes it easy for visitors to reach out to your team with questions, feedback, or inquiries.",
      "It includes essential fields like name, email, phone, and a message area so you can capture all the information you need to respond quickly.",
    ],
    category: "Creators",
    author: "Blanq Templates",
    uses: 66137,
    fields: ["First name", "Last name", "Phone number", "Email", "Your question"],
    sections: [
      {
        fields: [
          { label: "First name", required: true },
          { label: "Last name", required: true },
          { label: "Phone number" },
          { label: "Email", required: true },
          { label: "Your question", type: "textarea", required: true },
        ],
      },
    ],
  },
  {
    id: "t3",
    name: "Lead Generation Form Template",
    description: "Welcome! You're just a few moments away",
    longDescription: [
      "This Lead Generation Form Template helps you capture qualified leads by collecting essential contact information from interested prospects.",
      "Keep it short and focused to maximize conversion rates. Customize it to match your brand and campaign needs.",
    ],
    category: "Marketing",
    author: "Blanq Templates",
    uses: 53008,
    fields: ["First name", "Last name", "Email"],
    sections: [
      {
        heading: "Welcome! You're just a few moments away from receiving great content in your inbox.",
        fields: [
          { label: "First name", required: true },
          { label: "Last name", required: true },
          { label: "Email", required: true },
        ],
      },
    ],
  },
  {
    id: "t4",
    name: "Feedback Form Template",
    description: "Thanks for using Blanq! We'd love to know more",
    longDescription: [
      "This Feedback Form Template helps you gather honest opinions from users, customers, or attendees about your product, service, or event.",
      "Use rating scales and open-ended questions to get both quantitative and qualitative insights that drive improvement.",
    ],
    category: "Product",
    author: "Blanq Templates",
    uses: 41205,
    fields: ["How would you rate us", "Overall experience", "Anything else?"],
    sections: [
      {
        heading: "How would you rate us on:",
        fields: [
          { label: "Customer service", required: true },
          { label: "Speed of delivery", required: true },
          { label: "Product quality", required: true },
        ],
      },
      {
        heading: "Tell us more",
        fields: [
          { label: "Anything else you'd like to say?", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "t5",
    name: "Event Registration Template",
    description: "Register for the upcoming event",
    longDescription: [
      "This Event Registration Template streamlines the sign-up process for conferences, workshops, webinars, and other events.",
      "Collect attendee details, preferences, and dietary requirements all in one place to make event planning effortless.",
    ],
    category: "HR",
    author: "Blanq Templates",
    uses: 28490,
    fields: ["Full Name", "Email", "Company", "Dietary requirements", "Session preference"],
    sections: [
      {
        heading: "Your details",
        fields: [
          { label: "Full Name", required: true },
          { label: "Email", required: true },
          { label: "Company" },
        ],
      },
      {
        heading: "Preferences",
        fields: [
          { label: "Dietary requirements", type: "select" },
          { label: "Session preference", type: "select" },
        ],
      },
    ],
  },
  {
    id: "t6",
    name: "Job Application Form",
    description: "Apply for this position",
    longDescription: [
      "This Job Application Form Template helps you collect structured applications from candidates with all the information your hiring team needs.",
      "Include fields for personal details, work experience, and file uploads for resumes and cover letters.",
    ],
    category: "Office",
    author: "Blanq Templates",
    uses: 19832,
    fields: ["Full Name", "Email", "Phone Number", "Resume", "Cover Letter"],
    sections: [
      {
        heading: "Personal information",
        fields: [
          { label: "Full Name", required: true },
          { label: "Email", required: true },
          { label: "Phone Number", required: true },
        ],
      },
      {
        heading: "Application",
        fields: [
          { label: "Resume", type: "file", required: true },
          { label: "Cover Letter", type: "file" },
          { label: "Why do you want to join us?", type: "textarea" },
        ],
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  return n.toLocaleString();
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Form Field Preview ──────────────────────────────────────────────────────

function PreviewField({ field }: { field: TemplateField }) {
  const required = field.required;

  if (field.type === "textarea") {
    return (
      <div>
        <div className="h-20 rounded-md border bg-background px-3 py-2 flex items-start">
          <span className="text-sm text-muted-foreground">{field.label}</span>
        </div>
        {required && (
          <span className="absolute -top-0 right-0 text-destructive text-xs">*</span>
        )}
      </div>
    );
  }

  if (field.type === "file") {
    return (
      <div className="h-9 rounded-md border border-dashed bg-background px-3 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{field.label}</span>
        {required && <span className="text-destructive text-xs">*</span>}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-9 rounded-md border bg-background px-3 flex items-center">
        <span className="text-sm text-muted-foreground">{field.label}</span>
      </div>
      {required && (
        <span className="absolute top-1/2 -translate-y-1/2 -right-3 text-destructive text-sm">*</span>
      )}
    </div>
  );
}

// ─── Template Detail View ────────────────────────────────────────────────────

function TemplateDetail({ template }: { template: Template }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-10 md:px-10">
        {/* Title */}
        <h1 className="text-3xl font-bold">{template.name}</h1>

        {/* Long description */}
        <div className="mt-6 space-y-4">
          {template.longDescription.map((paragraph, i) => (
            <p key={i} className="text-muted-foreground italic leading-relaxed">
              {i === 0 ? (
                <>
                  This <strong className="font-semibold not-italic text-foreground">{template.name}</strong>{" "}
                  {paragraph.replace(`This ${template.name} `, "")}
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}
        </div>

        {/* Form sections */}
        <div className="mt-10 space-y-8">
          {template.sections.map((section, si) => (
            <div key={si}>
              {section.heading && (
                <h2 className="text-lg font-semibold mb-4">
                  {section.heading}
                  {section.fields.some((f) => f.required) && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </h2>
              )}
              <div className="space-y-3 max-w-md">
                {section.fields.map((field, fi) => (
                  <PreviewField key={fi} field={field} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit button preview */}
        <div className="mt-10 max-w-md">
          <Button className="rounded-md">Submit</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Template Card ───────────────────────────────────────────────────────────

function TemplateCard({
  template,
  onClick,
}: {
  template: Template;
  onClick: () => void;
}) {
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md group"
      onClick={onClick}
    >
      {/* Mini form preview */}
      <div className="aspect-[4/3] bg-muted/50 border-b p-5 flex flex-col justify-start">
        <p className="text-sm font-bold">{template.name.replace(" Template", "")}</p>
        <p className="text-[11px] text-muted-foreground mt-1">{template.description}</p>
        <div className="mt-3 space-y-1.5">
          {template.fields.slice(0, 4).map((field) => (
            <div key={field} className="h-5 rounded border bg-background px-2 flex items-center">
              <span className="text-[10px] text-muted-foreground truncate">{field}</span>
            </div>
          ))}
          {template.fields.length > 4 && (
            <div className="h-5 rounded border bg-background px-2 flex items-center">
              <span className="text-[10px] text-muted-foreground">...</span>
            </div>
          )}
        </div>
      </div>

      <CardContent className="px-4 pt-3 pb-0">
        <p className="text-sm font-semibold truncate">{template.name}</p>
      </CardContent>

      <CardFooter className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-5 w-5">
            <AvatarImage src={template.authorAvatar} alt={template.author} />
            <AvatarFallback className="text-[8px]">
              {getInitials(template.author)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">
            {template.author}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <ArrowDownToLine className="h-3 w-3" />
          <span>{formatCount(template.uses)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

// ─── Main Content ────────────────────────────────────────────────────────────

export function TemplatesContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const selectedTemplate = MOCK_TEMPLATES.find((t) => t.id === selectedTemplateId);

  const filtered =
    selectedCategory === "All" || selectedCategory === "By my team"
      ? MOCK_TEMPLATES
      : MOCK_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <>
      {/* Dynamic header */}
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="flex-1">
          <BreadcrumbList>
            {selectedTemplate ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => setSelectedTemplateId(null)}
                  >
                    Templates
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedTemplate.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>Templates</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        {selectedTemplate && (
          <Button size="sm">Use this template</Button>
        )}
      </header>

      {/* Content */}
      {selectedTemplate ? (
        <TemplateDetail template={selectedTemplate} />
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold md:text-4xl">
                Explore form & survey templates
              </h1>
              <p className="mt-2 text-muted-foreground">
                Explore, pick, and customize templates to your needs.
              </p>
            </div>

            {/* Category filter pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Template grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onClick={() => setSelectedTemplateId(template.id)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No templates found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

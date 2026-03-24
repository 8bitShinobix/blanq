"use client";

import { useState, useRef, useMemo } from "react";
import {
  Link2,
  Pencil,
  Copy,
  Check,
  MoreHorizontal,
  Inbox,
  Construction,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useFormContentStore } from "@/stores/form-content-store";

// ---------------------------------------------------------------------------
// Share Tab
// ---------------------------------------------------------------------------

function ShareTab() {
  const title = useFormContentStore((s) => s.title);
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://blanq.app/r/${encodeURIComponent(
    title.toLowerCase().replace(/\s+/g, "-") || "untitled"
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Share Link + Link Preview row */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Share Link */}
        <div>
          <h2 className="text-lg font-semibold">Share Link</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your form is now published and ready to be shared with the world!
            Copy this link to share your form on social media, messaging apps or
            via email.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm select-all">
              {shareUrl}
            </div>
            <Button size="sm" className="gap-1.5" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <button className="mt-2 text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground">
            Use custom domain
          </button>
        </div>

        {/* Link Preview */}
        <div>
          <h2 className="text-lg font-semibold">Link Preview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            When you share a link, it will embed a preview similar to the one
            below on social media, messaging apps, and search engines.
          </p>
          <div className="mt-4 rounded-lg border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Blanq Forms
            </p>
            <p className="mt-0.5 text-sm font-medium text-blue-600">
              {title || "Untitled Form"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Made with Blanq, the simplest way to create forms.
            </p>
            <div className="mt-3 flex h-24 items-center justify-center rounded-md bg-muted/50 text-xs text-muted-foreground">
              Form preview
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Embed Form */}
      <div>
        <h2 className="text-lg font-semibold">Embed Form</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use these options to embed your form into your own website.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Standard",
              description: "Embed inline on your page",
              lines: [true, true, false, true],
            },
            {
              label: "Full page",
              description: "Takes over the full page",
              lines: [true, false, true, false],
            },
            {
              label: "Popup",
              description: "Opens as a modal overlay",
              lines: [false, true, true, true],
            },
          ].map((card) => (
            <button
              key={card.label}
              className="group rounded-lg border border-border p-4 text-left transition-colors hover:border-foreground/30 hover:bg-muted/30"
            >
              <div className="mb-3 flex h-20 flex-col justify-center gap-1.5 rounded-md bg-muted/50 px-3">
                {card.lines.map((wide, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full ${
                      wide ? "w-3/4" : "w-1/2"
                    } bg-muted-foreground/20`}
                  />
                ))}
              </div>
              <p className="text-sm font-medium">{card.label}</p>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings Tab
// ---------------------------------------------------------------------------

function SettingRow({
  title,
  description,
  badge,
  enabled,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{title}</h3>
            {badge && (
              <Badge variant="secondary" className="text-[10px] font-medium text-violet-600 bg-violet-50 border-violet-200">
                {badge}
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} className="shrink-0" />
      </div>
      {enabled && children && <div className="mt-3">{children}</div>}
    </div>
  );
}

const SETTINGS_DEFAULTS = {
  redirectEnabled: false,
  redirectUrl: "",
  brandingEnabled: true,
  partialSubmissions: false,
  selfNotification: false,
  selfEmail: "",
  respondentNotification: false,
  closeForm: false,
  scheduleClose: false,
  scheduleDate: "",
  limitSubmissions: false,
  submissionLimit: "",
  closedMessage: false,
  closedMessageText: "This form is no longer accepting responses.",
  preventDuplicates: false,
  autoJump: false,
  saveForLater: false,
};

function SettingsTab() {
  const [redirectEnabled, setRedirectEnabled] = useState(SETTINGS_DEFAULTS.redirectEnabled);
  const [redirectUrl, setRedirectUrl] = useState(SETTINGS_DEFAULTS.redirectUrl);
  const [brandingEnabled, setBrandingEnabled] = useState(SETTINGS_DEFAULTS.brandingEnabled);
  const [partialSubmissions, setPartialSubmissions] = useState(SETTINGS_DEFAULTS.partialSubmissions);

  const [selfNotification, setSelfNotification] = useState(SETTINGS_DEFAULTS.selfNotification);
  const [selfEmail, setSelfEmail] = useState(SETTINGS_DEFAULTS.selfEmail);
  const [respondentNotification, setRespondentNotification] = useState(SETTINGS_DEFAULTS.respondentNotification);

  const [closeForm, setCloseForm] = useState(SETTINGS_DEFAULTS.closeForm);
  const [scheduleClose, setScheduleClose] = useState(SETTINGS_DEFAULTS.scheduleClose);
  const [scheduleDate, setScheduleDate] = useState(SETTINGS_DEFAULTS.scheduleDate);
  const [limitSubmissions, setLimitSubmissions] = useState(SETTINGS_DEFAULTS.limitSubmissions);
  const [submissionLimit, setSubmissionLimit] = useState(SETTINGS_DEFAULTS.submissionLimit);
  const [closedMessage, setClosedMessage] = useState(SETTINGS_DEFAULTS.closedMessage);
  const [closedMessageText, setClosedMessageText] = useState(SETTINGS_DEFAULTS.closedMessageText);
  const [preventDuplicates, setPreventDuplicates] = useState(SETTINGS_DEFAULTS.preventDuplicates);

  const [autoJump, setAutoJump] = useState(SETTINGS_DEFAULTS.autoJump);
  const [saveForLater, setSaveForLater] = useState(SETTINGS_DEFAULTS.saveForLater);

  // Track saved snapshot to detect dirty state
  const savedRef = useRef({ ...SETTINGS_DEFAULTS });

  const current = useMemo(
    () => ({
      redirectEnabled, redirectUrl, brandingEnabled, partialSubmissions,
      selfNotification, selfEmail, respondentNotification,
      closeForm, scheduleClose, scheduleDate, limitSubmissions, submissionLimit,
      closedMessage, closedMessageText, preventDuplicates, autoJump, saveForLater,
    }),
    [
      redirectEnabled, redirectUrl, brandingEnabled, partialSubmissions,
      selfNotification, selfEmail, respondentNotification,
      closeForm, scheduleClose, scheduleDate, limitSubmissions, submissionLimit,
      closedMessage, closedMessageText, preventDuplicates, autoJump, saveForLater,
    ]
  );

  const isDirty = JSON.stringify(current) !== JSON.stringify(savedRef.current);

  const handleSave = () => {
    savedRef.current = { ...current };
    // Force re-render so isDirty updates
    setAutoJump(current.autoJump);
  };

  return (
    <>
      <div className="space-y-0">
        {/* ─── General ─── */}
        <h2 className="text-lg font-semibold">General</h2>
        <Separator className="mt-2" />

        <SettingRow
          title="Redirect on completion"
          description="Redirect to a custom URL when the form is submitted."
          enabled={redirectEnabled}
          onToggle={setRedirectEnabled}
        >
          <Input
            placeholder="https://example.com/thank-you"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            className="max-w-md"
          />
        </SettingRow>
        <Separator />

        <SettingRow
          title="Blanq branding"
          description='Show "Made with Blanq" on your form.'
          badge="Pro"
          enabled={brandingEnabled}
          onToggle={setBrandingEnabled}
        />
        <Separator />

        <SettingRow
          title="Partial submissions"
          description="Collect answers from people who filled in a part of your form, but didn't click the submit button."
          badge="Pro"
          enabled={partialSubmissions}
          onToggle={setPartialSubmissions}
        />

        {/* ─── Email Notifications ─── */}
        <div className="pt-8">
          <h2 className="text-lg font-semibold">Email Notifications</h2>
        </div>
        <Separator className="mt-2" />

        <SettingRow
          title="Self email notification"
          description="Receive an email notification each time someone submits your form."
          enabled={selfNotification}
          onToggle={setSelfNotification}
        >
          <Input
            type="email"
            placeholder="your@email.com"
            value={selfEmail}
            onChange={(e) => setSelfEmail(e.target.value)}
            className="max-w-md"
          />
        </SettingRow>
        <Separator />

        <SettingRow
          title="Respondent email notification"
          description="Send a confirmation email to respondents after they submit the form."
          badge="Pro"
          enabled={respondentNotification}
          onToggle={setRespondentNotification}
        />

        {/* ─── Access ─── */}
        <div className="pt-8">
          <h2 className="text-lg font-semibold">Access</h2>
        </div>
        <Separator className="mt-2" />

        <SettingRow
          title="Close form"
          description="People won't be able to respond to this form anymore."
          enabled={closeForm}
          onToggle={setCloseForm}
        />
        <Separator />

        <SettingRow
          title="Close form on a scheduled date"
          description="Schedule a date on which the form will be closed for new submissions."
          enabled={scheduleClose}
          onToggle={setScheduleClose}
        >
          <Input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="max-w-md"
          />
        </SettingRow>
        <Separator />

        <SettingRow
          title="Limit number of submissions"
          description="Set how many submissions you want to receive in total."
          enabled={limitSubmissions}
          onToggle={setLimitSubmissions}
        >
          <Input
            type="number"
            placeholder="100"
            value={submissionLimit}
            onChange={(e) => setSubmissionLimit(e.target.value)}
            className="max-w-[200px]"
          />
        </SettingRow>
        <Separator />

        <SettingRow
          title="Closed form message"
          description="This is what the recipients will see if you closed the form with one of the options above."
          enabled={closedMessage}
          onToggle={setClosedMessage}
        >
          <Textarea
            value={closedMessageText}
            onChange={(e) => setClosedMessageText(e.target.value)}
            rows={3}
            className="max-w-md resize-none"
          />
        </SettingRow>
        <Separator />

        <SettingRow
          title="Prevent duplicate submissions"
          description="Ensure each respondent can only submit the form once by selecting a form field (e.g. email address, phone number, IP address) that will be used as a unique identifier."
          enabled={preventDuplicates}
          onToggle={setPreventDuplicates}
        />

        {/* ─── Behaviour ─── */}
        <div className="pt-8">
          <h2 className="text-lg font-semibold">Behaviour</h2>
        </div>
        <Separator className="mt-2" />

        <SettingRow
          title="Auto jump to next page"
          description="Automatically advance to the next page when a selection is made."
          enabled={autoJump}
          onToggle={setAutoJump}
        />
        <Separator />

        <SettingRow
          title="Save answers for later"
          description="Allow respondents to save their progress and come back to finish the form later."
          enabled={saveForLater}
          onToggle={setSaveForLater}
        />
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 -mx-6 mt-6 border-t bg-background px-6 py-3">
        <Button disabled={!isDirty} onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Placeholder tabs
// ---------------------------------------------------------------------------

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-medium">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function PublishedView() {
  const title = useFormContentStore((s) => s.title);
  const setPublished = useFormContentStore((s) => s.setPublished);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{title || "Untitled Form"}</h1>
            <button className="rounded-md p-1 text-muted-foreground hover:bg-muted">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
              <Link2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => setPublished(false)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="share" className="h-full">
          <div className="border-b px-6">
            <TabsList variant="line" className="h-10 gap-0 p-0">
              <TabsTrigger value="submissions" className="px-3 text-sm">
                Submissions
              </TabsTrigger>
              <TabsTrigger value="share" className="px-3 text-sm">
                Share
              </TabsTrigger>
              <TabsTrigger value="integrations" className="px-3 text-sm">
                Integrations
              </TabsTrigger>
              <TabsTrigger value="settings" className="px-3 text-sm">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mx-auto max-w-4xl px-6 py-8">
            <TabsContent value="share">
              <ShareTab />
            </TabsContent>

            <TabsContent value="submissions">
              <EmptyState
                icon={Inbox}
                title="No submissions yet"
                description="When someone fills out your form, their responses will appear here."
              />
            </TabsContent>

            <TabsContent value="integrations">
              <EmptyState
                icon={Construction}
                title="Integrations coming soon"
                description="The integrations feature is currently under development. Connect your form to other tools and services soon."
              />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

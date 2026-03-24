"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Globe,
  Plus,
  Copy,
  Check,
  ArrowLeft,
  ExternalLink,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  Loader2,
} from "lucide-react";
import { AddDomainDialog } from "./add-domain-dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

type DomainStatus = "pending" | "verifying" | "issuing_ssl" | "active" | "failed";

interface DnsRecord {
  type: string;
  name: string;
  value: string;
  verified: boolean;
}

interface FormMapping {
  formId: string;
  formName: string;
  slug: string;
}

interface Domain {
  id: string;
  domain: string;
  status: DomainStatus;
  records: DnsRecord[];
  mappings: FormMapping[];
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_DOMAINS: Domain[] = [
  {
    id: "d1",
    domain: "forms.acme.com",
    status: "active",
    records: [
      { type: "CNAME", name: "forms", value: "proxy.blanq.app", verified: true },
      { type: "TXT", name: "_blanq.forms", value: "blanq-verify=abc123xyz", verified: true },
    ],
    mappings: [
      { formId: "f1", formName: "Contact Form", slug: "contact" },
      { formId: "f2", formName: "Feedback Survey", slug: "feedback" },
    ],
  },
  {
    id: "d2",
    domain: "survey.example.org",
    status: "verifying",
    records: [
      { type: "CNAME", name: "survey", value: "proxy.blanq.app", verified: false },
      { type: "TXT", name: "_blanq.survey", value: "blanq-verify=def456uvw", verified: false },
    ],
    mappings: [],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DomainStatus }) {
  switch (status) {
    case "active":
      return (
        <Badge className="gap-1 bg-emerald-500/15 text-emerald-700 border-emerald-500/25 hover:bg-emerald-500/15">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      );
    case "verifying":
      return (
        <Badge className="gap-1 bg-amber-500/15 text-amber-700 border-amber-500/25 hover:bg-amber-500/15">
          <Clock className="h-3 w-3" />
          Verifying DNS
        </Badge>
      );
    case "issuing_ssl":
      return (
        <Badge className="gap-1 bg-orange-500/15 text-orange-700 border-orange-500/25 hover:bg-orange-500/15">
          <Shield className="h-3 w-3" />
          Issuing SSL
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={handleCopy}
      title="Copy"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

// ─── Domain Detail View ──────────────────────────────────────────────────────

function DnsRecordsTab({ domain }: { domain: Domain }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Add these records at your DNS provider (Cloudflare, Namecheap, GoDaddy, etc.) to connect your domain.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Type</TableHead>
            <TableHead className="w-[180px]">Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="w-[90px]">Status</TableHead>
            <TableHead className="w-[40px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {domain.records.map((record, i) => (
            <TableRow key={i}>
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs">
                  {record.type}
                </Badge>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  {record.name}
                </code>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded break-all">
                  {record.value}
                </code>
              </TableCell>
              <TableCell>
                {record.verified ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <Clock className="h-3.5 w-3.5" />
                    Pending
                  </span>
                )}
              </TableCell>
              <TableCell>
                <CopyButton text={record.value} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4 text-xs text-muted-foreground">
        DNS changes can take up to 48 hours to propagate. An SSL certificate will be issued automatically once records are verified.
      </p>
    </div>
  );
}

function FormUrlsTab({ domain }: { domain: Domain }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Map your published forms to custom URLs on{" "}
        <span className="font-medium text-foreground">{domain.domain}</span>.
      </p>
      {domain.mappings.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-[40px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {domain.mappings.map((mapping) => {
              const url = `https://${domain.domain}/${mapping.slug}`;
              return (
                <TableRow key={mapping.formId}>
                  <TableCell className="text-sm font-medium">
                    {mapping.formName}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      /{mapping.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {url}
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </TableCell>
                  <TableCell>
                    <CopyButton text={url} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="rounded-md border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No forms mapped yet. Publish a form and map it to a custom URL.
          </p>
        </div>
      )}
      <Button variant="outline" size="sm" className="mt-4">
        <Plus className="h-4 w-4 mr-1.5" />
        Add mapping
      </Button>
    </div>
  );
}

function DomainSettingsTab() {
  const [indexing, setIndexing] = useState(true);

  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <Label htmlFor="pageTitle" className="text-sm font-semibold">
          Page title
        </Label>
        <Input
          id="pageTitle"
          className="mt-1.5"
          placeholder="Your brand name"
        />
      </div>
      <div>
        <Label htmlFor="pageDesc" className="text-sm font-semibold">
          Page description
        </Label>
        <Input
          id="pageDesc"
          className="mt-1.5"
          placeholder="A short description for social sharing"
        />
      </div>
      <div>
        <Label htmlFor="favicon" className="text-sm font-semibold">
          Favicon
        </Label>
        <div className="mt-1.5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="outline" size="sm">
            Upload
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-8">
        <div>
          <p className="text-sm font-semibold">Search engine indexing</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Allow search engines to index forms on this domain.
          </p>
        </div>
        <Switch checked={indexing} onCheckedChange={setIndexing} />
      </div>

      <Separator />

      <div>
        <Label htmlFor="headCode" className="text-sm font-semibold">
          Custom code (head)
        </Label>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Add tracking scripts, meta tags, or other code to the &lt;head&gt; of your domain pages.
        </p>
        <Textarea
          id="headCode"
          className="mt-1.5 font-mono text-xs"
          placeholder="<script>...</script>"
          rows={4}
        />
      </div>

      <Button size="sm">Save settings</Button>
    </div>
  );
}

function DomainDetail({
  domain,
  onBack,
}: {
  domain: Domain;
  onBack: () => void;
}) {
  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-4 -ml-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        All domains
      </Button>

      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-2xl font-bold">{domain.domain}</h1>
        <StatusBadge status={domain.status} />
      </div>

      <Tabs defaultValue="dns" className="mt-4">
        <TabsList variant="line" className="border-b w-full justify-start">
          <TabsTrigger value="dns">DNS Records</TabsTrigger>
          <TabsTrigger value="urls">Form URLs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dns" className="pt-6">
          <DnsRecordsTab domain={domain} />
        </TabsContent>

        <TabsContent value="urls" className="pt-6">
          <FormUrlsTab domain={domain} />
        </TabsContent>

        <TabsContent value="settings" className="pt-6">
          <DomainSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Domain List View ────────────────────────────────────────────────────────

function DomainCard({
  domain,
  onConfigure,
  onRemove,
}: {
  domain: Domain;
  onConfigure: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
        <Globe className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate">{domain.domain}</p>
          <StatusBadge status={domain.status} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {domain.mappings.length > 0
            ? `${domain.mappings.length} form${domain.mappings.length !== 1 ? "s" : ""} mapped`
            : "No forms mapped"}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" onClick={onConfigure}>
          Configure
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={onRemove}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ─── Main Content ────────────────────────────────────────────────────────────

export function DomainsContent() {
  const [domains, setDomains] = useState<Domain[]>(MOCK_DOMAINS);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedDomain = domains.find((d) => d.id === selectedDomainId);

  const handleAddDomain = (domainName: string) => {
    const parts = domainName.split(".");
    const subdomain = parts.length > 2 ? parts[0] : domainName.split(".")[0];
    const newDomain: Domain = {
      id: `d-${Date.now()}`,
      domain: domainName,
      status: "pending",
      records: [
        {
          type: "CNAME",
          name: subdomain,
          value: "proxy.blanq.app",
          verified: false,
        },
        {
          type: "TXT",
          name: `_blanq.${subdomain}`,
          value: `blanq-verify=${Math.random().toString(36).slice(2, 14)}`,
          verified: false,
        },
      ],
      mappings: [],
    };
    setDomains((prev) => [...prev, newDomain]);
    setSelectedDomainId(newDomain.id);
  };

  const handleRemoveDomain = (id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
    if (selectedDomainId === id) setSelectedDomainId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
      <div className="max-w-3xl">
        {selectedDomain ? (
          <DomainDetail
            domain={selectedDomain}
            onBack={() => setSelectedDomainId(null)}
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Domains</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Connect custom domains to host forms under your own branded URLs.
                </p>
              </div>
              <Button size="sm" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add domain
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              {domains.length > 0 ? (
                domains.map((domain) => (
                  <DomainCard
                    key={domain.id}
                    domain={domain}
                    onConfigure={() => setSelectedDomainId(domain.id)}
                    onRemove={() => handleRemoveDomain(domain.id)}
                  />
                ))
              ) : (
                <div className="rounded-lg border border-dashed p-10 text-center">
                  <Globe className="h-10 w-10 mx-auto text-muted-foreground/50" />
                  <h3 className="mt-4 text-sm font-semibold">No domains connected</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add your first custom domain to host forms under your own URL.
                  </p>
                  <Button
                    size="sm"
                    className="mt-4"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add your first domain
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <AddDomainDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddDomain}
      />
    </div>
  );
}

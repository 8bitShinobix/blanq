"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Link2, AlertTriangle } from "lucide-react";
import { useSession } from "@/hooks/use-session";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
    </svg>
  );
}

function MyAccountTab() {
  const { data: session } = useSession();
  const user = session?.user;

  const nameParts = (user?.name || "").split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {/* Left column — profile form */}
      <div className="space-y-5 max-w-lg">
        {/* Photo */}
        <div>
          <Label className="text-sm font-semibold">Photo</Label>
          <div className="mt-1.5">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name} />
              <AvatarFallback className="text-base">
                {user?.name ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* First name */}
        <div>
          <Label htmlFor="firstName" className="text-sm font-semibold">
            First name
          </Label>
          <Input
            id="firstName"
            className="mt-1.5"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Last name */}
        <div>
          <Label htmlFor="lastName" className="text-sm font-semibold">
            Last name
          </Label>
          <Input
            id="lastName"
            className="mt-1.5"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-semibold">
            Email
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="email"
              readOnly
              value={user?.email || ""}
              className="pr-28"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
            >
              Change email
            </Button>
          </div>
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="text-sm font-semibold">
            Password
          </Label>
          <div className="relative mt-1.5">
            <Input id="password" type="password" readOnly value="" className="pr-28" />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
            >
              Set password
            </Button>
          </div>
        </div>

        {/* Update button */}
        <Button size="sm">Update</Button>
      </div>

      {/* Right column — connected accounts & danger zone */}
      <div className="space-y-6">
        {/* Connected accounts */}
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            <h3 className="font-semibold">Connected accounts</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect your Blanq account with Google to enable faster, secure and
            more convenient access.
          </p>
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <GoogleIcon className="h-7 w-7 shrink-0" />
              <span className="text-sm font-medium">Google</span>
              <span className="size-2 rounded-full bg-emerald-500" />
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-muted-foreground text-xs"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Danger zone */}
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <h3 className="font-semibold">Danger zone</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            This will permanently delete your entire account. All your forms,
            submissions and workspaces will be deleted.
          </p>
          <Button variant="destructive" size="sm" className="mt-3">
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [productUpdates, setProductUpdates] = useState(true);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between gap-8">
        <div>
          <p className="text-sm font-semibold">Blanq Product Updates</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Receive email updates on what we built, why we built it, and how to use it.
          </p>
        </div>
        <Switch checked={productUpdates} onCheckedChange={setProductUpdates} />
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <h3 className="font-semibold">Blanq plan</h3>
        <Badge variant="secondary" className="font-normal text-muted-foreground">
          Free
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Upgrade to access advanced features designed for growing teams and creators.
      </p>
      <Button size="sm" className="mt-4">
        Upgrade plan
      </Button>
    </div>
  );
}

export function SettingsContent() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="account" className="mt-4">
        <TabsList variant="line" className="border-b w-full justify-start">
          <TabsTrigger value="account">My account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="pt-6">
          <MyAccountTab />
        </TabsContent>

        <TabsContent value="notifications" className="pt-6">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="billing" className="pt-6">
          <BillingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

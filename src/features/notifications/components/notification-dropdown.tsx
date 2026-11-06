"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { NotificationItem } from "./notification-item";
import { useNotificationCommands, useNotifications, useUnreadNotificationCount } from "../hooks/use-notifications";
import { notificationInboxPath } from "../lib/notification-href";

export function NotificationDropdown({ inboxHref }: { inboxHref?: string }) {
  const { user } = useAuth();
  const notices = useNotifications();
  const unread = useUnreadNotificationCount();
  const commands = useNotificationCommands();

  if (!user) return null;

  const href = inboxHref ?? notificationInboxPath(user.role);
  const unreadCount = unread.data ?? 0;
  const preview = (notices.data ?? []).slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Notifications"
        className="relative inline-flex size-8 items-center justify-center rounded-lg text-slate-600 outline-none hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(24rem,calc(100vw-1.5rem))] min-w-[min(24rem,calc(100vw-1.5rem))] p-0"
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2.5">
          <div>
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            <p className="text-[11px] text-slate-500">
              {unreadCount} unread · in-app inbox
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 gap-1 text-[11px] text-slate-600"
            disabled={unreadCount === 0 || commands.markAllAsRead.isPending}
            onClick={() => void commands.markAllAsRead.mutateAsync()}
          >
            <CheckCheck className="size-3.5" />
            Mark all read
          </Button>
        </div>
        <div className="max-h-96 space-y-2 overflow-y-auto p-2">
          {notices.isPending && (
            <p className="px-2 py-6 text-center text-xs text-slate-500">Loading notices…</p>
          )}
          {notices.isError && (
            <p className="px-2 py-6 text-center text-xs text-rose-700">Notifications could not be loaded.</p>
          )}
          {!notices.isPending && preview.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-slate-500">No notifications yet.</p>
          )}
          {preview.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              role={user.role}
              compact
              onMarkRead={(id) => void commands.markAsRead.mutateAsync(id)}
              onOpen={(notice) => {
                if (!notice.isRead) void commands.markAsRead.mutateAsync(notice.id);
              }}
            />
          ))}
        </div>
        <div className="border-t border-slate-100 px-3 py-2">
          <Link href={href} className="block text-center text-xs font-semibold text-blue-700 hover:underline">
            Open notification center
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

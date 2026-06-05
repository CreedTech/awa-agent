"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { useAuthStore } from "@/store/auth-store";
import { ROLE_HOME, ROLE_LABELS } from "@/lib/constants";
import type { Role } from "@/lib/types";

const ROLES: { role: Exclude<Role, "guest">; icon: "home" | "user" | "building" | "shield" }[] = [
  { role: "tenant", icon: "home" },
  { role: "agent", icon: "user" },
  { role: "landlord", icon: "building" },
  { role: "admin", icon: "shield" },
];

/**
 * Prototype-only control (design's "Switch Role"). Lets a reviewer jump
 * between every dashboard without rebuilding flows. Hidden in production
 * behind a real auth gate.
 */
export function RoleSwitcher() {
  const router = useRouter();
  const { role, switchRole, logout } = useAuthStore();

  const go = (r: Exclude<Role, "guest">) => {
    switchRole(r);
    router.push(ROLE_HOME[r]);
  };

  return (
    <div className="switch-role">
      <DropdownMenu>
        <DropdownMenuTrigger render={<button className="switch-role-btn" aria-label="Switch role" />}>
          <Icon name="swap" size={16} />
          <span>{role === "guest" ? "Preview as…" : ROLE_LABELS[role]}</span>
          <Icon name="chevD" size={14} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Switch role (demo)</DropdownMenuLabel>
            {ROLES.map(({ role: r, icon }) => (
              <DropdownMenuItem key={r} onClick={() => go(r)}>
                <Icon name={icon} size={16} /> {ROLE_LABELS[r]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <Icon name="logout" size={16} /> Exit to home
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

"use client"

import * as React from "react"
import {
  IconClipboardText,
  IconDashboard,
  IconInnerShadowTop,
  IconSettings,
} from "@tabler/icons-react"
import Link from "next/link"

import { NavMain } from "~/components/nav-main"
import { NavUser } from "~/components/nav-user"
import { useLoggedIn } from "~/hooks/api/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Forms",
      url: "/dashboard/forms",
      icon: IconClipboardText,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isFetching } = useLoggedIn()

  const sidebarUser = {
    name: isFetching ? "Loading..." : user?.fullName ?? "Creator",
    email: isFetching ? "Fetching account" : user?.email ?? "No email found",
    avatar: user?.profileImageUrl ?? "",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">SagaForms</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
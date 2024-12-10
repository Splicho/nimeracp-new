"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  LayoutDashboard,
  Store,
  Dices,
  ChartNoAxesCombined,
  Vote,
} from "lucide-react"

import { NavMain } from "@/components/cabinet/nav-main"
import { NavArcade } from "@/components/cabinet/nav-arcade"
import { NavUser } from "@/components/cabinet/nav-user"
import { TeamSwitcher } from "@/components/cabinet/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

// This is sample data.
const data = {
  teams: [
    {
      name: "Nimera CP",
      logo: GalleryVerticalEnd,
      plan: "Cabinet",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Cabinet",
      url: "/cabinet",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Characters",
          url: "#",
        },
        {
          title: "Realms",
          url: "#",
        },
        {
          title: "Statistics",
          url: "#",
        },
      ],
    },
    {
      title: "Shop",
      url: "#",
      icon: Store,
      items: [
        {
          title: "Items",
          url: "#",
        },
        {
          title: "Inventory",
          url: "#",
        },
        {
          title: "Purchases",
          url: "#",
        },
      ],
    },
    {
      title: "Vote",
      url: "/vote",
      icon: Vote,
      items: [],
    },
  ],
  arcade: [
    {
      name: "Lucky Wheel",
      url: "#",
      icon: Dices,
    },
    {
      name: "Crash",
      url: "#",
      icon: ChartNoAxesCombined,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavArcade arcade={data.arcade} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/cabinet/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { capitalize } from "lodash"

// Define breadcrumb mapping
const BREADCRUMB_TITLES: Record<string, string> = {
  cabinet: 'Cabinet',
  characters: 'Characters',
  account: 'Account Settings',
  store: 'Store',
  vote: 'Vote',
  // Add more mappings as needed
}

function generateBreadcrumbs(path: string) {
  const segments = path.split('/').filter(Boolean)
  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    const title = BREADCRUMB_TITLES[segment] || capitalize(segment)
    const isLast = index === segments.length - 1

    return {
      href,
      title,
      isLast
    }
  })
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug?: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  const path = params.slug ? ['cabinet', ...params.slug].join('/') : 'cabinet'
  const breadcrumbs = generateBreadcrumbs(path)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem key={crumb.href}>
                    {!crumb.isLast ? (
                      <>
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.title}
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </>
                    ) : (
                      <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

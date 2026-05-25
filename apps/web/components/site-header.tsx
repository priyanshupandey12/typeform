import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { useLoggedIn, useSignOut } from "~/hooks/api/auth"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export function SiteHeader() {
  const { user } = useLoggedIn();
  const { signOutAsync, isLoading: isSigningOut } = useSignOut();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutAsync();
    router.push("/");
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium leading-none">{user.fullName}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                disabled={isSigningOut}
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

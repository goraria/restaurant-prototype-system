import { appGlobal } from "@/constants/constants"

export function Copyright() {
  return (
    <footer className="border-grid border-t py-0">
      <div className="mx-auto py-4 px-6">
        <div className="text-balance text-left text-sm leading-loose">{/* text-muted-foreground text-center */}
          {appGlobal.copyright}
        </div>
      </div>
    </footer>
  )
}

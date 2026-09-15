import * as React from "react"
import { cn } from "@/lib/utils"
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-teal-50 text-teal-700 border-teal-200", className)} {...props} />
}

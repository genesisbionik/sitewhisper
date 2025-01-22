import { Button } from "@/components/ui/button"
import { Sparkles } from 'lucide-react'
import Link from "next/link"

export function UpgradeButton() {
  return (
    <Button asChild className="w-full" variant="default">
      <Link href="/tokens">
        <Sparkles className="mr-2 h-4 w-4" />
        Get More Tokens
      </Link>
    </Button>
  )
}


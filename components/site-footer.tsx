import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-4 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Company Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Company</h3>
            <nav className="flex flex-col gap-2">
              <Link 
                href="/about" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
              <Link 
                href="/careers" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Careers
              </Link>
            </nav>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Resources</h3>
            <nav className="flex flex-col gap-2">
              <Link 
                href="/blog" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Blog
              </Link>
              <Link 
                href="/documentation" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Documentation
              </Link>
              <Link 
                href="/guides" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Guides
              </Link>
            </nav>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Social Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Social</h3>
            <nav className="flex flex-col gap-2">
              <a 
                href="https://twitter.com/sitewhisper" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Twitter
              </a>
              <a 
                href="https://github.com/sitewhisper" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
              <a 
                href="https://linkedin.com/company/sitewhisper" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                LinkedIn
              </a>
            </nav>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 p-1"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold">SiteWhisper</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SiteWhisper. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 
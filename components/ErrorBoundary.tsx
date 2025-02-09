"use client"

import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

export default function ErrorBoundary({
  children,
  context
}: {
  children: React.ReactNode
  context: string
}) {
  const { toast } = useToast()

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      toast({
        title: `${context} Error`,
        description: event.error.message,
        variant: "destructive"
      })
      event.preventDefault();
    }
    
    window.addEventListener('error', errorHandler)
    return () => window.removeEventListener('error', errorHandler)
  }, [context, toast])

  return <>{children}</>
} 
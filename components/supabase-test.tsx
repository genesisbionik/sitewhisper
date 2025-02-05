"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export function SupabaseTest() {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      // Test 1: Try to fetch a small number of profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, created_at')
        .limit(1)

      if (profilesError) throw profilesError

      // Test 2: Try to fetch a small number of websites
      const { data: websites, error: websitesError } = await supabase
        .from('websites')
        .select('id, created_at')
        .limit(1)

      if (websitesError) throw websitesError

      toast({
        title: "Connection Successful! 🎉",
        description: `Successfully connected to Supabase and queried tables.
          Profiles found: ${profiles?.length ?? 0}
          Websites found: ${websites?.length ?? 0}`,
      })

    } catch (error) {
      console.error('Supabase connection error:', error)
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Supabase",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-xl font-bold">Supabase Connection Test</h2>
      <Button 
        onClick={testConnection} 
        disabled={isLoading}
      >
        {isLoading ? "Testing Connection..." : "Test Supabase Connection"}
      </Button>
    </div>
  )
} 
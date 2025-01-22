"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenStatus } from "@/components/token-status"
import { useToast } from "@/components/ui/use-toast"

const INITIAL_TOKENS = 100;

const subscriptionPlans = [
  { name: "Basic", tokens: 100, price: 9.99 },
  { name: "Pro", tokens: 500, price: 29.99 },
  { name: "Enterprise", tokens: 2000, price: 99.99 },
]

export default function TokensPage() {
  const [availableTokens, setAvailableTokens] = useState(INITIAL_TOKENS)
  const { toast } = useToast()

  const handlePurchase = (plan: typeof subscriptionPlans[number]) => {
    // Implement actual purchase logic here
    setAvailableTokens((prev) => prev + plan.tokens)
    toast({
      title: "Purchase successful",
      description: `You've purchased ${plan.tokens} tokens.`,
    })
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Token Management</h1>
      <div className="mb-8">
        <TokenStatus availableTokens={availableTokens} maxTokens={INITIAL_TOKENS} />
      </div>
      <h2 className="mb-4 text-2xl font-semibold">Purchase Tokens</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.tokens} tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${plan.price}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handlePurchase(plan)} className="w-full">
                Purchase
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}


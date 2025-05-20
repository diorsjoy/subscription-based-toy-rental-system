import { Progress } from "@/components/ui/progress"

interface SubscriptionProgressProps {
  totalTokens: number
  usedTokens: number
  daysLeft: number
}

export function SubscriptionProgress({ totalTokens, usedTokens, daysLeft }: SubscriptionProgressProps) {
  const progress = (usedTokens / totalTokens) * 100

  return (
    <div className="space-y-4">
      <Progress value={progress} />
      <p className="text-sm text-muted-foreground">
        {usedTokens} / {totalTokens} tokens used. {daysLeft} days left.
      </p>
    </div>
  )
}


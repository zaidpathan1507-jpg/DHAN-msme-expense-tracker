import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { IntroScreen } from '@/components/intro/IntroScreen'
import { LoginPage } from '@/components/auth/LoginPage'

export const Route = createFileRoute('/')({
  component: EntryFlow,
})

type Stage = 'intro' | 'login'

function EntryFlow() {
  const [stage, setStage] = useState<Stage>('intro')
  const navigate = useNavigate()

  return (
    <div key={stage} className="animate-page-in">
      {stage === 'intro' ? (
        <IntroScreen onContinue={() => setStage('login')} />
      ) : (
        <LoginPage onBack={() => setStage('intro')} onSuccess={() => navigate({ to: '/dashboard' })} />
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { requestAdminOTP, verifyAdminOTP } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

type Step = 'email' | 'otp'

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await requestAdminOTP(email)
      setStep('otp')
      setOtpSent(true)
      setMessage('OTP sent to your email. Check your inbox.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await verifyAdminOTP(email, otp)
      setMessage('Access granted! Redirecting to admin panel...')
      setTimeout(() => {
        router.push('/admin')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-foreground">
            Admin Access
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Zentech Services Administration Panel
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-light text-foreground mb-2">
                Admin Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                required
                disabled={loading}
                className="w-full border border-border px-4 py-2 rounded"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Only authorized admin emails can access this panel
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-foreground text-background hover:bg-muted-foreground py-2 rounded font-light"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                A 6-digit OTP has been sent to <strong>{email}</strong>
              </p>
              <label className="block text-sm font-light text-foreground mb-2">
                Enter OTP
              </label>
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                disabled={loading}
                className="w-full border border-border px-4 py-2 rounded text-center text-2xl letter-spacing-wide"
              />
              <p className="text-xs text-muted-foreground mt-2">
                OTP expires in 5 minutes
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('email')
                  setOtp('')
                  setError('')
                }}
                disabled={loading}
                className="flex-1 border border-border px-4 py-2 rounded font-light"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex-1 bg-foreground text-background hover:bg-muted-foreground py-2 rounded font-light"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}

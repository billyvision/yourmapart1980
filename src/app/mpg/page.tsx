'use client'

import { MPGBuilder } from '@/components/mpg/MPG-builder'
import { useSearchParams } from 'next/navigation'

export default function MPGPage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')

  return <MPGBuilder templateId={templateId} />
}

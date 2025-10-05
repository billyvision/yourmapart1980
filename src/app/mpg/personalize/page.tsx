'use client'

import { MPGBasicEditor } from '@/components/mpg/MPG-basic-editor'
import { useSearchParams } from 'next/navigation'

export default function PersonalizePage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')

  return <MPGBasicEditor templateId={templateId} />
}

import type { ReactNode } from 'react'

interface SimplePageProps {
  title: string
  description: string
  children?: ReactNode
}

function SimplePage({ title, description, children }: SimplePageProps) {
  return (
    <section className="page simple-page">
      <p className="eyebrow">THƯ VIỆN CỦA BẠN</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
      {children ?? <div className="empty-state">Nội dung sẽ được bổ sung trong phần tiếp theo.</div>}
    </section>
  )
}

export default SimplePage

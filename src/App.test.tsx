import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('music library', () => {
  it('debounces searching by song title and displays the matching result', async () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Tìm kiếm'), {
      target: { value: 'Mưa tháng Sáu 1' },
    })

    expect(screen.getByText('Tìm thấy 10.000 bài hát')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Tìm thấy 37 bài hát')).toBeInTheDocument()
      expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument()
    })
  })

  it('shows an empty state when the search has no matches', async () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Tìm kiếm'), {
      target: { value: 'bài hát không tồn tại' },
    })

    expect(await screen.findByText('Không tìm thấy bài hát nào.')).toBeInTheDocument()
  })
})

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('music library', () => {
  beforeEach(() => {
    window.localStorage.removeItem('music-favorites')
  })

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

  it('plays the visible list and persists favorites on the favorites page', async () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Thể loại'), {
      target: { value: 'Pop' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Phát Mưa tháng Sáu 1' }))
    expect(screen.getByText('Đang phát: Mưa tháng Sáu 1 – Lê Minh')).toBeInTheDocument()
    expect(screen.getByText((_, element) => element?.textContent === 'Hàng đợi: 2.000 bài')).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'Thêm vào yêu thích' })[0])
    fireEvent.click(screen.getByRole('link', { name: 'Yêu thích' }))

    expect(await screen.findByText('Mưa tháng Sáu 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Phát tất cả' })).toBeInTheDocument()
  })
})

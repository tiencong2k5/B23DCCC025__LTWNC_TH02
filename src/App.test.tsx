import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('music library', () => {
  beforeEach(() => {
    window.localStorage.removeItem('music-favorites')
    window.localStorage.removeItem('music-playlists')
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

  it('creates playlists with validation, adds a song, and plays all from its detail page', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Playlist' }))

    const nameInput = await screen.findByLabelText('Tên playlist')
    fireEvent.click(screen.getByRole('button', { name: 'Tạo' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Tên playlist không được để trống')

    fireEvent.change(nameInput, { target: { value: 'Nhạc chill' } })
    fireEvent.click(screen.getByRole('button', { name: 'Tạo' }))
    expect(await screen.findByText('Nhạc chill')).toBeInTheDocument()
    expect(window.localStorage.getItem('music-playlists')).toContain('Nhạc chill')

    fireEvent.change(nameInput, { target: { value: 'nhạc CHILL' } })
    fireEvent.click(screen.getByRole('button', { name: 'Tạo' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Tên playlist đã tồn tại')

    fireEvent.click(screen.getByRole('link', { name: 'Thư viện' }))
    fireEvent.change(screen.getByLabelText('Playlist đang chọn'), {
      target: { value: JSON.parse(window.localStorage.getItem('music-playlists') ?? '[]')[0].id },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Thêm Mưa tháng Sáu 1 vào playlist đang chọn' }))
    fireEvent.click(screen.getByRole('link', { name: 'Playlist' }))
    fireEvent.click(await screen.findByRole('link', { name: /Nhạc chill/ }))

    expect(await screen.findByText(/Tổng thời lượng: 2 phút 30 giây/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Phát tất cả' }))
    expect(screen.getByText('Đang phát: Mưa tháng Sáu 1 – Lê Minh')).toBeInTheDocument()
  })

  it('toggles between light and dark themes', () => {
    render(<App />)
    expect(document.querySelector('.app-shell')).toHaveAttribute('data-theme', 'light')
    fireEvent.click(screen.getByRole('button', { name: 'Giao diện tối' }))
    expect(document.querySelector('.app-shell')).toHaveAttribute('data-theme', 'dark')
    expect(screen.getByRole('button', { name: 'Giao diện sáng' })).toBeInTheDocument()
  })
})

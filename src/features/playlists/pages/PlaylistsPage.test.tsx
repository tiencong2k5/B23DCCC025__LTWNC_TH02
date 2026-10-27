import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { PlaylistProvider } from '../PlaylistProvider'
import PlaylistsPage from './PlaylistsPage'

function renderWithProviders() {
  return render(
    <MemoryRouter>
      <PlaylistProvider>
        <PlaylistsPage />
      </PlaylistProvider>
    </MemoryRouter>,
  )
}

describe('Trang playlist', () => {
  beforeEach(() => {
    window.localStorage.removeItem('music-playlists')
  })

  it('báo lỗi khi tạo playlist với tên trống', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    await user.click(screen.getByRole('button', { name: 'Tạo' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Tên playlist không được để trống')
  })

  it('thêm playlist vào danh sách sau khi nhập tên và bấm Tạo', async () => {
    const user = userEvent.setup()
    renderWithProviders()

    await user.type(screen.getByLabelText('Tên playlist'), 'Nhạc thư giãn')
    await user.click(screen.getByRole('button', { name: 'Tạo' }))

    expect(screen.getByText('Nhạc thư giãn')).toBeInTheDocument()
    expect(window.localStorage.getItem('music-playlists')).toContain('Nhạc thư giãn')
  })
})

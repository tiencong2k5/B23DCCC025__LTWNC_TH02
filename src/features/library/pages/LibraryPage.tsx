import { useCallback, useMemo, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { GENRES, SONGS } from '../data/songs'
import MemoizedSongRow, { type SongRowData } from '../components/SongRow'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import type { Genre } from '../../../types'

type SortOrder = 'default' | 'title' | 'duration'
type GenreFilter = Genre | 'all'

function LibraryPage() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState<GenreFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('default')
  const debouncedQuery = useDebounce(query, 300)

  const visibleSongs = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLocaleLowerCase('vi')
    const filteredSongs = SONGS.filter((song) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        song.title.toLocaleLowerCase('vi').includes(normalizedQuery) ||
        song.artist.toLocaleLowerCase('vi').includes(normalizedQuery)
      const matchesGenre = genre === 'all' || song.genre === genre
      return matchesQuery && matchesGenre
    })

    if (sortOrder === 'title') {
      return [...filteredSongs].sort((a, b) => a.title.localeCompare(b.title, 'vi'))
    }

    if (sortOrder === 'duration') {
      return [...filteredSongs].sort((a, b) => a.duration - b.duration)
    }

    return filteredSongs
  }, [debouncedQuery, genre, sortOrder])

  const rowData = useMemo(() => ({ songs: visibleSongs }), [visibleSongs])
  const getSongKey = useCallback((index: number, data: SongRowData) => data.songs[index].id, [])

  return (
    <section className="page library-page" aria-labelledby="library-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">KHÁM PHÁ ÂM NHẠC</p>
          <h1 id="library-title">Thư viện bài hát</h1>
          <p className="page-description">Tìm giai điệu phù hợp với tâm trạng của bạn.</p>
        </div>
        <div className="library-total"><strong>10.000</strong><span>bài hát</span></div>
      </div>

      <div className="filters">
        <div className="search-field">
          <label htmlFor="song-search">Tìm kiếm</label>
          <div className="search-input-wrap">
            <span aria-hidden="true">⌕</span>
            <input
              id="song-search"
              type="search"
              placeholder="Tên bài hát hoặc ca sĩ..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="select-field">
          <label htmlFor="genre-filter">Thể loại</label>
          <select id="genre-filter" value={genre} onChange={(event) => setGenre(event.target.value as GenreFilter)}>
            <option value="all">Tất cả</option>
            {GENRES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="select-field">
          <label htmlFor="sort-order">Sắp xếp</label>
          <select id="sort-order" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
            <option value="default">Mặc định</option>
            <option value="title">Tên A–Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </div>
      </div>

      <p className="result-count" aria-live="polite">Tìm thấy {visibleSongs.length.toLocaleString('vi-VN')} bài hát</p>

      {visibleSongs.length > 0 ? (
        <div className="song-table" role="table" aria-label="Danh sách bài hát">
          <div className="song-header" role="row">
            <span role="columnheader">#</span>
            <span role="columnheader">Tên bài hát</span>
            <span role="columnheader">Ca sĩ</span>
            <span role="columnheader">Thể loại</span>
            <span role="columnheader">Thời lượng</span>
            <span role="columnheader">Thao tác</span>
          </div>
          <FixedSizeList
            height={560}
            itemCount={visibleSongs.length}
            itemSize={56}
            itemData={rowData}
            itemKey={getSongKey}
            width="100%"
          >
            {MemoizedSongRow}
          </FixedSizeList>
        </div>
      ) : (
        <div className="empty-state">Không tìm thấy bài hát nào.</div>
      )}
    </section>
  )
}

export default LibraryPage

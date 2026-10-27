import { useParams } from 'react-router-dom'
import SimplePage from '../../../app/SimplePage'

function PlaylistDetailPage() {
  const { id } = useParams()

  return <SimplePage title="Chi tiết playlist" description={`Playlist ${id ?? ''}`} />
}

export default PlaylistDetailPage

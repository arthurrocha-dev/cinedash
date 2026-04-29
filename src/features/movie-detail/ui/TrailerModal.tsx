import { Play } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import type { Video } from '@/entities/movie/model/movie.types'

interface TrailerModalProps {
  trailer: Video
  movieTitle: string
}

export function TrailerModal({ trailer, movieTitle }: TrailerModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Play className="h-4 w-4 fill-current" />
          Ver Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Trailer: {movieTitle}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            title={`Trailer: ${movieTitle}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

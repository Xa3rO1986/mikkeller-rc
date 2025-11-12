import PhotoCard from '../PhotoCard'
import photoImage from '@assets/generated_images/Runners_celebrating_finish_969c4387.png'

export default function PhotoCardExample() {
  return (
    <div className="w-64 h-48">
      <PhotoCard
        id="1"
        url={photoImage}
        title="Финиш забега"
        eventTitle="Riverside 10K"
        onClick={() => console.log('Photo clicked')}
      />
    </div>
  )
}

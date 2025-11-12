import EventCard from '../EventCard'
import heroImage from '@assets/generated_images/Riverside_10k_route_cover_17dba083.png'

export default function EventCardExample() {
  return (
    <div className="max-w-sm">
      <EventCard
        slug="riverside-10k"
        title="Забег вдоль набережной"
        date="2024-12-20T10:00:00"
        location="Набережная, Москва"
        distance={10}
        elevation={50}
        coverImage={heroImage}
        status="open"
        tags={["10км", "городской", "набережная"]}
      />
    </div>
  )
}

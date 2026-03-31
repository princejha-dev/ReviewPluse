import Link from "next/link"

export default function RestaurantCard({
  id,
  name,
  location,
  rating,
  positive,
  issue,
  image,
}: any) {
  return (
    <Link href={`/restaurants/${id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden">

        <img src={image} className="w-full h-48 object-cover" />

        <div className="p-4">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-500">{location}</p>

          <div className="mt-3 text-green-600 text-sm font-medium">
            {positive} Positive
          </div>

          <div className="text-red-500 text-sm mt-1">
            Top Issue: {issue}
          </div>
        </div>

      </div>
    </Link>
  )
}
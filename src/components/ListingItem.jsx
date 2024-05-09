import { Link } from "react-router-dom"
import { MdLocationOn } from 'react-icons/md'


export const ListingItem = ({listing}) => {
  return (
    <div className="bg-white shadow-sm hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing cover"  className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"/>
        </Link>
        <div className="p-3">
            <p className="text-lg font-semibold truncate text-slate-700">{listing.name}</p>
            <div className="flex items-center gap-2">
                <MdLocationOn className="h-4 w-4 text-green-700"/>
                <p className="text-sm text-gray-600 truncate w-full">{listing.address}</p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
                {listing.description}
            </p>
            <p>$
                {
                    listing.offer ? listing.discountPrice.toLocaleString('en-US'): listing.regularPrice.toLocaleString('en-US')
                }
                {
                    listing.type === 'rent' && ' / month'
                }
            </p>
            <div className="flex gap-2">
                <div className="font-bold">
                    {listing.bedrooms > 1 ? `${listing.bedrooms} beds `: `${listing.bedrooms} bed`}
                </div>
                <div className="font-bold">
                    {listing.bathrooms > 1 ? `${listing.bathrooms} beds `: `${listing.bathrooms} bathroom`}
                </div>
            </div>
        </div>
    </div>
  )
}

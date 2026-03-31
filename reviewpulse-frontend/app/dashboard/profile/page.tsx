export default function ProfilePage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Restaurant Profile</h1>
        <p className="text-gray-500 text-sm">
          Manage your restaurant information and photos
        </p>
      </div>

      {/* Basic Info Card */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold text-lg">Basic Information</h2>

        <div>
          <label className="text-sm font-medium">Restaurant Name</label>
          <input
            type="text"
            defaultValue="The Modern Table"
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            defaultValue="Contemporary dining with seasonal ingredients and artistic presentation."
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Location</label>
          <input
            type="text"
            defaultValue="Downtown, New York"
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Business Hours</label>
          <input
            type="text"
            defaultValue="Mon-Fri: 11am-10pm, Sat-Sun: 10am-11pm"
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Photos Section */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold text-lg">Restaurant Photos</h2>
        <p className="text-sm text-gray-500">
          Add photos to showcase your restaurant
        </p>

        <div className="flex gap-4">

          {/* Existing Image */}
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
            className="w-40 h-24 object-cover rounded-lg"
          />

          <img
            src="https://images.unsplash.com/photo-1528605248644-14dd04022da1"
            className="w-40 h-24 object-cover rounded-lg"
          />

          {/* Upload Box */}
          <div className="w-40 h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500">
            Upload Photo
          </div>

        </div>

        <p className="text-xs text-gray-400">
          Recommended: High-quality photos showing your ambiance, food, and interior. Max 10 photos.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 border rounded-lg">
          Cancel
        </button>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </div>

    </div>
  )
}
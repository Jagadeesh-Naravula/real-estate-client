
const CreateListing = () => {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" id="name" placeholder='Name' className='border p-3 rounded-lg' minLength='10' maxLength='62' required/>
                <textarea type="text" id="description" placeholder='Description' className='border p-3 rounded-lg'required/>
                <input type="text" id="address" placeholder='Address' className='border p-3 rounded-lg' required/>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className='w-5'/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking" className='w-5'/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished" className='w-5'/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer" className='w-5'/>
                        <span>Offer</span>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id="bedrooms" min='1' max='10' required />
                            <p>Beds</p>
                        </div>    
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id="bathrooms" min='1' max='10' required />
                            <p>Baths</p>
                        </div>    
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id="regularPrice" min='1' max='10' required />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>    
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id="discountPrice" min='1' max='10' required />
                            <div className='flex flex-col items-center'>
                                <p>Discounted price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>    
                    </div>  
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:
                <span className='font-normal text-gray-600 ml-2'>
                    The first image will be the cover (max6)
                </span>
                </p>
                <div className='flex gap-4'>
                    <input className='p-3 border border-gray-300 rounded w-full' type="file" id="images" accept='image/*' multiple/>
                    <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload</button>
                </div>
                <button className='p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'>
                    Create Listing
                </button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing
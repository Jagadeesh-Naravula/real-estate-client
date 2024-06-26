import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {app} from '../firebase.js';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signInFailure, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import ProgressBar from '../components/ProgressBar.jsx';

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state)=> state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  console.log(formData)

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot)=>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(progress)
      setImgPerc(Math.round(progress));
    },
    (error)=>{
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        setFormData({ ...formData, avatar: downloadURL})
      })
    })
  }

  const handleChange = (e) =>{
    setFormData({ ...formData, [e.target.id]: e.target.value});
    console.log(formData)
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess(false);
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      let response = await res.json();

      if(response.success == false){
        dispatch(updateUserFailure(response.message))
        return;
      }

      dispatch(updateUserSuccess(response))
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () =>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      })

      let response = await res.json();

      if(response.success == false){
        dispatch(deleteUserFailure(response.message))
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () =>{
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`api/auth/signout`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      })

      let response = await res.json();

      if(response.success == false){
        dispatch(signOutUserFailure(response.message))
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListings = async () =>{
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if(data.success === false){
        setShowListingsError(true);
        return
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  }
  
  const handleListingDelete = async (listingId) =>{
    try {
      const res = fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE'
      });
      const data = (await res).json();
      if(data.success === false){
        console.log(data.message)
        return;
      }

      setUserListings((prev) => prev.filter((listing)=> listing._id !== listingId));
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
     <h1 className='font-semibold my-7 text-center text-3xl'> Profile </h1>
     <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input onChange={(e)=> setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
      <img onClick={()=> fileRef.current.click()} className='rounded-full h-24 w-24 object-cover self-center mt-2' src={formData.avatar || currentUser.avatar} alt='User Image' />
      {/* <p className='text-sm self-center'>{fileUploadError? (<span className='text-red-700'>Error Image upload</span>) : (imgPerc > 0 && imgPerc < 100) ? (<span className='text-slate-700'>{`Uploading ${imgPerc}%`}</span>): imgPerc === 100 ? <span className='text-green-700'>Image Uploaded Successfully!</span> : "" }</p> */}
      <p className='text-sm self-center'>{fileUploadError? (<span className='text-red-700'>Error Image upload</span>) : (imgPerc > 0 && imgPerc < 100) ? (<span className='text-slate-700'><ProgressBar width={imgPerc} /></span>): imgPerc === 100 ? <span className='text-green-700'>Image Uploaded Successfully!</span> : "" }</p>
      <input type="text" placeholder='username' id='username' defaultValue={currentUser.username} className='border p-3 rounded-lg' onChange={handleChange}/>
      <input type="text" placeholder='email' id='email' defaultValue={currentUser.email} className='border p-3 rounded-lg' onChange={handleChange}/>
      <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange} />
      <button disabled={loading} className='uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>{loading? 'loading...' : 'update'}</button>
      <Link to={"/create-listing"} className='bg-green-700 text-white text-center rounded-lg p-3 uppercase hover:opacity-95'>Create Listing</Link>
     </form>
     <div className='flex justify-between mt-5'>
      <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete account</span>
      <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
     </div>
     <p className='text-red-700 mt-5'>{error? error : ""}</p>
     <p className='text-green-700'>{updateSuccess ? 'Profile Updated Successfully!': ""}</p>
     <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
     <p className='text-red-700 text-sm'>{ showListingsError ? 'Error showing listings' : ''}</p>
     {userListings && userListings.length > 0 && 
     <div className='flex flex-col gap-4'>
      <h1 className='text-center mt-7 font-semibold'> Your Listing</h1>
       {userListings.map((listing)=>(
        <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
          <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain'/>
          </Link>
          <Link to={`/listing/${listing._id}`} className='flex-1 text-slate-700 font-semibold hover:underline truncate'>
            <p>{listing.name}</p>
          </Link>
  
          <div className='flex flex-col items-center'>
            <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
            <Link to={`/update-listing/${listing._id}`}>
              <button className='text-green-700 uppercase'>Edit</button>
            </Link>
          </div>
        </div>
       ))}
     </div>}
    </div>
  )
}

export default Profile
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {app} from '../firebase.js';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signInFailure, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state)=> state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
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

  return (
    <div className='p-3 max-w-lg mx-auto'>
     <h1 className='font-semibold my-7 text-center text-3xl'> Profile </h1>
     <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input onChange={(e)=> setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
      <img onClick={()=> fileRef.current.click()} className='rounded-full h-24 w-24 object-cover self-center mt-2' src={formData.avatar || currentUser.avatar} alt='User Image' />
      <p className='text-sm self-center'>{fileUploadError? (<span className='text-red-700'>Error Image upload</span>) : (imgPerc > 0 && imgPerc < 100) ? (<span className='text-slate-700'>{`Uploading ${imgPerc}%`}</span>): imgPerc === 100 ? <span className='text-green-700'>Image Uploaded Successfully!</span> : "" }</p>
      <input type="text" placeholder='username' id='username' defaultValue={currentUser.username} className='border p-3 rounded-lg' onChange={handleChange}/>
      <input type="text" placeholder='email' id='email' defaultValue={currentUser.email} className='border p-3 rounded-lg' onChange={handleChange}/>
      <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange} />
      <button disabled={loading} className='uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>{loading? 'loading...' : 'update'}</button>
     </form>
     <div className='flex justify-between mt-5'>
      <span className='text-red-700 cursor-pointer' onClick={handleDeleteUser}>Delete account</span>
      <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
     </div>
     <p className='text-red-700 mt-5'>{error? error : ""}</p>
     <p className='text-green-700'>{updateSuccess ? 'Profile Updated Successfully!': ""}</p>
    </div>
  )
}

export default Profile
import { useState, useRef,  useEffect} from 'react'
import {useSelector} from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';

export default function Profile() {

  const fileRef =useRef(null);
  const {currentUser} = useSelector(state=> state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [error , setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const handelChange = (e)=>{
  }

  const handleSubmit = async (e)=>{
  }

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload =(file)=>{
     const storage =getStorage(app);
     const fileName = file.name + new Date().getDate()+ new Date().getTime();
     const storageRef = ref(storage, fileName);
     const uploadTask = uploadBytesResumable(storageRef, file);

     uploadTask.on('state_changed', (snapshot)=>{
        const progress =(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
     },
      (error)=>{
        setFileUploadError(true);
     },
      ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>
        setFormData({...formData, avatar:downloadURL})
      )
     });
  }
    


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input onChange={(e)=> setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=>fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center m-1' src={formData.avatar || currentUser.avatar} alt="profile" />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-green-600'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded</span>
          ) : (
            ''
          )}
        </p>

        <input type="text" placeholder='username' defaultValue={currentUser.username} className='border p-3 rounded-lg outline-none' id='username' onChange={handelChange}/>
        <input type="email" placeholder='email' defaultValue={currentUser.email} className='border p-3 rounded-lg outline-none' id='email' onChange={handelChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg outline-none' id='password' onChange={handelChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>

    </div>
  )
}

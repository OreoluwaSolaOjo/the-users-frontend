import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import profile from '../assets/profile.png'
import { API_BASE_URL } from '../utils/base_url';
import { z, ZodError } from 'zod';

const FileSchema = z.custom<File>(
  (val) => val instanceof File, 
  { message: "Expected a file" }
).refine(file => ['image/jpeg', 'image/png'].includes(file.type), {
  message: "Only JPEG or PNG images are allowed"
}).refine(file => file.size <= 5 * 1024 * 1024, {  // Assuming a maximum size of 5MB
  message: "File size should be less than or equal to 5MB"
});

interface AdminPageProps {

}
interface User {
    email: string;
    numOfProducts: number,
    numOfUsers: number,
    percentage: number,
    companyName: string,
    id: string,
    file: File,
    image: string,
    // ... other fields if there are any
}




const AdminPage: React.FC<AdminPageProps> = () => {
 

    const [usersData, setUsersData] = useState<User[]>([]);
    const [userA, setUserA] = useState<User | null>(null);
    const [userB, setUserB] = useState<User | null>(null);
    const [userCom, setUserCom] = useState<boolean>(false);
    const [authing, setAuthing] = useState<boolean>(false);
    const [fileNames, setFileNames] = useState<{ [userId: string]: string }>({});

    const [files, setFiles] = useState<{ [userId: string]: File }>({});

    const navigate = useNavigate();



    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }
    const handleCompare = () => {
      
        setUserCom(true)
    }
    const handleUserA = () => {
        const usersA = usersData.find(user => user.email === "drey01@getnada.com");
        if (usersA) {
            setUserA(usersA);
        } else {
            // Handle case where user is not found, if needed
        }
    }

    const handleUserB = () => {
        const usersB = usersData.find(user => user.email === "thompson@getnada.com");
        if (usersB) {
            setUserB(usersB);
        } else {
            // Handle case where user is not found, if needed
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, userId: string) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            // console.log('hi', selectedFile)
      
            setFiles(prevFiles => ({
                ...prevFiles,
                [userId]: selectedFile
            }));
                // Set the file name
        setFileNames(prevNames => ({
            ...prevNames,
            [userId]: selectedFile.name
        }));
        }
    }
    
    
   
  
    
    // const handleSubmit = async () => {
    //     setAuthing(true)
    //     try {

    //         for (const user of usersData) {
    //             const userFile = files[user.id];
    
    //             if (!userFile) {
    //                 console.error(`No file selected for user ${user.email}.`);
    //                 continue; // Skip this user and move to the next one
    //             }
    
    //             const formData = new FormData();
    //             formData.append("image", userFile);
    
    //             // Assuming you have an API endpoint for uploading a file for a user.
    //             const response = await fetch(`${API_BASE_URL}/edit-user/${user.id}`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Authorization': localStorage.getItem("userToken") || '',
    //                 },
    //                 body: formData
    //             });
    
    //             if (!response.ok) {
    //                 throw new Error(`Failed to upload image for user ${user.email}.`);
    //             }
    
    //             const data = await response.json();
    //             console.log("Data received:", data);
    //         }
    
    //         // Refresh the page after successful completion
    //         setAuthing(false)
    //         window.location.reload();
    
    //     } catch (error) {
    //         // console.error("An error occurred:", error.message);
           
    //         alert("An error occurred. Please try again.");
    //     }
    // }
    const handleSubmit = async () => {
        setAuthing(true);
        try {
            for (const user of usersData) {
                const userFile = files[user.id];
    
                if (!userFile) {
                    console.error(`No file selected for user ${user.email}.`);
                    continue; // Skip this user and move to the next one
                }
    
                // Validate the file using the Zod schema
                const fileValidation = FileSchema.safeParse(userFile);
                if (!fileValidation.success) {
                    alert(`Validation failed for user ${user.email}: ${fileValidation.error.message}`);
                    setAuthing(false);
                    return;
                }
    
                const formData = new FormData();
                formData.append("image", userFile);
    
                // const response = await axios.post(`/api/users/edit-user/${user.id}`, formData, {
                //     withCredentials: true,
                //     headers: {
                //         'Authorization': localStorage.getItem("userToken") || ''
                //     }
                // });
                // const response = await fetch(`${API_BASE_URL}/edit-user/${user.id}`, {
                    const response = await fetch(`/api/users/edit-user/${user.id}`, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': localStorage.getItem("userToken") || '',
                                    },
                                    body: formData
                                });
            }
    
            alert("User Profile Picture(s) uploaded successfully");
            setAuthing(false);
            window.location.reload();
    
        } catch (error) {
            setAuthing(false);
            alert("An error occurred. Please try again.");
        }
    }
    
    useEffect(() => {
        console.log("got here 1")
        const _userToken: any = localStorage.getItem("userToken");
        console.log("_userToken:", _userToken);

        console.log("got here 2")
        // const userToken = JSON.parse(_userToken)
        console.log("userT", _userToken)

        const getUsers = async () => {

            // const response = await fetch(`${API_BASE_URL}/retrieve-non-admin-users`, {
                const response = await fetch('/api/users/edit-user/retrieve-non-admin-users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': _userToken
                },

            });
            const data = await response.json();
            console.log("newdata", data)
            setUsersData(data.data)
        }
        getUsers();
    }, [])
    return (
        <div className='parent-div'>
            <div>
                <div>
                    <img className='img-profile' src={profile} alt="" />
                    <h1>Hi Admin</h1>
                </div>

                {userA && <div className='user-div'>
                    <div><h4>USER A:</h4></div>
                    <div>
                        <p>Email</p>
                        <p>
                            {userA.email}
                        </p>

                    </div>
                    <div>
                        <p>Company Name</p>
                        <p>
                            {userA.companyName}
                        </p>

                    </div>
                    <div>
                        <p>Number of Products</p>
                        <p>
                            {userA.numOfProducts}
                        </p>

                    </div>
                    <div>
                        <p>Number Of Users</p>
                        <p>
                            {userA.numOfUsers}
                        </p>
                    </div>
                    <div>
                        <p>Percentage</p>
                        <p>
                            {userA.percentage}
                        </p>

                    </div>

                </div>}
                {userB && <div className='user-div'> 
                <div><h4>USER B:</h4></div>
                 <div>
                    <p className='heading'>Email</p>
                    <p>
                        {userB.email}
                    </p>

                </div>
                    <div>
                        <p className='heading'> Company Name</p>
                        <p>
                            {userB.companyName}
                        </p>

                    </div>
                    <div>
                        <p className='heading'>Number of Products</p>
                        <p>
                            {userB.numOfProducts}
                        </p>

                    </div>
                    <div>
                        <p className='heading'>Number Of Users</p>
                        <p>
                            {userB.numOfUsers}
                        </p>
                    </div>
                    <div>
                        <p className='heading'>Percentage</p>
                        <p>
                            {userB.percentage}
                        </p>

                    </div></div>}
                <div>
                    {(userCom && usersData) && usersData.map((users) => {
                        return (
                            <div className='container-div' key={users.id}>
                                <div className='image-file'>
                                    <div>
                                        <img className='img-cls' src={`http://localhost:3002/${users.image}`} alt="" />
                                    </div>
                                    <div>
                                        <label className='labelimage' htmlFor={`file-upload-${users.id}`}>Upload Image</label>
                                        <input hidden
                                            type="file"
                                            // id='file-upload'
                                            id={`file-upload-${users.id}`}
                                            // onChange={(e) => {
                                            //     if (e.target.files && e.target.files.length > 0) {
                                            //         setSelectedFile(e.target.files[0]);
                                            //     }
                                            // }}
                                            onChange={(e) => handleFileChange(e, users.id)}
                                        />
                                        {fileNames[users.id] && <span className='span-file-name'>{fileNames[users.id]}</span>}
                                        

                                    </div>
                                </div>

                                <div>
                                    <p className='heading'>Email</p>
                                    <p>
                                        {users.email}
                                    </p>

                                </div>
                                <div>
                                    <p className='heading'>Company Name</p>
                                    <p>
                                        {users.companyName}
                                    </p>

                                </div>
                                <div>
                                    <p className='heading'>Number of Products</p>
                                    <p>
                                        {users.numOfProducts}
                                    </p>

                                </div>
                                <div>
                                    <p className='heading'>Number Of Users</p>
                                    <p>
                                        {users.numOfUsers}
                                    </p>
                                </div>
                                <div>
                                    <p className='heading'>Percentage</p>
                                    <p>
                                        {users.percentage}
                                    </p>

                                </div>





                            </div>
                        )
                    })}
                </div>
                <div className='button-div'>
                    <button onClick={handleUserA}>Retieve A</button>
                    <button onClick={handleUserB}>Retrieve B</button>
                    <button onClick={handleCompare}>Compare Fields</button>
                    <button onClick={handleSubmit}>{authing ? 'Uploading Image(s)' : 'Upload for Users'}</button>

                    <button onClick={handleLogout}>Logout</button>
                </div>

            </div>

        </div>
    );
}

export default AdminPage;

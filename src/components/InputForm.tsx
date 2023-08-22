import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InputForm.css';
import { API_BASE_URL } from '../utils/base_url';
import { z, ZodError } from 'zod';

const submitSchema = z.object({
    companyName: z.union([z.string(), z.number()]),
    numOfUsers: z.number(),
    numOfProducts: z.number(),
    percentage: z.number()
});



interface FormData {
    companyName: string;
    numOfUsers: number;
    numOfProducts: number;
    percentage: number;
}

interface InputFormProps {
    onFormSubmit: (data: FormData) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onFormSubmit }) => {
    const [companyName, setCompanyName] = useState<string | ''>('');
    const [numOfUsers, setNumOfUsers] = useState<number | ''>('');
    const [numOfProducts, setNumOfProducts] = useState<number | ''>('');
    const [percentage, setPercentage] = useState(0);
    const [authing, setAuthing] = useState(false);
    const navigate = useNavigate();

    const userToken: any = localStorage.getItem("userToken");
    // const userToken = JSON.parse(_userToken);
    const userEmail: any = localStorage.getItem("email");
    useEffect(() => {
        if (numOfUsers !== '' && numOfProducts !== '' && Number(numOfProducts) + Number(numOfUsers) !== 0) {
            const calculatedPercentage = (Number(numOfUsers) / (Number(numOfUsers) + Number(numOfProducts))) * 100;
            setPercentage(calculatedPercentage);
        } else {
            setPercentage(0);
        }
    }, [numOfUsers, numOfProducts]);

    // const handleSubmit = async () => {
    //     setAuthing(true)
    //     const _userEmail: any = localStorage.getItem("email");
    //     try {
    //         const payload = {
    //             companyName: companyName.toString(),
    //             numOfUsers: Number(numOfUsers),
    //             numOfProducts: Number(numOfProducts),
    //             percentage: parseFloat(percentage.toFixed(2)),
    //             email: _userEmail
    //         };
    //         console.log("pa", payload.companyName)
    //         console.log("pa", JSON.stringify(payload))
    //         console.log("here i am", userToken)

    //         const response = await fetch(`${API_BASE_URL}/submit-data`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': userToken
    //             },
    //             body: JSON.stringify(payload)
    //         });

    //         const data = await response.json();
    //         console.log("here is data", data)
    //         if (data.success) {
    //             alert('Record submitted successfully');
    //         } else {
    //             alert('Error submitting data');
    //         }
    //         setAuthing(false)
    //     } catch (error: any) {
    //         alert('Error logging in: ' + error.message);
    //     }
    // }
    const handleSubmit = async () => {
        setAuthing(true);
        const _userEmail: any = localStorage.getItem("email");
        const payload = {
            companyName: companyName.toString(),
            numOfUsers: Number(numOfUsers),
            numOfProducts: Number(numOfProducts),
            percentage: parseFloat(percentage.toFixed(2)),
            email: _userEmail,
        };
    
        try {
            // Validate the payload with the Zod schema
            submitSchema.parse(payload);
            
            // ... rest of your code
            
        } catch (error: any) {
            // If the payload is invalid, alert the user
            if (error instanceof z.ZodError) {
                alert(`Validation Error: ${error.errors[0].message}`);
                setAuthing(false);
                return;
            }
    
            setAuthing(false);
            alert('Error logging in: ' + error.message);
        }
             try {
            const payload = {
                companyName: companyName.toString(),
                numOfUsers: Number(numOfUsers),
                numOfProducts: Number(numOfProducts),
                percentage: parseFloat(percentage.toFixed(2)),
                email: _userEmail
            };
            console.log("pa", payload.companyName)
            console.log("pa", JSON.stringify(payload))
            console.log("here i am", userToken)

            // const response = await fetch(`${API_BASE_URL}/submit-data`, {
                const response = await fetch('/api/users/submit-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userToken
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log("here is data", data)
            if (data.success) {
                alert('Record submitted successfully');
            } else {
                alert('Error submitting data');
            }
            setAuthing(false)
        } catch (error: any) {
            alert('Error logging in: ' + error.message);
        }
    }
    
    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }
    return (
        <div className='user-input-container'>
            <div className='user-logout'>
                {/* <p>USER A</p> */}
                <p className='ptag'>Logged in as: <span className='span' >{userEmail}</span></p>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div>
                <p className='heading'>Company Name</p>
                <input
                    className='user-input'
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
            </div>
            <div>
                <p className='heading'>Number of users</p>
                <input
                    className='user-input'
                    type="number"
                    placeholder="Number of Users"
                    value={numOfUsers}
                    onChange={(e) => setNumOfUsers(Number(e.target.value))}
                />
            </div>
            <div>
                <p className='heading'>Number of Products</p>
                <input
                    className='user-input'
                    type="number"
                    placeholder="Number of Products"
                    value={numOfProducts}
                    onChange={(e) => setNumOfProducts(Number(e.target.value))}
                />
            </div>
            <div>
                <p className='heading'>Percentage</p>
                <input
                    className='user-input'
                    type="text"
                    value={`${percentage.toFixed(2)}%`}
                    readOnly
                />
            </div>

            <button className='submit-btn' onClick={handleSubmit}>{authing ? 'Submitting' : 'Submit'}</button>

        </div>
    );
}

export default InputForm;

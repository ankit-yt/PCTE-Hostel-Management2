import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function User_sec({ isDarkTheme }) {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Hook to access navigation

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://pcte-hostel-management-backend.onrender.com/api/users');
                setUsers(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`https://pcte-hostel-management-backend.onrender.com/api/users/${userId}`);
                setUsers(prev => prev.filter(user => user._id !== userId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleRegisterNewUser = () => {
        navigate('/register'); // Navigate to the Register component
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter(user => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            user.username.toLowerCase().includes(lowerCaseQuery) ||
            (user.rollNumber && user.rollNumber.toLowerCase().includes(lowerCaseQuery))
        );
    });

    const darkThemeStyles = {
        container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white",
        card: "bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-2xl",
        input: "max-w-md w-full p-4 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
        button: "bg-green-600 text-white h-14 p-4 rounded-md hover:bg-green-700 transition-all duration-300",
    };

    const lightThemeStyles = {
        container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900",
        card: "bg-gradient-to-r from-white to-gray-100 rounded-3xl shadow-2xl",
        input: "max-w-md w-full p-4 rounded-lg bg-gray-200 text-gray-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
        button: "bg-green-500 text-white p-4 rounded-md hover:bg-green-700 transition-all duration-300",
    };

    const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

    return (
        <div className={`w-full h-full p-6 ${theme.container} overflow-y-auto`}>
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by username or roll number"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={`${theme.input}`}
                />
                {/* Button to navigate to the Register component */}
                <button onClick={handleRegisterNewUser} className={`${theme.button} md:mt-0 `}>
                    Register New User
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="overflow-x-auto">
                <table className={`min-w-full ${theme.card} text-black shadow-md overflow-hidden rounded-lg`}>
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 border-b">Username</th>
                            <th className="py-2 px-4 border-b">Roll Number</th>
                            <th className="py-2 px-4 border-b">Hostel</th>
                            <th className="py-2 px-4 border-b">Room Number</th>
                            <th className="py-2 px-4 border-b">Role</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className={`${isDarkTheme ? "text-gray-100" : "text-black"} text-sm`}>
                                <td className="py-2 px-4 text-center">{user.username}</td>
                                <td className="py-2 px-4 text-center">{user.rollNumber || 'N/A'}</td>
                                <td className="py-2 px-4 text-center">{user.hostel || 'N/A'}</td>
                                <td className="py-2 px-4 text-center">{user.roomNumber || 'N/A'}</td>
                                <td className="py-2 px-4 text-center">{user.role}</td>
                                <td className="py-2 px-4 text-center">
                                    <button className="text-blue-500 hover:underline">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(user._id)} className="text-red-500 ml-2 hover:underline">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default User_sec;

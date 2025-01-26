import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "motion/react"
function Hostel_rooms({isDarkTheme}) {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newRoom, setNewRoom] = useState({ roomNumber: '', capacity: '', hostel: '' });
    const [editRoom, setEditRoom] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [newStudent, setNewStudent] = useState({ rollNumber: '', name: '' });

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/rooms');
                setRooms(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleNewRoomChange = (e) => {
        const { name, value } = e.target;
        setNewRoom({
            ...newRoom,
            [name]: value,
        });
    };

    const addNewRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/rooms', newRoom);
            setRooms([...rooms, response.data]);
            setNewRoom({ roomNumber: '', capacity: '', hostel: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const editExistingRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/rooms/${editRoom._id}`, {
                roomNumber: editRoom.roomNumber,
                capacity: editRoom.capacity,
                hostel: editRoom.hostel,
            });
            setRooms(rooms.map(room => (room._id === editRoom._id ? response.data : room)));
            setEditRoom(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteRoom = async (roomId) => {
        try {
            await axios.delete(`http://localhost:5000/api/rooms/${roomId}`);
            setRooms(rooms.filter(room => room._id !== roomId));
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchStudents = async (roomId) => {
        // If the clicked room is already selected, toggle it closed
        if (selectedRoom === roomId) {
            setSelectedRoom(null);
            setStudents([]);
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:5000/api/rooms/${roomId}/students`);
            setStudents(response.data);
            setSelectedRoom(roomId);
        } catch (err) {
            setError(err.message);
        }
    };
    

    const deleteStudent = async (roomId, studentId) => {
        try {
            await axios.delete(`http://localhost:5000/api/rooms/${roomId}/students/${studentId}`);
            setStudents(students.filter(student => student._id !== studentId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleNewStudentChange = (e) => {
        const { name, value } = e.target;
        setNewStudent({
            ...newStudent,
            [name]: value,
        });
    };

    const addNewStudent = async (e) => {
        e.preventDefault();
        if (selectedRoom) {
            try {
                const response = await axios.post(`http://localhost:5000/api/rooms/${selectedRoom}/students`, newStudent);
                setStudents([...students, response.data.students[response.data.students.length - 1]]);
                setNewStudent({ rollNumber: '', name: '' });
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const darkThemeStyles ={
        container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white ",
        card:"bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[102%] hover:shadow-3xl",
        input: "max-w-md w-1/4 p-3 rounded-lg  bg-gray-700 text-gray-900 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
        input2: "max-w-md w-full p-3 rounded-lg  bg-gray-700 text-gray-900 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
        button: "bg-green-600  text-white p-4  h-[3rem] flex justify-center items-center rounded-md w-38 hover:bg-green-700 transition-all duration-300",
          }
        
          const lightThemeStyles = {
            container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900",
            card:"bg-gradient-to-r from-white to-gray-100 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[102%] hover:shadow-3xl",
            input: "max-w-md w-1/4 p-3 rounded-lg bg-gray-200 text-gray-900  focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
            input2: "max-w-md w-full p-3 rounded-lg bg-gray-200 text-gray-900  focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
        button: "bg-green-500 text-white p-4 h-[3rem] flex justify-center items-center rounded-md w-38 hover:bg-green-700 transition-all duration-300",
        
          }
        
          const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

    return (
        <div className={`p-6 h-full overflow-auto ${theme.container}  `} >
               <form onSubmit={addNewRoom} className={`mb-4 ${theme.card} p-4 rounded shadow-md`}>
                <h2 className={`text-base ${isDarkTheme ? "text-gray-100 " : "text-black"} font-semibold mb-2`}>Add New Room</h2>
                <div className="flex space-x-2 mb-2">
                    <input
                        type="text"
                        name="roomNumber"
                        placeholder="Room Number"
                        value={newRoom.roomNumber}
                        onChange={handleNewRoomChange}
                        required
                        className={`${theme.input}`}
                    />
                    <input
                        type="number"
                        name="capacity"
                        placeholder="Capacity"
                        value={newRoom.capacity}
                        onChange={handleNewRoomChange}
                        required
                        className={`${theme.input}`}
                    />
                    <input
                        type="text"
                        name="hostel"
                        placeholder="Hostel Name"
                        value={newRoom.hostel}
                        onChange={handleNewRoomChange}
                        required
                        className={`${theme.input}`}
                    />
                    <button type="submit" className={`${theme.button}`}>Add Room</button>
                </div>
            </form>

            {/* Edit Room Form */}
            {editRoom && (
                <form onSubmit={editExistingRoom} className={`mb-4 ${theme.card} p-4 rounded shadow-md`}>
                    <h2 className={`text-base ${isDarkTheme ? "text-gray-100 " : "text-black"} font-semibold mb-2`}>Edit Room</h2>
                    <div className="flex space-x-2 mb-2">
                        <input
                            type="text"
                            name="roomNumber"
                            placeholder="Room Number"
                            value={editRoom.roomNumber}
                            onChange={(e) => setEditRoom({ ...editRoom, roomNumber: e.target.value })}
                            required
                            className={`${theme.input}`}
                        />
                        <input
                            type="number"
                            name="capacity"
                            placeholder="Capacity"
                            value={editRoom.capacity}
                            onChange={(e) => setEditRoom({ ...editRoom, capacity: e.target.value })}
                            required
                            className={`${theme.input}`}
                        />
                        <input
                            type="text"
                            name="hostel"
                            placeholder="Hostel Name"
                            value={editRoom.hostel}
                            onChange={(e) => setEditRoom({ ...editRoom, hostel: e.target.value })}
                            required
                            className={`${theme.input}`}
                        />
                        <button type="submit" className={`${theme.button} `}>Save Changes</button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-gray-500 text-center">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="">
                    <table className={`min-w-full overflow-hidden  ${theme.card} shadow-md rounded-lg`}>
                        <thead>
                            <tr className="bg-gray-200 text-black">
                                <th className="py-2 px-4 border-b">Room Number</th>
                                <th className="py-2 px-4 border-b">Hostel</th>
                                <th className="py-2 px-4 border-b">Capacity</th>
                                <th className="py-2 px-4 border-b">Occupied</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <motion.tr key={room._id} 
                                whileHover={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight background color change on hover
                                    transition: { duration: 0.3 } // Smooth transition with a duration of 0.3s
                                  }}
                                  
                                  style={{ transition: 'background-color 0.1s ease' }} 
                                >
                                    <td className="py-2 px-4  text-center">{room.roomNumber}</td>
                                    <td className="py-2 px-4  text-center">{room.hostel}</td>
                                    <td className="py-2 px-4  text-center">{room.capacity}</td>
                                    <td className="py-2 px-4  text-center">{room.occupied}</td>
                                    <td className="py-2  gap-4 justify-center flex space-x-2">
                                        <button onClick={() => fetchStudents(room._id )} className="text-blue-500 hover:underline">
                                            View Students
                                        </button>
                                        <button onClick={() => setEditRoom(room)} className="text-yellow-500 hover:underline">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteRoom(room._id)} className="text-red-500 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

{selectedRoom && (
  <div className={`mt-4 ${theme.card}  p-6 rounded-xl shadow-lg`}>
    <h2 className="text-2xl font-bold mb-4 text-center tracking-wider">
      Students in Room: <span className="text-blue-500">{rooms.find(room => room._id === selectedRoom)?.roomNumber}</span>
    </h2>

    {/* Add New Student Form */}
    <form onSubmit={addNewStudent} className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Roll Number */}
        <div>
          <label htmlFor="rollNumber" className="block text-sm font-semibold mb-1">
            Roll Number
          </label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            placeholder="Enter Roll Number"
            value={newStudent.rollNumber}
            onChange={handleNewStudentChange}
            required
            className={`${theme.input2}`}
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-1">
            Student Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter Student Name"
            value={newStudent.name}
            onChange={handleNewStudentChange}
            required
            className={`${theme.input2}`}
          />
        </div>

        {/* Add Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className={`${theme.button}`}
          >
            Add Student
          </button>
        </div>
      </div>
    </form>

    {/* Students List */}
    <div className={`${theme.card} p-5`}>
      <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-2">
        Students List
      </h3>
      {students.length > 0 ? (
        <ul className="">
          {students.map((student) => (
            <li key={student._id} className="flex justify-between py-2 items-center">
              <div className="flex flex-col">
                <span className="font-semibold">{student.name}</span>
                <span className="text-sm text-gray-400">Roll No: {student.rollNumber}</span>
              </div>
              <button
                onClick={() => deleteStudent(selectedRoom, student._id)}
                className="text-red-500 font-medium hover:underline hover:text-red-400 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center">No students in this room.</p>
      )}
    </div>
  </div>
)}

        </div>
    );
}

export default Hostel_rooms;
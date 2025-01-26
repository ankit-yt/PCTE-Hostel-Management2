// Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedRole = queryParams.get('role');
    setRole(selectedRole || ''); // Set the role from URL params
  }, [location]);

  const formFields = [
    { field: 'username', type: 'text' },
    { field: 'password', type: 'password' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username: credentials.username,
        password: credentials.password,
        role // Include the role in the login request
      });

      // Store the token and studentId in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('studentId', response.data.studentId); // Save the student ID

      const userRole = JSON.parse(atob(response.data.token.split('.')[1])).role;

      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'warden':
          navigate('/warden/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="w-full h-screen flex bg-[#EBEFFF] overflow-hidden">
      <div className='absolute w-full h-full'>
        <img className='w-full scale-x-[-1] h-full object-cover' src="https://scontent.fixc2-1.fna.fbcdn.net/v/t1.6435-9/39535853_1929872993736078_4675401329982570496_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=L6j2trELwtoQ7kNvgE5MS9o&_nc_zt=23&_nc_ht=scontent.fixc2-1.fna&_nc_gid=AAUBOC55NaVmP-Sy57rrABT&oh=00_AYAlpP9sfyToLg7NsD1-sDPT9nPErhV2M8Dxx6Mov9Sp6w&oe=67B1EE11" alt="" />
      </div>
      <div className="left w-2/3 flex flex-col justify-center bg-white/20 backdrop-blur-md border border-white/30 shadow-lg relative items-center">
        <div className="form w-2/5 min-h-[20rem]">
          <h2 className="w-full text-center font-semibold">
            Welcome Back, {role ? `${role.charAt(0).toUpperCase()}${role.slice(1)}` : 'User '}!
          </h2>
          {error && <p className="text-center text-red-500">{error}</p>}
          <form className="my-2" onSubmit={handleSubmit}>
            {formFields.map((item, index) => (
              <div key={index} className="flex flex-col">
                <label className="my-1.5">{item.field.charAt(0).toUpperCase() + item.field.slice(1)}:</label>
                <input
                  required
                  className="border-[1px] outline-none border-[#656ED3] bg-[#ffffff] px-2 py-1 my-1 text-gray-800 rounded-md"
                  type={item.type}
                  name={item.field}
                  value={credentials[item.field]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
            <button className="w-full bg-[#656ED3] rounded-md py-1 text-white my-8" type="submit">
              Login
            </button>
            <h5 className="w-full text-center text-sm">
              Do not have an account? <a className="font-semibold" href="">Register</a>
            </h5>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
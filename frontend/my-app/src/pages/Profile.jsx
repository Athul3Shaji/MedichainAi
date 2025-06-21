import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';  
import api from '../services/api';
import { setUser, updateProfileImage } from '../store/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const id = localStorage.getItem('user_id');
      if (!id) {
        throw new Error('User ID not found');
      }

      const { data } = await api.get(`/users/${id}`);
      if (data) {
        dispatch(setUser(data));
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  ;

  const handleUpdateProfile = async () => {
    try {
      setUpdateLoading(true);
  
      const updateFormData = new FormData();
      updateFormData.append('username', formData.username);
      updateFormData.append('email', formData.email);
  
      if (selectedFile) {
        updateFormData.append('profileImage', selectedFile);
      }
  
      const { data } = await api.put(`/users/${user._id}`, updateFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      dispatch(setUser(data));
      setIsEditing(false);
      setSelectedFile(null); // Reset after upload
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdateLoading(false);
    }
  };
  

  if (loading) {
    return (
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          <Navbar />
          <div className="flex justify-center items-center h-[calc(100vh-100px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Navbar />
        <section className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto mt-10">
          <div className="flex flex-col items-center relative">
            {/* Profile Image */}
            <div className="relative mb-6 group cursor-pointer">
              <img
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : `http://localhost:5000/${user.profileImage}`
                }
                alt="Profile"
                className="w-32 h-32 rounded-full ring-4 ring-blue-500 shadow-lg object-cover"
                onClick={() => setIsModalOpen(true)}
              />
              {/* Camera Icon Overlay */}
              <label
                htmlFor="imageUpload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer group-hover:opacity-100 opacity-0 transition-opacity duration-200"
                title="Change picture"
              >
                📷
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name Field */}
            <div className="w-full mb-4">
              <label className="text-gray-500 text-sm mb-1 block">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="w-full mb-4">
              <label className="text-gray-500 text-sm mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                disabled={!isEditing}
              />
            </div>

            {/* Edit/Save Buttons */}
            <div className="w-full flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        username: user.username,
                        email: user.email
                      });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    disabled={updateLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300"
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Modal for full image */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white p-4 rounded-xl shadow-xl max-w-md relative animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <img
                 src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : `http://localhost:5000/${user.profileImage}`
                }
                alt="Profile Large"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;

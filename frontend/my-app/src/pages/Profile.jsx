import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const [name, setName] = useState('Athul Shaji');
  const email = 'athul@example.com';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/150?img=12');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

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
                src={profileImage}
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
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Email Field */}
            <div className="w-full mb-6">
              <label className="text-gray-500 text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300"
            >
              Save Profile
            </button>
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
                src={profileImage}
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

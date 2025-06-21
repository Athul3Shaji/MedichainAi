import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import api from '../services/api';

const UploadClaim = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phoneNumber: '',
    email: '',
    place: '',
    hospital: '',
    hospitalLocation: '',
    file: null
  });

  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
          setFormData((prev) => ({ ...prev, hospitalLocation: coords }));
        },
        (err) => {
          console.warn('Geolocation not available or denied:', err.message);
        }
      );
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, phoneNumber: phone }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) form.append(key, value);
      });

      const response = await api.post('/claims', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200 || response.status === 201) {
        alert('Claim submitted successfully!');
        setFormData({
          name: '',
          description: '',
          phoneNumber: '',
          email: '',
          place: '',
          hospital: '',
          hospitalLocation: '',
          file: null
        });
        setPreview(null);
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert(error.response?.data?.message || 'Submission failed! Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
        <Navbar />
        <div className="max-w-4xl mx-auto mt-8 bg-white p-6 sm:p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Claim</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full border border-black rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <PhoneInput
                  country={'in'}
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  inputClass="!w-full !border !border-black !rounded-md !py-2 !px-3"
                  buttonClass="!border-black"
                  enableSearch
                  inputProps={{ required: true, name: 'phoneNumber' }}
                  containerClass="!w-full"
                  specialLabel=""
                  disableCountryCode={false}
                  disableDropdown={false}
                  countryCodeEditable={false}
                  autoFormat={true}
                  preserveOrder={['onlyCountries', 'preferredCountries']}
                  separateDialCode={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-black rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Place</label>
                  <input
                    type="text"
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-black rounded-md px-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* NEW: Hospital Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                  <input
                    type="text"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleInputChange}
                    placeholder="Enter hospital name"
                    className="mt-1 w-full border border-black rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Hospital Location</label>
                  <input
                    type="text"
                    name="hospitalLocation"
                    value={formData.hospitalLocation}
                    onChange={handleInputChange}
                    placeholder="Auto-detected or enter manually"
                    className="mt-1 w-full border border-black rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 w-full border border-black rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Document (PDF or Image)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="mt-1 w-full text-sm file:py-2 file:px-4 file:border file:border-black file:rounded-md file:bg-white file:text-black hover:file:bg-gray-100"
                  required
                />
              </div>

              {preview && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="text-blue-600 hover:underline"
                  >
                    View File in Modal
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-[90vw] h-[90vh] relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl z-10"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Document Preview</h2>
              <div className="h-[calc(90vh-8rem)] overflow-auto">
                {formData.file?.type === 'application/pdf' ? (
                  <iframe src={preview} className="w-full h-full rounded-md" title="PDF Preview" />
                ) : (
                  <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-md" />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UploadClaim;

"use client"
// components/UserForm.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  image_url: string;
  video_url: string;
}

const UserForm: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    image_url: '',
    video_url: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = {
      name: form.name,
      email: form.email,
      image_url: form.image_url,
      video_url: form.video_url,
    };

    try {
      const response = await fetch('https://crud-zeta-seven.vercel.app/api/users ', {
      // const response = await fetch('http://localhost:5000/api/users', {

        method: 'POST',
        
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Clear the form
        setForm({
          name: '',
          email: '',
          image_url: '',
          video_url: '',
        });
        // Show success toast
        toast.success('User created successfully!');
      } else {
        // Show error toast
        const responseData = await response.json();
        toast.error(responseData.error || 'Error creating user.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error creating user.');
    }
  };

  return (
    <div>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center">User Form</h2>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          name="video_url"
          value={form.video_url}
          onChange={handleChange}
          placeholder="Video URL"
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserForm;

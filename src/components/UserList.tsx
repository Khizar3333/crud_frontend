// components/UsersList.tsx
"use client";

import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  image_url: string;
  video_url: string;
  created_at?: string;
  updated_at?: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({
    name: '',
    email: '',
    image_url: '',
    video_url: '',
  });

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://crud-lxhzm300p-khizar3333s-projects.vercel.app/api/getusers');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to fetch users.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`https://crud-lxhzm300p-khizar3333s-projects.vercel.app/api/delusers?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('User deleted successfully!');
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error deleting user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user.');
    }
  };

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      image_url: user.image_url,
      video_url: user.video_url,
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({
      name: '',
      email: '',
      image_url: '',
      video_url: '',
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUserId) return;

    try {
      const response = await fetch(`https://crud-lxhzm300p-khizar3333s-projects.vercel.app/api/updateusers?id=${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success('User updated successfully!');
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === editingUserId ? { ...user, ...responseData.data } : user
          )
        );
        cancelEditing();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error updating user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4 text-center">Users List</h2>
      {users.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="p-4 border rounded-lg shadow-md bg-gray-100">
              {editingUserId === user.id ? (
                // Edit Form
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name || ''}
                      onChange={handleEditChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email || ''}
                      onChange={handleEditChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Image URL</label>
                    <input
                      type="text"
                      name="image_url"
                      value={editForm.image_url || ''}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Video URL</label>
                    <input
                      type="text"
                      name="video_url"
                      value={editForm.video_url || ''}
                      onChange={handleEditChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                // Display User Info
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    {user.image_url ? (
                      <img
                        src={user.image_url}
                        alt={user.name}
                        className="w-24 h-24 object-cover rounded-full mx-auto"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-gray-700">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-2/4">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-gray-700">{user.email}</p>
                    {user.video_url && (
                      <video
                        src={user.video_url}
                        controls
                        autoPlay
                        muted
                        className="mt-2 w-full max-w-sm"
                      />
                    )}
                  </div>
                  <div className="w-full md:w-1/4 flex flex-col space-y-2 mt-4 md:mt-0">
                    <button
                      onClick={() => startEditing(user)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;

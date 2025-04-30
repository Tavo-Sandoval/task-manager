'use client';
import { useState, useEffect } from 'react';
import { FaRegListAlt } from 'react-icons/fa';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { MdOutlineNoteAlt } from 'react-icons/md';

export default function Dashboard() {
  const [tasks, setTasks] = useState<{ id: number; title: string }[]>([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        } else {
          const errorData = await res.json();
          setFetchError(errorData.error || 'Failed to fetch tasks.');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setFetchError('An error occurred while fetching tasks.');
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newTask) {
      setError('Task title is required.');
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask }),
      });

      if (res.ok) {
        const task = await res.json();
        setTasks((prevTasks) => [...prevTasks, task]);
        setNewTask('');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to create task.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('An error occurred while creating the task.');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } else {
        const errorData = await res.json();
        console.error(errorData.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingTaskTitle) {
      setError('Task title is required.');
      return;
    }

    try {
      const res = await fetch(`/api/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTaskTitle }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        setEditingTaskId(null);
        setEditingTaskTitle('');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to update task.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('An error occurred while updating the task.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation Bar */}
      <nav className="bg-blue-600 text-white py-4 px-6 shadow-md flex flex-col items-center">
        <div className="flex items-center gap-2">
          <MdOutlineNoteAlt className="text-3xl" />
          <h1 className="text-2xl font-bold">TASK MANAGER</h1>
        </div>
      </nav>

      <div className="p-6 flex flex-col md:flex-row gap-6">
        {/* Add Task Section */}
        <div className="bg-white p-6 rounded shadow-md w-full md:w-1/4 text-black">
          <h2 className="text-lg font-semibold mb-4 bg-blue-100 text-blue-600 px-4 py-2 rounded">
            Add New Task
          </h2>
          <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter task title"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="px-4 py-2 border rounded w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
            >
              <AiOutlinePlusCircle className="text-xl" />
              Add Task
            </button>
          </form>
        </div>

        {/* Task List Section */}
        <div className="bg-white p-6 rounded shadow-md w-full text-black">
          <h2 className="text-lg font-semibold mb-4 bg-gray-100 text-gray-700 px-4 py-2 rounded">
            Your Tasks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col items-start gap-2 p-4 bg-gray-50 border border-gray-200 rounded shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-2">
                  <FaRegListAlt className="text-blue-600 text-2xl" />
                  {editingTaskId === task.id ? (
                    <form
                      onSubmit={handleUpdateTask}
                      className="flex items-center gap-2 w-full"
                    >
                      <input
                        type="text"
                        value={editingTaskTitle}
                        onChange={(e) => setEditingTaskTitle(e.target.value)}
                        className="px-2 py-1 border rounded w-full text-black"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTaskId(null);
                          setEditingTaskTitle('');
                        }}
                        className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <span className="text-lg font-medium">{task.title}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditingTaskTitle(task.title);
                    }}
                    className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

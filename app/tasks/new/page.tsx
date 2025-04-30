'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTask() {
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <form onSubmit={handleCreate}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
      <button type="submit">Add Task</button>
    </form>
  );
}

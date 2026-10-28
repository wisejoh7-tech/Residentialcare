import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Heart, Send, Plus, Calendar, User } from 'lucide-react';

export const FamilyPortal: React.FC = () => {
  const { familyUpdates, addFamilyUpdate, residents, currentUser } = useApp();

  const [message, setMessage] = useState('');
  const [residentId, setResidentId] = useState(residents[0]?.id || '');
  const [category, setCategory] = useState<'General' | 'Activity' | 'Health' | 'Meal'>('General');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetResident = residents.find((r) => r.id === residentId);
    if (!targetResident || !message.trim()) return;

    addFamilyUpdate({
      residentId: targetResident.id,
      residentName: targetResident.name,
      authorName: `${currentUser.name} (${currentUser.role})`,
      message: message.trim(),
      category,
    });

    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-pink-600" />
            <span>Family Portal & Engagement Feed</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Share daily moments, photos, and care updates with residents' loved ones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Post New Update Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 h-fit">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-purple-700" />
            <span>Post Update for Family</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Resident</label>
              <select
                value={residentId}
                onChange={(e) => setResidentId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                {residents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.roomNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as 'General' | 'Activity' | 'Health' | 'Meal')
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="General">General News</option>
                <option value="Activity">Social & Activity</option>
                <option value="Health">Health Update</option>
                <option value="Meal">Meals & Dining</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Message for Family</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share a cheerful update or moment from today..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Publish Family Update</span>
            </button>
          </form>
        </div>

        {/* Right Column: Feed Stream */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-purple-700" />
            <span>Recent Family Activity Feed</span>
          </h2>

          <div className="space-y-4">
            {familyUpdates.map((feed) => (
              <div
                key={feed.id}
                className="p-4 bg-purple-50/40 rounded-xl border border-purple-100 text-xs space-y-2"
              >
                <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-purple-950 text-sm">{feed.residentName}</span>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold">
                    {feed.category}
                  </span>
                </div>

                <p className="text-slate-800 leading-relaxed font-medium">{feed.message}</p>

                <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400">
                  <span>Author: {feed.authorName}</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{feed.timestamp}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

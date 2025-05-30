"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '@/components/providers/AuthProvider'; // Corrected path

interface UserProfile {
  full_name: string | null;
  selected_city: string | null;
}

interface EventCategory {
  id: number;
  name: string;
}

export default function ProfilePage() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [allCategories, setAllCategories] = useState<EventCategory[]>([]);
  const [userInterests, setUserInterests] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Combined loading state for all initial fetches
  const [isUpdating, setIsUpdating] = useState(false); // Separate state for update operation
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !session) {
      router.push('/auth/login');
    }
  }, [session, authLoading, router]);

  useEffect(() => {
    if (user && session) { // Ensure user and session are available
      const fetchProfileAndCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('full_name, selected_city')
            .eq('user_id', user.id)
            .single();

          if (profileError) {
            // It's possible a profile doesn't exist yet if the trigger failed or was added later
            if (profileError.code === 'PGRST116') { // PGRST116: "Fetched result not found (bro)" - means no row found
              console.warn('User profile not found, user might need to complete it.');
              // Potentially set a state to indicate profile needs creation/completion
            } else {
              throw profileError;
            }
          }
          if (profileData) {
            setProfile(profileData);
            setFullName(profileData.full_name || '');
          }

          const { data: categoriesData, error: categoriesError } = await supabase
            .from('event_categories')
            .select('id, name');
          if (categoriesError) throw categoriesError;
          setAllCategories(categoriesData || []);

          const { data: interestsData, error: interestsError } = await supabase
            .from('user_interests')
            .select('category_id')
            .eq('user_id', user.id);
          if (interestsError) throw interestsError;
          setUserInterests((interestsData || []).map(interest => interest.category_id));

        } catch (err: any) {
          console.error("Error fetching profile data:", err);
          setError(err.message || 'Failed to load profile data.');
        }
        setIsLoading(false);
      };
      fetchProfileAndCategories();
    }
  }, [user, session]); // Added session to dependency array

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSuccessMessage(null);
    setIsUpdating(true);

    try {
      const { error: profileUpdateError } = await supabase
        .from('user_profiles')
        .update({ full_name: fullName })
        .eq('user_id', user.id);
      if (profileUpdateError) throw profileUpdateError;

      // Efficiently update interests: delete all then re-insert selected ones.
      // This is simpler for MVP than diffing. For larger scale, diffing would be better.
      const { error: deleteError } = await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id);
      if (deleteError) throw deleteError;

      if (userInterests.length > 0) {
        const newInterests = userInterests.map(categoryId => ({
          user_id: user.id,
          category_id: categoryId,
        }));
        const { error: insertError } = await supabase
          .from('user_interests')
          .insert(newInterests);
        if (insertError) throw insertError;
      }
      
      setSuccessMessage("Profile updated successfully!");
      if(profile) setProfile({...profile, full_name: fullName}); // Update local state immediately

    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || 'Failed to update profile.');
    }
    setIsUpdating(false);
  };

  const handleInterestChange = (categoryId: number) => {
    setUserInterests(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  if (authLoading || isLoading || !session) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'white', backgroundColor: '#121212' }}>
            <p>Loading profile...</p>
        </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#1a1a1a', color: 'white' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2em' }}>Your Profile</h1>
      
      {error && <p style={{ color: '#ff4d4d', marginBottom: '15px', textAlign: 'center', padding: '10px', backgroundColor: '#402020', borderRadius: '4px' }}>Error: {error}</p>}
      {successMessage && <p style={{ color: '#4dff4d', marginBottom: '15px', textAlign: 'center', padding: '10px', backgroundColor: '#204020', borderRadius: '4px' }}>{successMessage}</p>}
      
      <form onSubmit={handleUpdateProfile}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9em', color: '#aaa' }}>Email</label>
          <input
            type="email"
            id="email"
            value={user?.email || ''}
            disabled
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#ccc', cursor: 'not-allowed' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="fullName" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9em', color: '#aaa' }}>Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            placeholder="Enter your full name"
            onChange={(e) => setFullName(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9em', color: '#aaa' }}>Selected City (MVP)</label>
          <input
            type="text"
            value={profile?.selected_city || (isLoading ? 'Loading...' : 'Not set')}
            disabled
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#ccc', cursor: 'not-allowed' }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '15px', fontSize: '1.1em', color: '#ccc' }}>Your Interests</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
            {allCategories.length > 0 ? allCategories.map(category => (
              <div key={category.id} style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id={`category-${category.id}`}
                  checked={userInterests.includes(category.id)}
                  onChange={() => handleInterestChange(category.id)}
                  style={{ marginRight: '8px', accentColor: '#0070f3', transform: 'scale(1.1)' }}
                />
                <label htmlFor={`category-${category.id}`} style={{ fontSize: '0.95em' }}>{category.name}</label>
              </div>
            )) : <p style={{color: '#aaa'}}>{isLoading ? 'Loading categories...': 'No categories available. Admin needs to add them.'}</p>}
          </div>
        </div>

        <button type="submit" disabled={isUpdating} style={{ width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', opacity: isUpdating ? 0.7 : 1 }}>
          {isUpdating ? 'Updating Profile...' : 'Save Changes'}
        </button>
      </form>

      {/* Removed sections for Saved Events, Past Events, and old category selection UI */}
    </div>
  );
}

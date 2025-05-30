'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '@/components/providers/AuthProvider';

interface EventCategory {
  id: number;
  name: string;
}

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue_name: string;
  address: string;
  city: string; // Will be pre-filled with MVP city for now
  category_id: string; // Storing as string from select, will parse to int
  price_info: string;
  is_free: boolean;
  organizer_name: string;
  organizer_contact: string;
  source_url: string;
  image_url: string;
}

const MVP_CITY = 'Miami'; // Fetched from plan or env variable ideally

function SubmitEventForm() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    venue_name: '',
    address: '',
    city: MVP_CITY,
    category_id: '',
    price_info: '',
    is_free: false,
    organizer_name: '',
    organizer_contact: '',
    source_url: '',
    image_url: '',
  });
  const [isLoading, setIsLoading] = useState(true); // For loading categories
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !session) {
      router.push('/auth/login?redirectedFrom=/submit-event');
    }
  }, [session, authLoading, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('event_categories')
          .select('id, name')
          .order('name', { ascending: true });
        if (error) throw error;
        setCategories(data || []);
      } catch (err: any) {
        setError('Failed to load event categories: ' + err.message);
      }
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit an event.');
      return;
    }
    if (!formData.category_id) {
        setError('Please select an event category.');
        return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const submissionData = {
        ...formData,
        category_id: parseInt(formData.category_id, 10),
        created_by: user.id,
        is_approved: false, // Events require approval
        city: MVP_CITY, // Ensure city is set
        // Convert empty time strings to null
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
      };

      const { error: submissionError } = await supabase.from('events').insert([submissionData]);

      if (submissionError) throw submissionError;

      setSuccessMessage('Event submitted successfully! It will be reviewed by our team.');
      // Reset form or redirect
      setFormData({
        title: '', description: '', event_date: '', start_time: '', end_time: '',
        venue_name: '', address: '', city: MVP_CITY, category_id: '', price_info: '',
        is_free: false, organizer_name: '', organizer_contact: '', source_url: '', image_url: ''
      });
      // router.push('/events'); // Or to a 'thank you' page

    } catch (err: any) {
      setError('Failed to submit event: ' + err.message);
      console.error("Submission error:", err)
    }
    setIsSubmitting(false);
  };

  if (authLoading || isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'white', backgroundColor: '#121212' }}><p>Loading form...</p></div>;
  }
  if (!session) {
     // Should be handled by useEffect redirect, but as a fallback:
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'white', backgroundColor: '#121212' }}><p>Redirecting to login...</p></div>;
  }

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: 'white', marginBottom: '10px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#aaa' };

  return (
    <div style={{ maxWidth: '700px', margin: '50px auto', padding: '30px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#1a1a1a', color: 'white' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2em' }}>Submit New Event</h1>
      {error && <p style={{ color: '#ff4d4d', marginBottom: '15px', padding: '10px', backgroundColor: '#402020', borderRadius: '4px' }}>{error}</p>}
      {successMessage && <p style={{ color: '#4dff4d', marginBottom: '15px', padding: '10px', backgroundColor: '#204020', borderRadius: '4px' }}>{successMessage}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <div>
            <label htmlFor="title" style={labelStyle}>Event Title*</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
            <label htmlFor="description" style={labelStyle}>Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} style={{...inputStyle, minHeight: '80px'}} />
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'}}>
            <div>
                <label htmlFor="event_date" style={labelStyle}>Date*</label>
                <input type="date" name="event_date" id="event_date" value={formData.event_date} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
                <label htmlFor="start_time" style={labelStyle}>Start Time</label>
                <input type="time" name="start_time" id="start_time" value={formData.start_time} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
                <label htmlFor="end_time" style={labelStyle}>End Time</label>
                <input type="time" name="end_time" id="end_time" value={formData.end_time} onChange={handleChange} style={inputStyle} />
            </div>
        </div>

        <div>
            <label htmlFor="category_id" style={labelStyle}>Category*</label>
            <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} required style={inputStyle}>
                <option value="" disabled>Select a category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'}}>
            <div>
                <label htmlFor="venue_name" style={labelStyle}>Venue Name</label>
                <input type="text" name="venue_name" id="venue_name" value={formData.venue_name} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
                <label htmlFor="address" style={labelStyle}>Address</label>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} style={inputStyle} />
            </div>
             <div>
                <label htmlFor="city" style={labelStyle}>City</label>
                <input type="text" name="city" id="city" value={formData.city} disabled style={{...inputStyle, cursor: 'not-allowed', color: '#ccc'}} />
            </div>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'}}>
            <div>
                <label htmlFor="price_info" style={labelStyle}>Price Info (e.g., "$10-$20", "Free with RSVP")</label>
                <input type="text" name="price_info" id="price_info" value={formData.price_info} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{display: 'flex', alignItems: 'center', paddingTop: '20px'}}>
                <input type="checkbox" name="is_free" id="is_free" checked={formData.is_free} onChange={handleChange} style={{ marginRight: '10px', transform: 'scale(1.2)', accentColor: '#0070f3' }} />
                <label htmlFor="is_free" style={{...labelStyle, marginBottom: '0'}}>This event is free</label>
            </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'}}>
            <div>
                <label htmlFor="organizer_name" style={labelStyle}>Organizer Name</label>
                <input type="text" name="organizer_name" id="organizer_name" value={formData.organizer_name} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
                <label htmlFor="organizer_contact" style={labelStyle}>Organizer Contact (Email/Phone)</label>
                <input type="text" name="organizer_contact" id="organizer_contact" value={formData.organizer_contact} onChange={handleChange} style={inputStyle} />
            </div>
        </div>

        <div>
            <label htmlFor="source_url" style={labelStyle}>Source URL (Official event page, tickets link)</label>
            <input type="url" name="source_url" id="source_url" value={formData.source_url} onChange={handleChange} style={inputStyle} placeholder="https://..." />
        </div>
        <div>
            <label htmlFor="image_url" style={labelStyle}>Image URL (Link to a promotional image)</label>
            <input type="url" name="image_url" id="image_url" value={formData.image_url} onChange={handleChange} style={inputStyle} placeholder="https://..." />
        </div>

        <button type="submit" disabled={isSubmitting || isLoading} style={{ padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', opacity: (isSubmitting || isLoading) ? 0.7 : 1 }}>
          {isSubmitting ? 'Submitting Event...' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
}

export default function SubmitEventPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'white', backgroundColor: '#121212' }}>
        <p>Loading...</p>
      </div>
    }>
      <SubmitEventForm />
    </Suspense>
  );
} 
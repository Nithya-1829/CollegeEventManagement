
import { useEffect, useState } from 'react';
import './App.css';

const API = 'http://localhost:5000';

function App() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    event_date: '',
    venue: ''
  });
  const [student, setStudent] = useState({
    student_name: '',
    email: ''
  });

  async function loadEvents() {
    try {
      const response = await fetch(`${API}/events`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load events');
      setEvents(data);
    } catch {
      setMessage('Cannot connect to the server. Make sure the backend is running.');
    }
  }

  async function loadRegistrations() {
  try {
    const response = await fetch(`${API}/registrations`);
    const data = await response.json();

    if (response.ok) {
      setRegistrations(data);
    }
  } catch (error) {
    console.log('Could not load registrations:', error);
  }
}

useEffect(() => {
  loadEvents();
  loadRegistrations();
}, []);

  async function addEvent(e) {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not add event');

      setMessage('Event added successfully!');
      setForm({ title: '', description: '', event_date: '', venue: '' });
      loadEvents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function registerForEvent(eventId) {
    if (!student.student_name.trim() || !student.email.trim()) {
      setMessage('Enter your name and email in the registration section first.');
      return;
    }

    try {
      const response = await fetch(`${API}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...student,
          event_id: eventId
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      setMessage('Registration successful!');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteEvent(id) {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`${API}/events/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not delete event');

      setMessage('Event deleted successfully!');
      loadEvents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  const filteredEvents = events.filter(event =>
    `${event.title} ${event.description || ''} ${event.venue}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="hero">
        <div className="nav">
          <h2>CampusConnect</h2>
          <a href="#events">Explore Events</a>
        </div>
        <div className="hero-content">
          <p className="eyebrow">YOUR CAMPUS, YOUR MOMENT</p>
          <h1>Discover. Participate.<br />Make Memories.</h1>
          <p>Find college events, join exciting activities and connect with your campus community.</p>
          <a className="primary-btn" href="#events">Explore Events ↓</a>
        </div>
      </header>

      <main>
        {message && (
          <div className="message" role="status">
            {message}
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        <section id="events" className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">WHAT'S HAPPENING</p>
              <h2>Upcoming Events</h2>
            </div>
            <input
              className="search"
              placeholder="Search events or venues..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="event-grid">
            {filteredEvents.map(event => (
              <article className="event-card" key={event.id}>
                <div className="event-art">
                  <span>✦ CAMPUS EVENT</span>
                  <div>✧</div>
                </div>
                <div className="event-info">
                  <p className="event-date">
                    {new Date(event.event_date + 'T00:00:00').toLocaleDateString(
                      'en-IN',
                      { day: 'numeric', month: 'short', year: 'numeric' }
                    )}
                  </p>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <p className="venue">⌖ {event.venue}</p>
                  <button className="register-btn" onClick={() => registerForEvent(event.id)}>
                    Register for Event
                  </button>
                  <button className="delete-btn" onClick={() => deleteEvent(event.id)}>
                    Delete Event
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredEvents.length === 0 && <p>No matching events found.</p>}
        </section>

        <section className="section registration-section">
          <p className="eyebrow">SAVE YOUR SPOT</p>
          <h2>Join an Event</h2>
          <p>Enter your details below, then choose Register for Event on a card above.</p>
          <div className="registration-form">
            <input
              placeholder="Your full name"
              value={student.student_name}
              onChange={e => setStudent({ ...student, student_name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Your email address"
              value={student.email}
              onChange={e => setStudent({ ...student, email: e.target.value })}
            />
          </div>
        </section>

        <section className="section">
  <p className="eyebrow">EVENT PARTICIPANTS</p>
  <h2>Registration History</h2>

  {registrations.length === 0 ? (
    <p>No registrations yet.</p>
  ) : (
    <div className="event-grid">
      {registrations.map(registration => (
        <article className="event-card" key={registration.id}>
          <div className="event-info">
            <h3>{registration.student_name}</h3>
            <p>{registration.email}</p>
            <p>Event: {registration.event_title}</p>
            <p>
              Registered: {new Date(registration.registered_at).toLocaleString('en-IN')}
            </p>
          </div>
        </article>
      ))}
    </div>
  )}
</section>

        <section className="section add-section">
          <p className="eyebrow">FOR EVENT ORGANIZERS</p>
          <h2>Create a New Event</h2>
          <form className="add-form" onSubmit={addEvent}>
            <input
              required
              placeholder="Event title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <input
              required
              placeholder="Venue"
              value={form.venue}
              onChange={e => setForm({ ...form, venue: e.target.value })}
            />
            <input
              required
              type="date"
              value={form.event_date}
              onChange={e => setForm({ ...form, event_date: e.target.value })}
            />
            <textarea
              placeholder="Event description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <button className="primary-btn" type="submit">Add Event</button>
          </form>
        </section>
      </main>

      <footer>CampusConnect · College Event Management System</footer>
    </div>
  );
}

export default App;

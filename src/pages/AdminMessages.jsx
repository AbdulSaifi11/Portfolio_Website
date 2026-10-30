import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../Confige_firebase/config.js';
import { deleteContactMessage, listContactMessages, updateContactMessage } from '../firebase/contactMessages.js';

function displayDate(timestamp) {
  if (!timestamp?.toDate) return 'Just received';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp.toDate());
}

export default function AdminMessages() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setAuthReady(true);
  }), []);

  const loadMessages = useCallback(async () => {
    setLoadingMessages(true);
    setError('');
    try {
      setMessages(await listContactMessages());
    } catch (problem) {
      console.error('Contact inbox could not be loaded:', problem);
      setError(problem.code === 'permission-denied'
        ? 'This account is signed in, but its UID is not allowed by firestore.rules. Add this user’s UID as the admin UID, publish the rules, then refresh.'
        : 'Could not load messages. Check the Firestore database and security rules setup.');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadMessages();
  }, [user, loadMessages]);

  const signIn = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, credentials.email.trim(), credentials.password);
    } catch (problem) {
      setError(problem.code === 'auth/invalid-credential'
        ? 'The email or password was not accepted.'
        : 'Sign in failed. Confirm Email/Password sign-in is enabled in Firebase Authentication.');
    } finally {
      setBusy(false);
    }
  };

  const beginEdit = (message) => {
    setEditingId(message.id);
    setDraft({ name: message.name, email: message.email, phone: message.phone, address: message.address || '', status: message.status || 'new' });
    setNotice('');
    setError('');
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await updateContactMessage(editingId, draft);
      setEditingId(null);
      setDraft(null);
      await loadMessages();
      setNotice('Message updated.');
    } catch (problem) {
      console.error('Contact message update failed:', problem);
      setError('Could not update this message. Check that the signed-in account is the configured admin.');
    } finally {
      setBusy(false);
    }
  };

  const removeMessage = async (message) => {
    if (!window.confirm(`Delete the message from ${message.name}? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    try {
      await deleteContactMessage(message.id);
      await loadMessages();
      setNotice('Message deleted.');
    } catch (problem) {
      console.error('Contact message delete failed:', problem);
      setError('Could not delete this message. Check the Firestore admin rules.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="inner-page admin-page">
      <section className="page-heading"><p className="eyebrow">Private workspace</p><h1>Contact <span>inbox</span></h1><p>Review and manage messages sent through the portfolio contact form.</p></section>
      {!authReady && <p className="admin-state">Connecting to Firebase Authentication…</p>}
      {authReady && !user && <form className="admin-login" onSubmit={signIn}>
        <h2>Admin sign in</h2>
        <p>Use the email and password for the administrator account created in Firebase Authentication.</p>
        <label htmlFor="admin-email">Email</label><input id="admin-email" type="email" autoComplete="username" required value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} />
        <label htmlFor="admin-password">Password</label><input id="admin-password" type="password" autoComplete="current-password" required value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} />
        {error && <p className="form-message is-error" role="alert">{error}</p>}
        <button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>}
      {user && <section className="inbox-panel">
        <div className="inbox-toolbar"><p>Signed in as <strong>{user.email}</strong></p><div className="form-actions"><button className="button button-outline" type="button" disabled={loadingMessages} onClick={loadMessages}>{loadingMessages ? 'Refreshing…' : 'Refresh inbox'}</button><button className="button button-outline" type="button" onClick={() => signOut(auth)}>Sign out</button></div></div>
        {notice && <p className="form-message is-success" role="status">{notice}</p>}
        {error && <p className="form-message is-error" role="alert">{error}</p>}
        {loadingMessages ? <p className="admin-state">Loading messages…</p> : messages.length === 0 && !error ? <p className="admin-state">No messages yet. Contact form submissions will appear here.</p> : <div className="inbox-list">
          {messages.map((message) => <article className="message-card" key={message.id}>
            {editingId === message.id ? <form className="message-editor" onSubmit={saveEdit}>
              <label>Name<input required maxLength="100" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
              <label>Email<input required type="email" maxLength="254" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
              <label>Phone<input required maxLength="30" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label>
              <label>Address<input maxLength="300" value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} /></label>
              <label>Status<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}><option value="new">New</option><option value="read">Read</option><option value="archived">Archived</option></select></label>
              <div className="form-actions"><button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button><button className="button button-outline" type="button" onClick={() => { setEditingId(null); setDraft(null); }}>Cancel</button></div>
            </form> : <>
              <div className="message-heading"><div><span className={`message-status status-${message.status || 'new'}`}>{message.status || 'new'}</span><h2>{message.name}</h2></div><time>{displayDate(message.createdAt)}</time></div>
              <dl><div><dt>Email</dt><dd><a href={`mailto:${message.email}`}>{message.email}</a></dd></div><div><dt>Phone</dt><dd><a href={`tel:${message.phone}`}>{message.phone}</a></dd></div>{message.address && <div><dt>Address</dt><dd>{message.address}</dd></div>}</dl>
              <div className="form-actions"><button className="button button-outline" type="button" onClick={() => beginEdit(message)}>Edit</button><button className="button button-danger" type="button" disabled={busy} onClick={() => removeMessage(message)}>Delete</button></div>
            </>}
          </article>)}
        </div>}
      </section>}
    </main>
  );
}

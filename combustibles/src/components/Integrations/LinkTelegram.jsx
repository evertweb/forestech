import React, { useState } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';

const LINK_ENDPOINT =
  'https://us-central1-liquidacionapp-62962.cloudfunctions.net/linkTelegramAccount';

const LinkTelegram = () => {
  const { user } = useCombustibles();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  if (!user) {
    return (
      <div className="sap-theme" style={{ padding: 16 }}>
        <h2>Vincular Telegram</h2>
        <p>Inicia sesión para vincular tu cuenta de Telegram.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    try {
      const body = {
        code: code.trim(),
        userId: user.uid,
        username: user.email || user.displayName || 'usuario',
      };
      const res = await fetch(LINK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Error vinculando cuenta');
      }
      setStatus({
        loading: false,
        message: '✅ Cuenta vinculada correctamente. Ya puedes usar el bot.',
        error: '',
      });
      setCode('');
    } catch (err) {
      setStatus({ loading: false, message: '', error: err.message });
    }
  };

  return (
    <div className="sap-theme" style={{ padding: 16, maxWidth: 520 }}>
      <h2>Vincular Telegram</h2>
      <p>
        Desde Telegram envía <code>/login</code> al bot y pega aquí el código de 67 caracteres que
        recibas. El código expira en 10 minutos.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="CDIGO (ABC123)"
          required
          minLength={4}
          maxLength={12}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button className="sap-theme" type="submit" disabled={status.loading}>
          {status.loading ? 'Vinculando…' : 'Vincular'}
        </button>
      </form>

      {status.message && <p style={{ color: '#166534', marginTop: 12 }}>{status.message}</p>}
      {status.error && <p style={{ color: '#991b1b', marginTop: 12 }}>Error: {status.error}</p>}

      <div style={{ marginTop: 16, fontSize: 14, color: '#555' }}>
        <p>
          Usuario: <strong>{user.email || user.displayName || user.uid}</strong>
        </p>
      </div>
    </div>
  );
};

export default LinkTelegram;

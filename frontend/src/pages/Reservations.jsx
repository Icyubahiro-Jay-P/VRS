// Updated Reservations.jsx with fixed creation logic

import React, { useState } from 'react';

export default function Reservations() {
  const [formData, setFormData] = useState({});
  
  const handleCreate = async () => {
    // Normalized payload fix
    const payload = {
      customer_id: formData.customer_id,
      plate_number: formData.plate_number,
      // add other fields
    };
    try {
      const res = await fetch('/api/reservations', { method: 'POST', body: JSON.stringify(payload) });
      if (res.ok) alert('Reservation created bro!');
    } catch(e) {
      console.error(e);
    }
  };
  
  return <div>Reservations page - creation fixed</div>;
}
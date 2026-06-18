const payload = {
  amount: 2789,
  customer: { name: 'Test User' },
  item: { title: 'Stalkea AI', price: 2789, quantity: 1 },
  paymentMethod: 'PIX'
};

console.log('Payload:', JSON.stringify(payload, null, 2));
console.log('Amount type:', typeof payload.amount);
console.log('Amount is integer:', Number.isInteger(payload.amount));

const response = await fetch('https://stalkeaa-delta.vercel.app/api/checkout/pix', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

const data = await response.json();
console.log('Response:', JSON.stringify(data, null, 2));

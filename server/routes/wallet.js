import { Router } from 'express';
import { recordSorobanEvent } from '../services/stellar.js';
import { formatWalletBalance, formatEvent, ok } from '../utils/format.js';

const router = Router();

// Simulated balances per public key in-memory
const balances = new Map(); // pubKey -> { USDC: '0', GREEN: '0' }

function getBal(pub) {
  if (!balances.has(pub)) balances.set(pub, { USDC: '0', GREEN: '0' });
  return balances.get(pub);
}

router.post('/simulate-return', async (req, res) => {
  const { publicKey = 'GDEMOUSER', points = 1, token = 'GREEN' } = req.body || {};
  const bal = getBal(publicKey);
  const amount = String(points);
  bal[token] = String((parseInt(bal[token] || '0', 10) + parseInt(amount, 10)));

  const evt = await recordSorobanEvent({ type: 'INCENTIVE', payload: { publicKey, token, amount } });

  res.json(ok({ balance: formatWalletBalance({ publicKey, balances: bal }), event: formatEvent(evt) }));
});

router.get('/balance/:pub', (req, res) => {
  const bal = getBal(req.params.pub);
  res.json(ok(formatWalletBalance({ publicKey: req.params.pub, balances: bal })));
});

export default router;

import { Router } from 'express';
import { nanoid } from 'nanoid';
import { batteries, events } from '../store/memory.js';
import { mintNFTLikeToken, recordSorobanEvent } from '../services/stellar.js';
import { formatBattery, formatEvent, ok, fail } from '../utils/format.js';

const router = Router();

const LIFECYCLE_STATES = ['fabricacion', 'distribucion', 'venta', 'recoleccion', 'reciclaje'];

router.get('/', (_req, res) => {
  const list = Array.from(batteries.values()).map(formatBattery);
  res.json(ok(list, { count: list.length }));
});

router.post('/', async (req, res) => {
  try {
    const { id, tipo, fabricante, fecha, issuerSecret, receptorPublicKey } = req.body || {};
    const batteryId = id || nanoid(10);

    const tokenCode = `BAT_${batteryId.toUpperCase().slice(0, 6)}`;

    const enableOnchain = process.env.ENABLE_ONCHAIN === 'true';
    const nft = await mintNFTLikeToken({
      issuerSecret: enableOnchain ? (issuerSecret || process.env.ISSUER_SECRET) : undefined,
      code: tokenCode,
      receiverPublicKey: receptorPublicKey || 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      memo: `Battery ${batteryId}`,
    });

    const obj = {
      id: batteryId,
      tipo: tipo || 'AA',
      fabricante: fabricante || 'ACME',
      fecha: fecha || new Date().toISOString(),
      estado: 'fabricacion',
      token: nft.asset,
      txId: nft.txId,
      onchain: !nft.simulated,
      history: [],
    };

    batteries.set(batteryId, obj);

    const evt = await recordSorobanEvent({ type: 'REGISTER', payload: obj });
    events.push(evt);

    res.status(201).json(ok({ battery: formatBattery(obj), event: formatEvent(evt) }));
  } catch (err) {
    console.error(err);
    res.status(500).json(fail('Error registrando pila'));
  }
});

router.post('/:id/estado', async (req, res) => {
  const item = batteries.get(req.params.id);
  if (!item) return res.status(404).json(fail('No encontrado', 'NOT_FOUND'));
  const { estado } = req.body || {};
  if (!LIFECYCLE_STATES.includes(estado)) {
    return res.status(400).json(fail('Estado inválido', 'BAD_STATE', { allowed: LIFECYCLE_STATES }));
  }
  item.estado = estado;
  item.history.push({ ts: Date.now(), estado });

  const evt = await recordSorobanEvent({ type: 'STATE_CHANGE', payload: { id: item.id, estado } });
  events.push(evt);

  res.json(ok({ battery: formatBattery(item), event: formatEvent(evt) }));
});

router.get('/events/all', (_req, res) => {
  const items = events.map(formatEvent);
  res.json(ok(items, { count: items.length }));
});

router.get('/:id', (req, res) => {
  const item = batteries.get(req.params.id);
  if (!item) return res.status(404).json(fail('No encontrado', 'NOT_FOUND'));
  res.json(ok(formatBattery(item)));
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const item = batteries.get(id);
  if (!item) return res.status(404).json(fail('No encontrado', 'NOT_FOUND'));
  batteries.delete(id);
  const evt = await recordSorobanEvent({ type: 'DELETE', payload: { id } });
  events.push(evt);
  res.json(ok({ id, deleted: true, event: formatEvent(evt) }));
});

export default router;

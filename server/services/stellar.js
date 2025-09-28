// Lightweight Stellar/Soroban service for demo.
// Provides mocked helpers that can be swapped for real calls.

import stellar from '@stellar/stellar-sdk';
const { Keypair, Networks, Server, Asset, TransactionBuilder, Operation } = stellar;

const STELLAR_NETWORK = process.env.STELLAR_NETWORK || 'testnet';
const HORIZON_URL = STELLAR_NETWORK === 'public' ? 'https://horizon.stellar.org' : 'https://horizon-testnet.stellar.org';

// Note: For demo we won't submit real transactions by default.
// Set ENABLE_ONCHAIN=true to attempt network calls (needs funded accounts on testnet).
const ENABLE_ONCHAIN = process.env.ENABLE_ONCHAIN === 'true';

let server = null;
if (process.env.ENABLE_ONCHAIN === 'true') {
  try {
    server = new Server(HORIZON_URL);
  } catch (e) {
    console.warn('Stellar Server init failed, running in simulated mode:', e?.message)
  }
}

export function getNetworkPassphrase() {
  return STELLAR_NETWORK === 'public' ? Networks.PUBLIC : Networks.TESTNET;
}

export function generateKeypair() {
  const kp = Keypair.random();
  return { publicKey: kp.publicKey(), secret: kp.secret() };
}

export async function mintNFTLikeToken({ issuerSecret, code, receiverPublicKey, memo = 'Battery NFT' }) {
  // For simplicity, use an "asset" with limit=1 as an NFT-like token (not a true ERC721-style NFT).
  // Real Soroban assets/contracts would be used for production.
  if (!ENABLE_ONCHAIN) {
    // Do NOT attempt to decode secrets in simulated mode.
    let issuerPub = 'GDEMOISSUER';
    try {
      if (issuerSecret && issuerSecret.startsWith('S') && issuerSecret.length >= 56) {
        issuerPub = Keypair.fromSecret(issuerSecret).publicKey();
      }
    } catch (_) {
      // ignore, keep demo issuer
    }
    return {
      txId: `demo-${Date.now()}`,
      asset: `${code}:${issuerPub}`,
      simulated: true,
    };
  }
  if (!server) throw new Error('Server not initialized');
  const issuer = Keypair.fromSecret(issuerSecret);
  const asset = new Asset(code, issuer.publicKey());
  const receiver = receiverPublicKey;
  const account = await server.loadAccount(issuer.publicKey());

  const tx = new TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: getNetworkPassphrase(),
  })
    .addOperation(Operation.changeTrust({ asset, source: receiver }))
    .addOperation(Operation.payment({
      asset,
      destination: receiver,
      amount: '1',
    }))
    .setTimeout(60)
    .build();

  tx.sign(issuer);
  const res = await server.submitTransaction(tx);
  return { txId: res.hash, asset: `${code}:${issuer.publicKey()}`, simulated: false };
}

export async function recordSorobanEvent({ contractId = 'demo-contract', type, payload }) {
  // Placeholder: In real-world, call Soroban RPC to invoke a method that emits an event.
  // For demo we just return a fake receipt.
  return { id: `evt-${Date.now()}`, contractId, type, payload, network: STELLAR_NETWORK };
}

import crypto from 'crypto';
import { prisma } from '../db/prisma';

function sha256Hex(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function getTip() {
  const tip = await prisma.block.findFirst({ orderBy: { height: 'desc' } });
  return tip || null;
}

export async function addBlock(payloadHash: string) {
  const tip = await getTip();
  const height = tip ? tip.height + 1 : 0;
  const previousHash = tip ? tip.hash : 'GENESIS';
  let nonce = 0;
  let hash = '';
  // trivial PoW: find a hash starting with '000'
  do {
    nonce++;
    hash = sha256Hex(`${height}:${previousHash}:${payloadHash}:${nonce}`);
  } while (!hash.startsWith('000'));

  const block = await prisma.block.create({
    data: { height, previousHash, payloadHash, nonce, hash },
  });
  return block;
}

export async function verifyPayload(payloadHash: string) {
  const b = await prisma.block.findFirst({ where: { payloadHash } });
  return !!b;
}


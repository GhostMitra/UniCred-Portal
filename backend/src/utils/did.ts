import { generateKeyPair, importJWK, exportJWK, SignJWT, jwtVerify, JWK } from 'jose';
import { sha256Hex } from './crypto';

export interface DidWithKeys {
  did: string;
  jwk: JWK;
}

export async function createDidFromSeed(seed: string): Promise<DidWithKeys> {
  const seedBytes = Buffer.from(seed).subarray(0, 32);
  const { publicKey, privateKey } = await generateKeyPair('EdDSA', { extractable: true, crv: 'Ed25519', crvAlgorithm: 'Ed25519' as any });
  const jwk = await exportJWK(privateKey);
  const pubJwk = await exportJWK(publicKey);
  const did = `did:example:${sha256Hex(JSON.stringify(pubJwk)).slice(0, 32)}`;
  return { did, jwk };
}

export async function signVc(payload: Record<string, unknown>, jwk: JWK): Promise<string> {
  const key = await importJWK(jwk, 'EdDSA');
  const jwt = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'EdDSA', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('365d')
    .sign(key);
  return jwt;
}

export async function verifyVc(jwt: string, publicJwk: JWK) {
  const key = await importJWK(publicJwk, 'EdDSA');
  return jwtVerify(jwt, key);
}


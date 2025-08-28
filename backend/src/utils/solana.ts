// Lightweight Solana helpers with lazy import to avoid crashing if deps missing
export async function getSolanaObjects() {
  try {
    // @ts-ignore
    const web3 = await import('@solana/web3.js');
    return web3 as typeof import('@solana/web3.js');
  } catch (e) {
    throw new Error('Solana SDK not installed. Run: npm i @solana/web3.js');
  }
}

export async function getConnection() {
  const { Connection, clusterApiUrl } = await getSolanaObjects();
  const url = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');
  return new Connection(url, 'confirmed');
}

export async function getIssuerKeypair() {
  const { Keypair } = await getSolanaObjects();
  const secret = process.env.SOLANA_SECRET_KEY;
  if (!secret) throw new Error('Missing SOLANA_SECRET_KEY in env');
  const arr = JSON.parse(secret) as number[];
  return Keypair.fromSecretKey(Uint8Array.from(arr));
}

export async function sendMemoTransaction(memo: string) {
  const { Transaction, SystemProgram, PublicKey, Keypair } = await getSolanaObjects();
  const connection = await getConnection();
  const payer = await getIssuerKeypair();
  const memoProgramId = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

  const instruction = new (await getSolanaObjects()).TransactionInstruction({
    keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: false }],
    programId: memoProgramId,
    data: Buffer.from(memo, 'utf8'),
  });

  const tx = new Transaction().add(instruction);
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  const signed = await (await getSolanaObjects()).sendAndConfirmTransaction(connection, tx, [payer]);
  return signed; // transaction signature
}


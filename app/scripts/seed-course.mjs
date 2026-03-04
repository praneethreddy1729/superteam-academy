/**
 * Sanity CMS Seed Script — Superteam Academy "Solana Fundamentals" Course
 *
 * Creates a complete English-primary course with Portuguese (pt-BR) stub,
 * 2 modules, 6 lessons, and 2 coding challenges. Designed as a bounty
 * submission showcase.
 *
 * HOW TO RUN:
 *   node scripts/seed-course.mjs
 *
 * Required env vars:
 *   SANITY_API_TOKEN              — write-access token
 *   NEXT_PUBLIC_SANITY_PROJECT_ID — Sanity project ID (fallback: "vc90yp9o")
 *   NEXT_PUBLIC_SANITY_DATASET    — dataset name (fallback: "production")
 *
 * IDEMPOTENT — safe to run multiple times. Uses createOrReplace with
 * deterministic document IDs. Checks if course already exists and reports it.
 */

import { createClient } from "@sanity/client";

// ---------------------------------------------------------------------------
// Client setup
// ---------------------------------------------------------------------------

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("\n[ERROR] SANITY_API_TOKEN environment variable is not set.");
  console.error("        Export it before running:");
  console.error("        export SANITY_API_TOKEN=your_token_here\n");
  process.exit(1);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "vc90yp9o";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Portable Text helpers
// ---------------------------------------------------------------------------

let _keyCounter = 0;
function k(prefix = "k") {
  return `${prefix}_${(++_keyCounter).toString(36).padStart(4, "0")}`;
}

function para(text) {
  const key = k("p");
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}_s0`, text, marks: [] }],
  };
}

function heading(text, level = "h2") {
  const key = k("h");
  return {
    _type: "block",
    _key: key,
    style: level,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}_s0`, text, marks: [] }],
  };
}

function codeBlock(language, code) {
  return { _type: "codeBlock", _key: k("cb"), language, code };
}

function callout(type, text) {
  return { _type: "callout", _key: k("co"), type, text };
}

// ---------------------------------------------------------------------------
// Instructor
// ---------------------------------------------------------------------------

const instructor = {
  _id: "instructor-marcus-silva-en",
  _type: "instructor",
  name: "Marcus Silva",
  bio: "Marcus Silva is a full-stack Solana developer and educator with 5 years of experience building on-chain programs and DeFi protocols. He has taught over 500 developers across the Superteam global network and is a core contributor to the Solana Developer Hub.",
  walletAddress: "",
  socialLinks: [
    { _key: "sl_twitter", platform: "Twitter", url: "https://twitter.com/SuperteamDAO" },
    { _key: "sl_github",  platform: "GitHub",  url: "https://github.com/superteam-academy" },
    { _key: "sl_discord", platform: "Discord", url: "https://discord.gg/superteam" },
  ],
};

// ===========================================================================
// CHALLENGES
// ===========================================================================

// ---------------------------------------------------------------------------
// Challenge A: Read Account Balance (for Lesson 1.2 — Accounts & Lamports)
// ---------------------------------------------------------------------------

const challenge_read_balance = {
  _id: "challenge-read-account-balance",
  _type: "challenge",
  title: "Read Account Balance",
  language: "ts",
  difficulty: 1,
  xpReward: 75,
  hints: [
    "Use `connection.getBalance(publicKey)` — it returns the balance in lamports as a number.",
    "Import `LAMPORTS_PER_SOL` from `@solana/web3.js` and divide to convert lamports to SOL.",
    "The function is async — remember to `await` the RPC call.",
  ],
  starterCode: `import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

/**
 * Fetch the SOL balance of a given account.
 *
 * Solana stores balances in **lamports** (the smallest unit).
 * 1 SOL = 1,000,000,000 lamports (LAMPORTS_PER_SOL).
 *
 * @param connection - An active RPC connection
 * @param address    - Base58 public key string of the account to query
 * @returns          - Balance in SOL as a floating-point number
 */
export async function getBalanceInSol(
  connection: Connection,
  address: string
): Promise<number> {
  // TODO: create a PublicKey from the address string,
  //       fetch the balance in lamports, convert to SOL, and return it.
}
`,
  solutionCode: `import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function getBalanceInSol(
  connection: Connection,
  address: string
): Promise<number> {
  const pubkey = new PublicKey(address);
  const lamports = await connection.getBalance(pubkey);
  return lamports / LAMPORTS_PER_SOL;
}
`,
  testCode: `import { getBalanceInSol } from "./solution";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Mock connection returning a fixed lamport value
const MOCK_LAMPORTS = 2_500_000_000; // 2.5 SOL
const mockConnection = {
  getBalance: async () => MOCK_LAMPORTS,
} as unknown as Connection;

const address = Keypair.generate().publicKey.toBase58();
const result = await getBalanceInSol(mockConnection, address);

console.assert(typeof result === "number", "Result must be a number");

const expected = MOCK_LAMPORTS / LAMPORTS_PER_SOL;
console.assert(
  Math.abs(result - expected) < 1e-12,
  \`Expected \${expected} SOL, got \${result}\`
);
console.log(\`PASS: getBalanceInSol returned \${result} SOL (expected \${expected} SOL)\`);
`,
};

// ---------------------------------------------------------------------------
// Challenge B: Hello World Anchor Program (for Lesson 2.2 — Your First Program)
// ---------------------------------------------------------------------------

const challenge_anchor_hello_world = {
  _id: "challenge-anchor-hello-world-program",
  _type: "challenge",
  title: "Anchor Hello World Program",
  language: "rust",
  difficulty: 1,
  xpReward: 125,
  hints: [
    "An Anchor instruction handler always takes `ctx: Context<T>` as its first argument and returns `Result<()>`.",
    "Use the `msg!()` macro to log text to the Solana transaction log — it works like `println!` but on-chain.",
    "Prefix the context variable with `_` (e.g., `_ctx`) if you don't use it, to suppress Rust's unused-variable warning.",
  ],
  starterCode: `use anchor_lang::prelude::*;

declare_id!("HeLLoSoLAnaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

/// Your first Anchor program!
///
/// Implement the \`say_hello\` instruction handler so it:
/// 1. Logs the message "Hello, Solana!" using msg!()
/// 2. Returns Ok(())
///
/// The #[program] macro exposes the module as a deployable Solana program.
/// Each pub fn inside is a callable instruction.
#[program]
pub mod hello_world {
    use super::*;

    pub fn say_hello(ctx: Context<SayHello>) -> Result<()> {
        // TODO: log "Hello, Solana!" and return Ok(())
        todo!()
    }
}

/// Accounts struct for the say_hello instruction.
/// This instruction only needs a signer — no PDAs or state accounts yet.
#[derive(Accounts)]
pub struct SayHello<'info> {
    pub signer: Signer<'info>,
}
`,
  solutionCode: `use anchor_lang::prelude::*;

declare_id!("HeLLoSoLAnaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

#[program]
pub mod hello_world {
    use super::*;

    pub fn say_hello(_ctx: Context<SayHello>) -> Result<()> {
        msg!("Hello, Solana!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SayHello<'info> {
    pub signer: Signer<'info>,
}
`,
  testCode: `// Verifies the say_hello handler:
// 1. Uses msg!("Hello, Solana!") to emit a log
// 2. Returns Ok(())
// 3. Does not contain todo!()

#[cfg(test)]
mod tests {
    #[test]
    fn test_say_hello_implementation() {
        let source = include_str!("./solution.rs");

        assert!(
            !source.contains("todo!()"),
            "Solution must not contain todo!()"
        );
        assert!(
            source.contains(r#"msg!("Hello, Solana!")"#),
            "Handler must call msg!(\"Hello, Solana!\")"
        );
        assert!(
            source.contains("Ok(())"),
            "Handler must return Ok(())"
        );
    }

    #[test]
    fn test_accounts_struct_has_signer() {
        let source = include_str!("./solution.rs");
        assert!(
            source.contains("Signer<'info>"),
            "SayHello struct must include a Signer account"
        );
    }
}
`,
};

// ===========================================================================
// LESSONS — Module 1: Blockchain Basics
// ===========================================================================

// ---------------------------------------------------------------------------
// Lesson 1.1: What is Solana?  (lessonIndex 0)
// ---------------------------------------------------------------------------

const lesson_what_is_solana = {
  _id: "lesson-en-solana-fundamentals-1-1",
  _type: "lesson",
  title: "What is Solana?",
  slug: { _type: "slug", current: "what-is-solana" },
  lessonIndex: 0,
  estimatedMinutes: 15,
  content: [
    heading("Welcome to Solana Development", "h2"),
    para(
      "Solana is a high-performance Layer 1 blockchain capable of processing over 65,000 transactions per second (TPS) with sub-second finality and near-zero transaction fees. It was founded in 2017 by Anatoly Yakovenko and launched its mainnet in March 2020."
    ),
    callout("info", "Solana's average transaction fee is ~$0.00025 — orders of magnitude cheaper than Ethereum L1. This makes micropayments and high-frequency on-chain actions practical for the first time."),
    heading("Key Innovations", "h2"),
    para(
      "Solana achieves its performance through eight core innovations, the most notable of which is Proof of History (PoH)."
    ),
    heading("Proof of History (PoH)", "h3"),
    para(
      "PoH is a cryptographic clock that allows nodes to agree on the passage of time without communicating. By embedding timestamps directly into the blockchain's hash chain, validators can process transactions in parallel rather than waiting for consensus on each one."
    ),
    codeBlock(
      "bash",
      `# A PoH hash chain looks like this conceptually:
hash_0 = SHA256("genesis")
hash_1 = SHA256(hash_0 + transaction_data)
hash_2 = SHA256(hash_1 + transaction_data)
# Each hash proves time passed since the previous one`
    ),
    heading("Gulf Stream", "h3"),
    para(
      "Gulf Stream is Solana's mempool-less transaction forwarding protocol. Validators forward transactions to the expected next leader before the current slot ends, allowing leaders to pre-process transactions and reducing confirmation times."
    ),
    heading("Turbine", "h3"),
    para(
      "Turbine breaks block data into small packets and propagates them using a tree-based structure inspired by BitTorrent. This dramatically reduces the bandwidth required to propagate blocks across thousands of validators."
    ),
    callout("tip", "Solana's architecture makes it uniquely suited for use cases like high-frequency trading, real-time gaming, and micropayment infrastructure — applications that are impractical on slower blockchains."),
    heading("The Solana Validator Network", "h2"),
    para(
      "As of 2025, Solana has over 2,000 active validators distributed globally. Unlike Proof of Work chains, Solana uses Proof of Stake (PoS) with Tower BFT consensus — an optimized version of PBFT that leverages PoH as a global clock."
    ),
    heading("Accounts Model vs. EVM", "h2"),
    para(
      "Solana uses an accounts model rather than the EVM's contract-centric model. Everything on Solana — programs (smart contracts), user wallets, and token balances — is an account. Programs are stateless: they contain only executable code, while all state lives in separate data accounts."
    ),
    codeBlock(
      "typescript",
      `// On Ethereum: contract holds its own state
// On Solana: programs are stateless, state is in accounts

// Example: fetching a Solana account
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const pubkey = new PublicKey("So11111111111111111111111111111111111111112");

const accountInfo = await connection.getAccountInfo(pubkey);
console.log("Owner program:", accountInfo?.owner.toBase58());
console.log("Lamports:", accountInfo?.lamports);
console.log("Executable:", accountInfo?.executable);`
    ),
    callout("info", "The Native SOL mint (So11...1112) is a special system account. When you wrap SOL into wSOL, its balance is held in a token account owned by the Token program."),
    heading("Summary", "h2"),
    para(
      "In this lesson you learned: (1) Solana's consensus mechanism combines PoH + Tower BFT, (2) its architecture enables 65k+ TPS with sub-second finality, and (3) the accounts model is fundamentally different from EVM — programs are stateless and all state lives in separate data accounts."
    ),
    para(
      "In the next lesson we'll dive deep into accounts and lamports — the fundamental unit of SOL storage."
    ),
  ],
};

// ---------------------------------------------------------------------------
// Lesson 1.2: Accounts & Lamports  (lessonIndex 1, with challenge)
// ---------------------------------------------------------------------------

const lesson_accounts_lamports = {
  _id: "lesson-en-solana-fundamentals-1-2",
  _type: "lesson",
  title: "Accounts & Lamports",
  slug: { _type: "slug", current: "accounts-and-lamports" },
  lessonIndex: 1,
  estimatedMinutes: 20,
  challenge: { _type: "reference", _ref: "challenge-read-account-balance" },
  content: [
    heading("Everything is an Account", "h2"),
    para(
      "On Solana, every piece of data — a wallet, a token balance, a program's bytecode, or application state — lives in an account. There are no special 'contract storage slots' like in Ethereum. This unified model makes Solana programs composable and predictable."
    ),
    heading("Account Structure", "h2"),
    para("Each Solana account has the following fields:"),
    codeBlock(
      "rust",
      `pub struct Account {
    /// Lamport balance (SOL stored in this account)
    pub lamports: u64,

    /// Data stored in this account (program state, bytecode, etc.)
    pub data: Vec<u8>,

    /// The program that owns this account and can modify its data
    pub owner: Pubkey,

    /// Is this account a compiled executable program?
    pub executable: bool,

    /// Slot at which this account's data was last modified
    pub rent_epoch: u64,
}`
    ),
    heading("Lamports — The Smallest Unit", "h2"),
    para(
      "Lamports are the smallest denomination of SOL, analogous to satoshis for Bitcoin or wei for Ethereum. There are exactly 1,000,000,000 (1e9) lamports in one SOL."
    ),
    codeBlock(
      "typescript",
      `import { LAMPORTS_PER_SOL } from "@solana/web3.js";

// Conversion examples
const oneSol   = 1 * LAMPORTS_PER_SOL;   // 1_000_000_000 lamports
const halfSol  = 0.5 * LAMPORTS_PER_SOL;  //   500_000_000 lamports
const oneThousandth = 0.001 * LAMPORTS_PER_SOL; // 1_000_000 lamports

// Display SOL from lamports
function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

console.log(lamportsToSol(2_500_000_000)); // 2.5`
    ),
    heading("Rent & Rent Exemption", "h2"),
    para(
      "Accounts on Solana must pay rent to store data on-chain. In practice, accounts are made rent-exempt by depositing enough lamports to cover two years of rent upfront. This deposit is refunded when the account is closed (its data set to zero and lamports reclaimed)."
    ),
    callout("warning", "If an account's lamport balance drops below the rent-exempt threshold and it is not marked exempt, the runtime will garbage-collect it. Always ensure accounts have sufficient lamports before closing them."),
    codeBlock(
      "typescript",
      `import { Connection } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

// Calculate minimum lamports for rent exemption
// given a data size (in bytes)
const dataSize = 165; // bytes (e.g., a token account)
const minLamports = await connection.getMinimumBalanceForRentExemption(dataSize);
console.log(\`Minimum rent-exempt balance for \${dataSize} bytes: \${minLamports} lamports\`);
// Typical output: ~2039280 lamports (~0.002 SOL)`
    ),
    heading("Reading Balances", "h2"),
    para(
      "To query an account's SOL balance, use `connection.getBalance(publicKey)`. It returns lamports as a number. For full account metadata including owner, data, and executable flag, use `connection.getAccountInfo(publicKey)`."
    ),
    codeBlock(
      "typescript",
      `import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

async function inspectAccount(address: string) {
  const pubkey = new PublicKey(address);

  // Quick balance check
  const lamports = await connection.getBalance(pubkey);
  console.log(\`Balance: \${lamports / LAMPORTS_PER_SOL} SOL\`);

  // Full account info
  const info = await connection.getAccountInfo(pubkey);
  if (!info) {
    console.log("Account does not exist");
    return;
  }
  console.log("Owner:", info.owner.toBase58());
  console.log("Data size:", info.data.length, "bytes");
  console.log("Executable:", info.executable);
}`
    ),
    callout("tip", "The System Program (11111111111111111111111111111111) owns all plain SOL wallets. Programs like the Token Program own token accounts. A program can only modify accounts it owns."),
    heading("Coding Challenge: Read Account Balance", "h2"),
    para(
      "Now it's your turn. Implement the `getBalanceInSol` function that fetches an account's balance from the RPC and returns it in SOL (not lamports). Use what you just learned about `connection.getBalance()` and `LAMPORTS_PER_SOL`."
    ),
  ],
};

// ---------------------------------------------------------------------------
// Lesson 1.3: Transactions & Instructions  (lessonIndex 2)
// ---------------------------------------------------------------------------

const lesson_transactions_instructions = {
  _id: "lesson-en-solana-fundamentals-1-3",
  _type: "lesson",
  title: "Transactions & Instructions",
  slug: { _type: "slug", current: "transactions-and-instructions" },
  lessonIndex: 2,
  estimatedMinutes: 25,
  content: [
    heading("Transactions: Atomic Bundles of Instructions", "h2"),
    para(
      "A Solana transaction is a signed bundle of one or more instructions that executes atomically — either all instructions succeed or none of them do. This makes transactions composable: you can combine token transfers, NFT mints, and program calls into a single atomic operation."
    ),
    heading("Anatomy of a Transaction", "h2"),
    codeBlock(
      "typescript",
      `// A transaction has three main components:
// 1. Message — the instructions + account keys + recent blockhash
// 2. Signatures — one per unique signer in the message
// 3. Recent Blockhash — prevents replay attacks, expires in ~90 seconds

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const payer = Keypair.generate();
const recipient = Keypair.generate();

// Build a SOL transfer transaction
const transaction = new Transaction();

// Step 1: Add an instruction
const transferIx = SystemProgram.transfer({
  fromPubkey: payer.publicKey,
  toPubkey: recipient.publicKey,
  lamports: 0.01 * LAMPORTS_PER_SOL,
});
transaction.add(transferIx);

// Step 2: Set the fee payer and recent blockhash
const { blockhash } = await connection.getLatestBlockhash("confirmed");
transaction.recentBlockhash = blockhash;
transaction.feePayer = payer.publicKey;

// Step 3: Sign and send
transaction.sign(payer);
// const signature = await connection.sendRawTransaction(transaction.serialize());`
    ),
    heading("Instructions: The Building Blocks", "h2"),
    para(
      "Each instruction in a transaction targets a specific on-chain program and passes three things: (1) the program ID to invoke, (2) the accounts it needs, and (3) serialized instruction data encoding which action to take and its parameters."
    ),
    codeBlock(
      "typescript",
      `import { TransactionInstruction, PublicKey } from "@solana/web3.js";

// A raw instruction (rarely constructed manually — use program SDKs instead)
const instruction = new TransactionInstruction({
  programId: new PublicKey("11111111111111111111111111111111"), // System Program
  keys: [
    { pubkey: fromPubkey, isSigner: true,  isWritable: true  },
    { pubkey: toPubkey,   isSigner: false, isWritable: true  },
  ],
  data: Buffer.from(encodedTransferData), // ABI-encoded amount
});`
    ),
    heading("Account Metas: Signer vs. Writable", "h2"),
    para(
      "Every account referenced in an instruction has two flags: `isSigner` (must the owner's signature be present?) and `isWritable` (will this account's data or lamports change?). Setting these correctly is critical — the runtime enforces them and will reject transactions that try to write to read-only accounts."
    ),
    callout("warning", "If an instruction claims an account is read-only (`isWritable: false`) but the program tries to modify its data or lamports, the transaction will fail with an `AccountNotWritable` error."),
    heading("Versioned Transactions & Lookup Tables", "h2"),
    para(
      "Classic (legacy) transactions can reference a maximum of 32 unique accounts. Versioned transactions (version 0) paired with Address Lookup Tables (ALTs) can reference up to 256 accounts, enabling complex DeFi operations in a single atomic transaction."
    ),
    codeBlock(
      "typescript",
      `import {
  Connection,
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
} from "@solana/web3.js";

// Build a versioned transaction (v0)
const { blockhash } = await connection.getLatestBlockhash();

const message = new TransactionMessage({
  payerKey: payer.publicKey,
  recentBlockhash: blockhash,
  instructions: [transferIx],
}).compileToV0Message();

// Optionally pass Address Lookup Tables:
// .compileToV0Message([lookupTable])

const versionedTx = new VersionedTransaction(message);
versionedTx.sign([payer]);`
    ),
    heading("Transaction Fees & Compute Units", "h2"),
    para(
      "Solana transactions pay two types of fees: (1) a base fee of 5000 lamports per signature, and (2) a priority fee denominated in micro-lamports per compute unit (CU). Each transaction has a compute budget — by default 200,000 CUs, configurable up to 1.4M via the `ComputeBudgetProgram`."
    ),
    codeBlock(
      "typescript",
      `import { ComputeBudgetProgram } from "@solana/web3.js";

// Add compute budget instructions to set limits and priority fees
const setComputeLimit = ComputeBudgetProgram.setComputeUnitLimit({
  units: 300_000, // request 300k CUs
});

const setPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 50_000, // 0.05 lamports per CU priority fee
});

transaction.add(setComputeLimit, setPriorityFee, ...otherInstructions);`
    ),
    callout("tip", "During periods of high network congestion, adding a priority fee significantly improves transaction landing rates. Tools like Helius and Triton offer priority fee APIs that return optimal values in real time."),
    heading("Summary", "h2"),
    para(
      "Key takeaways: (1) transactions are atomic — all instructions succeed or none do, (2) each instruction targets a program with accounts and data, (3) account metas declare signer and writable flags, and (4) compute budget instructions let you tune CU limits and priority fees."
    ),
  ],
};

// ===========================================================================
// LESSONS — Module 2: Anchor Framework
// ===========================================================================

// ---------------------------------------------------------------------------
// Lesson 2.1: Setting Up Anchor  (lessonIndex 3)
// ---------------------------------------------------------------------------

const lesson_setting_up_anchor = {
  _id: "lesson-en-solana-fundamentals-2-1",
  _type: "lesson",
  title: "Setting Up Anchor",
  slug: { _type: "slug", current: "setting-up-anchor" },
  lessonIndex: 3,
  estimatedMinutes: 20,
  content: [
    heading("What is Anchor?", "h2"),
    para(
      "Anchor is the dominant framework for Solana smart contract development. It provides a Rust DSL (Domain-Specific Language) that eliminates the boilerplate of raw Solana programs: account validation, serialization, error handling, and IDL generation are handled automatically."
    ),
    callout("info", "Over 90% of new Solana programs use Anchor. Learning it is essential for professional Solana development. The Anchor version used throughout this course is 0.31.x."),
    heading("Installation Prerequisites", "h2"),
    para("Before installing Anchor, ensure you have the following installed:"),
    codeBlock(
      "bash",
      `# 1. Rust (via rustup)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup component add rustfmt clippy

# 2. Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Verify Solana CLI
solana --version  # should print solana-cli 2.x.x

# 3. Node.js 18+
# Use nvm, fnm, or your package manager of choice`
    ),
    heading("Installing Anchor CLI", "h2"),
    codeBlock(
      "bash",
      `# Install Anchor Version Manager (avm) — the recommended approach
cargo install --git https://github.com/coral-xyz/anchor avm --locked

# Install and use latest stable Anchor
avm install latest
avm use latest

# Verify
anchor --version  # should print anchor-cli 0.31.x`
    ),
    heading("Creating Your First Anchor Project", "h2"),
    codeBlock(
      "bash",
      `# Initialize a new Anchor workspace
anchor init my-solana-program
cd my-solana-program

# Project structure:
# ├── Anchor.toml          — workspace config (cluster, program IDs)
# ├── Cargo.toml           — Rust workspace manifest
# ├── package.json         — Node.js dev dependencies
# ├── programs/
# │   └── my-solana-program/
# │       └── src/
# │           └── lib.rs   — your program code lives here
# └── tests/
#     └── my-solana-program.ts  — TypeScript integration tests`
    ),
    heading("Anchor.toml Configuration", "h2"),
    para(
      "Anchor.toml is the workspace configuration file. It maps program names to their public keys and configures the target cluster for builds and tests."
    ),
    codeBlock(
      "toml",
      `[toolchain]
anchor_version = "0.31.0"

[features]
resolution = true
skip-lint = false

[programs.localnet]
my_solana_program = "Fg6PaFpoGXkYsidMpWxTWqFd5TdkHWC8xQGRi6nifn"

[programs.devnet]
my_solana_program = "YourActualProgramIdAfterDeployment11111111111"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"`
    ),
    heading("The Minimal Anchor Program", "h2"),
    para(
      "Every Anchor program starts with a few required macros. Here's the minimal structure:"
    ),
    codeBlock(
      "rust",
      `use anchor_lang::prelude::*;

// Declares this program's on-chain address.
// Replace with your actual program ID after: anchor keys list
declare_id!("Fg6PaFpoGXkYsidMpWxTWqFd5TdkHWC8xQGRi6nifn");

// The #[program] attribute marks this module as containing
// all callable instruction handlers.
#[program]
pub mod my_solana_program {
    use super::*;

    // Each pub fn is an instruction. Context<T> carries all accounts.
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Program initialized!");
        Ok(())
    }
}

// An accounts struct declares which accounts the instruction needs.
// Anchor validates, deserializes, and checks ownership automatically.
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}`
    ),
    heading("Building and Testing", "h2"),
    codeBlock(
      "bash",
      `# Build all programs in the workspace
anchor build

# Run a local validator and execute all tests
anchor test

# Run tests against an already-running validator
anchor test --skip-local-validator

# Deploy to devnet
anchor deploy --provider.cluster devnet`
    ),
    callout("tip", "Run `anchor test` frequently during development. It spins up a local validator, deploys your program, and runs the TypeScript test suite — all in one command. The full cycle takes under 30 seconds for small programs."),
    heading("IDL — Interface Definition Language", "h2"),
    para(
      "After `anchor build`, Anchor generates an IDL JSON file at `target/idl/<program_name>.json`. This IDL describes your program's instructions, accounts, and types — it's the ABI of a Solana program. Client code uses it to encode/decode instructions automatically."
    ),
  ],
};

// ---------------------------------------------------------------------------
// Lesson 2.2: Your First Program  (lessonIndex 4, with challenge)
// ---------------------------------------------------------------------------

const lesson_your_first_program = {
  _id: "lesson-en-solana-fundamentals-2-2",
  _type: "lesson",
  title: "Your First Program",
  slug: { _type: "slug", current: "your-first-anchor-program" },
  lessonIndex: 4,
  estimatedMinutes: 30,
  challenge: { _type: "reference", _ref: "challenge-anchor-hello-world-program" },
  content: [
    heading("Writing a Counter Program", "h2"),
    para(
      "We'll build a counter program — simple enough to understand completely, yet covers all core Anchor concepts: account initialization, state mutation, and error handling. By the end of this lesson you'll deploy it to devnet."
    ),
    heading("The Counter Account", "h2"),
    para(
      "Our program needs to store a counter value on-chain. We define it as an Anchor account struct — Anchor handles serialization and discriminator injection automatically."
    ),
    codeBlock(
      "rust",
      `use anchor_lang::prelude::*;

declare_id!("CounterXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

// The #[account] macro:
// 1. Derives BorshSerialize and BorshDeserialize for on-chain serialization
// 2. Prepends an 8-byte discriminator (SHA256 hash of "account:<TypeName>")
//    so the runtime can distinguish account types
#[account]
pub struct Counter {
    pub count:     u64,   // 8 bytes
    pub authority: Pubkey, // 32 bytes
    pub bump:      u8,    // 1 byte — canonical PDA bump
}

impl Counter {
    // Total space = 8 (discriminator) + 8 + 32 + 1 = 49 bytes
    pub const INIT_SPACE: usize = 8 + 32 + 1;
}`
    ),
    heading("Program Instructions", "h2"),
    codeBlock(
      "rust",
      `#[program]
pub mod counter {
    use super::*;

    /// Initialize a new counter at a PDA derived from the authority's pubkey.
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count     = 0;
        counter.authority = ctx.accounts.authority.key();
        counter.bump      = ctx.bumps.counter; // store canonical bump
        msg!("Counter initialized. Authority: {}", counter.authority);
        Ok(())
    }

    /// Increment the counter by 1. Only the authority may call this.
    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count
            .checked_add(1)
            .ok_or(CounterError::Overflow)?;
        msg!("Counter incremented to: {}", counter.count);
        Ok(())
    }

    /// Reset the counter to zero. Only the authority may call this.
    pub fn reset(ctx: Context<Increment>) -> Result<()> {
        ctx.accounts.counter.count = 0;
        msg!("Counter reset to zero");
        Ok(())
    }
}

#[error_code]
pub enum CounterError {
    #[msg("Counter overflowed u64::MAX")]
    Overflow,
}`
    ),
    heading("Accounts Structs", "h2"),
    para(
      "The accounts struct for `initialize` uses Anchor constraints to initialize the PDA and ensure the authority pays for rent:"
    ),
    codeBlock(
      "rust",
      `#[derive(Accounts)]
pub struct Initialize<'info> {
    /// The counter PDA derived from ["counter", authority.key()]
    #[account(
        init,                                    // create account if it doesn't exist
        payer = authority,                       // authority pays rent
        space = 8 + Counter::INIT_SPACE,         // discriminator + data
        seeds = [b"counter", authority.key().as_ref()],
        bump                                     // Anchor finds canonical bump
    )]
    pub counter: Account<'info, Counter>,

    #[account(mut)]                              // mut: pays lamports for rent
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,  // required for account creation
}

#[derive(Accounts)]
pub struct Increment<'info> {
    /// The counter must exist and be owned by this program.
    /// has_one = authority ensures counter.authority == authority.key()
    #[account(
        mut,
        seeds = [b"counter", authority.key().as_ref()],
        bump = counter.bump,                     // use stored bump (cheaper than re-finding)
        has_one = authority @ CounterError::Overflow  // custom error on mismatch
    )]
    pub counter: Account<'info, Counter>,

    pub authority: Signer<'info>,
}`
    ),
    heading("TypeScript Client", "h2"),
    para(
      "Anchor auto-generates a TypeScript client from the IDL. Here's how you'd call your counter program from a dapp:"
    ),
    codeBlock(
      "typescript",
      `import { AnchorProvider, Program, web3, BN } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import idl from "./target/idl/counter.json";

// Setup provider
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const wallet = /* your wallet adapter */;
const provider = new AnchorProvider(connection, wallet, {});

// Create program instance
const program = new Program(idl as any, provider);
const programId = program.programId;

// Derive counter PDA
const [counterPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter"), wallet.publicKey.toBuffer()],
  programId
);

// Initialize counter
const initTx = await program.methods
  .initialize()
  .accounts({
    counter: counterPda,
    authority: wallet.publicKey,
    systemProgram: web3.SystemProgram.programId,
  })
  .rpc();
console.log("Initialized. Tx:", initTx);

// Increment counter
const incrTx = await program.methods
  .increment()
  .accounts({ counter: counterPda, authority: wallet.publicKey })
  .rpc();
console.log("Incremented. Tx:", incrTx);

// Read state
const counterAccount = await program.account.counter.fetch(counterPda);
console.log("Count:", counterAccount.count.toNumber());`
    ),
    callout("tip", "Use `.instruction()` instead of `.rpc()` when you want to build the instruction without sending it — useful for bundling multiple instructions into a single transaction."),
    heading("Coding Challenge: Implement say_hello", "h2"),
    para(
      "Before building the full counter, let's solidify your understanding of Anchor's structure. Implement the `say_hello` instruction handler below — it should log \"Hello, Solana!\" and return Ok(()). This exercise gets you comfortable with the Anchor instruction signature and the msg!() macro."
    ),
  ],
};

// ---------------------------------------------------------------------------
// Lesson 2.3: PDAs & CPIs  (lessonIndex 5)
// ---------------------------------------------------------------------------

const lesson_pdas_cpis = {
  _id: "lesson-en-solana-fundamentals-2-3",
  _type: "lesson",
  title: "PDAs & CPIs",
  slug: { _type: "slug", current: "pdas-and-cpis" },
  lessonIndex: 5,
  estimatedMinutes: 35,
  content: [
    heading("Program Derived Addresses (PDAs)", "h2"),
    para(
      "PDAs are deterministic addresses derived from seeds and a program ID. They are not on the ed25519 elliptic curve — meaning they have no corresponding private key. Only the program that derived them can sign on their behalf using `invoke_signed` (or Anchor's CPI helpers)."
    ),
    heading("How PDA Derivation Works", "h2"),
    codeBlock(
      "typescript",
      `import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("YourProgramId11111111111111111111111111111111");

// findProgramAddressSync tries bumps from 255 down to 0
// until it finds one that produces an off-curve address.
// The highest valid bump is the "canonical bump" — always use this one.
const [pda, bump] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("user-profile"), // string seed
    wallet.publicKey.toBuffer(), // pubkey seed
  ],
  programId
);

console.log("PDA:", pda.toBase58());
console.log("Canonical bump:", bump); // always 255 or slightly lower`
    ),
    callout("info", "Always store the canonical bump in your account struct and pass it back when deriving the PDA again. Re-finding the bump on every call wastes compute units."),
    heading("PDAs in Anchor", "h2"),
    codeBlock(
      "rust",
      `use anchor_lang::prelude::*;

#[account]
pub struct UserProfile {
    pub owner:  Pubkey,
    pub xp:     u64,
    pub level:  u8,
    pub bump:   u8,
}

impl UserProfile {
    pub const INIT_SPACE: usize = 32 + 8 + 1 + 1;
}

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    // Anchor derives, creates, and validates this PDA automatically.
    // seeds and bump must match what you passed to findProgramAddressSync.
    #[account(
        init,
        payer = user,
        space = 8 + UserProfile::INIT_SPACE,
        seeds = [b"user-profile", user.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn create_profile(ctx: Context<CreateProfile>) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    profile.owner = ctx.accounts.user.key();
    profile.xp    = 0;
    profile.level = 1;
    profile.bump  = ctx.bumps.profile; // store canonical bump!
    Ok(())
}`
    ),
    heading("Cross-Program Invocations (CPIs)", "h2"),
    para(
      "CPIs allow your program to call other programs' instructions. The most common use case is transferring SOL via the System Program or minting tokens via the Token Program. From the callee program's perspective, a CPI looks identical to a regular instruction call."
    ),
    codeBlock(
      "rust",
      `use anchor_lang::prelude::*;
use anchor_lang::system_program;

// Transfer SOL from a user account to a recipient via CPI
pub fn tip_creator(ctx: Context<TipCreator>, amount: u64) -> Result<()> {
    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.tipper.to_account_info(),
            to:   ctx.accounts.creator.to_account_info(),
        },
    );
    system_program::transfer(cpi_ctx, amount)?;
    msg!("Tipped {} lamports to creator", amount);
    Ok(())
}

#[derive(Accounts)]
pub struct TipCreator<'info> {
    #[account(mut)]
    pub tipper: Signer<'info>,
    /// CHECK: recipient wallet — SOL transfer doesn't require ownership check
    #[account(mut)]
    pub creator: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}`
    ),
    heading("CPI with PDA Signer (invoke_signed)", "h2"),
    para(
      "When the 'from' account is a PDA (not a regular signer), you must use `CpiContext::new_with_signer` and pass the seeds so the runtime can verify the PDA's authority."
    ),
    codeBlock(
      "rust",
      `// Transfer SOL FROM a PDA vault (the PDA signs via signer_seeds)
pub fn withdraw_from_vault(ctx: Context<WithdrawVault>, amount: u64) -> Result<()> {
    let vault = &ctx.accounts.vault;
    let authority_key = ctx.accounts.authority.key();

    // Reconstruct signer seeds — must match how the PDA was derived
    let seeds = &[
        b"vault".as_ref(),
        authority_key.as_ref(),
        &[vault.bump], // use stored canonical bump
    ];
    let signer_seeds = &[seeds.as_slice()];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to:   ctx.accounts.authority.to_account_info(),
        },
        signer_seeds, // the runtime verifies these seeds produce the vault PDA
    );

    system_program::transfer(cpi_ctx, amount)?;
    Ok(())
}`
    ),
    callout("warning", "After a CPI that modifies an account your program also holds a reference to, call `account.reload()` to re-read the updated data. Stale references can cause subtle bugs."),
    heading("Practical Example: Minting SPL Tokens via CPI", "h2"),
    codeBlock(
      "rust",
      `use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, Token};

pub fn mint_reward(ctx: Context<MintReward>, amount: u64) -> Result<()> {
    // The mint authority is a PDA — must use new_with_signer
    let bump = ctx.accounts.mint_authority.bump;
    let seeds = &[b"mint-authority".as_ref(), &[bump]];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
            mint:      ctx.accounts.mint.to_account_info(),
            to:        ctx.accounts.destination.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        },
        &[seeds],
    );

    token::mint_to(cpi_ctx, amount)?;
    msg!("Minted {} tokens", amount);
    Ok(())
}`
    ),
    heading("Summary", "h2"),
    para(
      "PDAs are the foundation of Solana's account ownership model — they give programs their own deterministic namespaces for state without needing private keys. CPIs compose programs together, enabling the rich ecosystem of DeFi protocols, NFT platforms, and DAOs that define the Solana ecosystem."
    ),
    para(
      "Congratulations on completing the Solana Fundamentals course! You now have the building blocks to start writing production Anchor programs. The next step is the 'Token Program Deep Dive' course where you'll build a full SPL token with staking mechanics."
    ),
  ],
};

// ===========================================================================
// MODULES
// ===========================================================================

const module_blockchain_basics = {
  _id: "module-en-solana-fundamentals-1",
  _type: "module",
  title: "Blockchain Basics",
  slug: { _type: "slug", current: "blockchain-basics" },
  description: "Understand Solana's architecture, account model, and transaction system from the ground up.",
  order: 1,
  lessons: [
    { _type: "reference", _ref: lesson_what_is_solana._id },
    { _type: "reference", _ref: lesson_accounts_lamports._id },
    { _type: "reference", _ref: lesson_transactions_instructions._id },
  ],
};

const module_anchor_framework = {
  _id: "module-en-solana-fundamentals-2",
  _type: "module",
  title: "Anchor Framework",
  slug: { _type: "slug", current: "anchor-framework" },
  description: "Build production-ready Solana programs using the Anchor framework — from setup to PDAs and CPIs.",
  order: 2,
  lessons: [
    { _type: "reference", _ref: lesson_setting_up_anchor._id },
    { _type: "reference", _ref: lesson_your_first_program._id },
    { _type: "reference", _ref: lesson_pdas_cpis._id },
  ],
};

// ===========================================================================
// COURSE — English (primary)
// ===========================================================================

const course_en = {
  _id: "course-en-solana-fundamentals",
  _type: "course",
  title: "Solana Fundamentals",
  slug: { _type: "slug", current: "solana-fundamentals" },
  description: "Learn Solana blockchain development from scratch. This course takes you from zero — understanding Solana's unique architecture — to writing and deploying your first Anchor programs. You'll work with accounts, lamports, transactions, PDAs, and CPIs through a mix of conceptual lessons and hands-on coding challenges.",
  difficulty: 1,
  trackId: 1,
  onChainCourseId: "course-solana-fundamentals-v1",
  xpPerLesson: 75,
  xpPerCourseCompletion: 500,
  tags: ["solana", "blockchain", "anchor", "web3", "rust", "typescript", "beginner"],
  prerequisites: [],
  locale: "en",
  status: "published",
  instructor: { _type: "reference", _ref: instructor._id },
  modules: [
    { _type: "reference", _ref: module_blockchain_basics._id },
    { _type: "reference", _ref: module_anchor_framework._id },
  ],
  lessons: [
    { _type: "reference", _ref: lesson_what_is_solana._id },
    { _type: "reference", _ref: lesson_accounts_lamports._id },
    { _type: "reference", _ref: lesson_transactions_instructions._id },
    { _type: "reference", _ref: lesson_setting_up_anchor._id },
    { _type: "reference", _ref: lesson_your_first_program._id },
    { _type: "reference", _ref: lesson_pdas_cpis._id },
  ],
};

// ===========================================================================
// COURSE — Portuguese pt-BR (translation stub)
// ===========================================================================

// Stub lessons — minimal content pointing to the same challenges.
// A translator would flesh these out with full pt-BR content.

const lesson_what_is_solana_ptbr = {
  _id: "lesson-ptbr-solana-fundamentals-1-1",
  _type: "lesson",
  title: "O que é Solana?",
  slug: { _type: "slug", current: "o-que-e-solana" },
  lessonIndex: 0,
  estimatedMinutes: 15,
  content: [
    heading("Bem-vindo ao Desenvolvimento Solana", "h2"),
    para(
      "Solana é uma blockchain Layer 1 de alto desempenho capaz de processar mais de 65.000 transações por segundo (TPS) com finalidade sub-segundo e taxas de transação quase nulas. Foi fundada em 2017 por Anatoly Yakovenko e lançou sua mainnet em março de 2020."
    ),
    callout("info", "[Conteúdo completo em pt-BR em desenvolvimento. Consulte a versão em inglês para o conteúdo completo desta aula.]"),
    para(
      "A principal inovação da Solana é a Prova de Histórico (PoH — Proof of History), um relógio criptográfico que permite aos validadores concordarem sobre a passagem do tempo sem comunicação direta. Isso possibilita processamento paralelo de transações em escala."
    ),
  ],
};

const lesson_accounts_lamports_ptbr = {
  _id: "lesson-ptbr-solana-fundamentals-1-2",
  _type: "lesson",
  title: "Contas & Lamports",
  slug: { _type: "slug", current: "contas-e-lamports" },
  lessonIndex: 1,
  estimatedMinutes: 20,
  challenge: { _type: "reference", _ref: "challenge-read-account-balance" },
  content: [
    heading("Tudo é uma Conta", "h2"),
    para(
      "Na Solana, cada dado — uma carteira, um saldo de token, o bytecode de um programa, ou o estado de um aplicativo — reside em uma conta. Não existem 'storage slots de contrato' como no Ethereum."
    ),
    callout("info", "[Conteúdo completo em pt-BR em desenvolvimento. Consulte a versão em inglês para o conteúdo completo desta aula.]"),
    codeBlock(
      "typescript",
      `import { LAMPORTS_PER_SOL } from "@solana/web3.js";

// 1 SOL = 1.000.000.000 lamports
const umSol  = 1 * LAMPORTS_PER_SOL;   // 1_000_000_000 lamports
const meiSol = 0.5 * LAMPORTS_PER_SOL; //   500_000_000 lamports`
    ),
  ],
};

const lesson_transactions_ptbr = {
  _id: "lesson-ptbr-solana-fundamentals-1-3",
  _type: "lesson",
  title: "Transações & Instruções",
  slug: { _type: "slug", current: "transacoes-e-instrucoes" },
  lessonIndex: 2,
  estimatedMinutes: 25,
  content: [
    heading("Transações: Bundles Atômicos de Instruções", "h2"),
    para(
      "Uma transação Solana é um bundle assinado de uma ou mais instruções que executa atomicamente — ou todas as instruções têm sucesso, ou nenhuma delas tem."
    ),
    callout("info", "[Conteúdo completo em pt-BR em desenvolvimento. Consulte a versão em inglês para o conteúdo completo desta aula.]"),
  ],
};

const lesson_setting_up_anchor_ptbr = {
  _id: "lesson-ptbr-solana-fundamentals-2-1",
  _type: "lesson",
  title: "Configurando o Anchor",
  slug: { _type: "slug", current: "configurando-o-anchor" },
  lessonIndex: 3,
  estimatedMinutes: 20,
  content: [
    heading("O que é Anchor?", "h2"),
    para(
      "Anchor é o framework dominante para desenvolvimento de smart contracts na Solana. Ele fornece uma DSL em Rust que elimina o boilerplate de programas Solana puros: validação de contas, serialização, tratamento de erros e geração de IDL são tratados automaticamente."
    ),
    callout("info", "[Conteúdo completo em pt-BR em desenvolvimento. Consulte a versão em inglês para o conteúdo completo desta aula.]"),
  ],
};

const lesson_first_program_ptbr = {
  _id: "lesson-ptbr-solana-fundamentals-2-2",
  _type: "lesson",
  title: "Seu Primeiro Programa",
  slug: { _type: "slug", current: "seu-primeiro-programa-anchor" },
  lessonIndex: 4,
  estimatedMinutes: 30,
  challenge: { _type: "reference", _ref: "challenge-anchor-hello-world-program" },
  content: [
    heading("Escrevendo um Programa Contador", "h2"),
    para(
      "Vamos construir um programa contador — simples o suficiente para entender completamente, mas que cobre todos os conceitos centrais do Anchor: inicialização de conta, mutação de estado e tratamento de erros."
    ),
    callout("info", "[Conteúdo completo em pt-BR em desenvolvimento. Consulte a versão em inglês para o conteúdo completo desta aula.]"),
  ],
};

const lesson_pdas_cpis_ptbr = {
  _id: "lesson-ptbr-solana-fundamentals-2-3",
  _type: "lesson",
  title: "PDAs & CPIs",
  slug: { _type: "slug", current: "pdas-e-cpis" },
  lessonIndex: 5,
  estimatedMinutes: 35,
  content: [
    heading("Program Derived Addresses (PDAs)", "h2"),
    para(
      "PDAs são endereços determinísticos derivados de seeds e um program ID. Eles não estão na curva elíptica ed25519 — o que significa que não possuem chave privada correspondente. Somente o programa que os derivou pode assinar em seu nome."
    ),
    callout("info", "[Conteúdo completo em pt-BR em desenvolvimento. Consulte a versão em inglês para o conteúdo completo desta aula.]"),
  ],
};

const module_blockchain_basics_ptbr = {
  _id: "module-ptbr-solana-fundamentals-1",
  _type: "module",
  title: "Fundamentos de Blockchain",
  slug: { _type: "slug", current: "fundamentos-de-blockchain" },
  description: "Entenda a arquitetura da Solana, o modelo de contas e o sistema de transações do zero.",
  order: 1,
  lessons: [
    { _type: "reference", _ref: lesson_what_is_solana_ptbr._id },
    { _type: "reference", _ref: lesson_accounts_lamports_ptbr._id },
    { _type: "reference", _ref: lesson_transactions_ptbr._id },
  ],
};

const module_anchor_framework_ptbr = {
  _id: "module-ptbr-solana-fundamentals-2",
  _type: "module",
  title: "Framework Anchor",
  slug: { _type: "slug", current: "framework-anchor" },
  description: "Construa programas Solana prontos para produção usando o framework Anchor — da configuração a PDAs e CPIs.",
  order: 2,
  lessons: [
    { _type: "reference", _ref: lesson_setting_up_anchor_ptbr._id },
    { _type: "reference", _ref: lesson_first_program_ptbr._id },
    { _type: "reference", _ref: lesson_pdas_cpis_ptbr._id },
  ],
};

const course_ptbr = {
  _id: "course-ptbr-solana-fundamentals",
  _type: "course",
  title: "Fundamentos de Solana",
  slug: { _type: "slug", current: "fundamentos-de-solana" },
  description: "Aprenda desenvolvimento blockchain Solana do zero. Este curso leva você desde a compreensão da arquitetura única da Solana até escrever e implantar seus primeiros programas Anchor.",
  difficulty: 1,
  trackId: 1,
  onChainCourseId: "course-solana-fundamentals-v1",
  xpPerLesson: 75,
  xpPerCourseCompletion: 500,
  tags: ["solana", "blockchain", "anchor", "web3", "rust", "typescript", "iniciante"],
  prerequisites: [],
  locale: "pt-BR",
  status: "published",
  instructor: { _type: "reference", _ref: instructor._id },
  modules: [
    { _type: "reference", _ref: module_blockchain_basics_ptbr._id },
    { _type: "reference", _ref: module_anchor_framework_ptbr._id },
  ],
  lessons: [
    { _type: "reference", _ref: lesson_what_is_solana_ptbr._id },
    { _type: "reference", _ref: lesson_accounts_lamports_ptbr._id },
    { _type: "reference", _ref: lesson_transactions_ptbr._id },
    { _type: "reference", _ref: lesson_setting_up_anchor_ptbr._id },
    { _type: "reference", _ref: lesson_first_program_ptbr._id },
    { _type: "reference", _ref: lesson_pdas_cpis_ptbr._id },
  ],
};

// ===========================================================================
// Seed execution
// ===========================================================================

const ALL_DOCS = [
  // Instructor
  { label: "instructor",  doc: instructor },
  // Challenges
  { label: "challenge",   doc: challenge_read_balance },
  { label: "challenge",   doc: challenge_anchor_hello_world },
  // EN Lessons
  { label: "lesson [en]", doc: lesson_what_is_solana },
  { label: "lesson [en]", doc: lesson_accounts_lamports },
  { label: "lesson [en]", doc: lesson_transactions_instructions },
  { label: "lesson [en]", doc: lesson_setting_up_anchor },
  { label: "lesson [en]", doc: lesson_your_first_program },
  { label: "lesson [en]", doc: lesson_pdas_cpis },
  // EN Modules
  { label: "module [en]", doc: module_blockchain_basics },
  { label: "module [en]", doc: module_anchor_framework },
  // EN Course
  { label: "course [en]", doc: course_en },
  // pt-BR Lessons
  { label: "lesson [pt]", doc: lesson_what_is_solana_ptbr },
  { label: "lesson [pt]", doc: lesson_accounts_lamports_ptbr },
  { label: "lesson [pt]", doc: lesson_transactions_ptbr },
  { label: "lesson [pt]", doc: lesson_setting_up_anchor_ptbr },
  { label: "lesson [pt]", doc: lesson_first_program_ptbr },
  { label: "lesson [pt]", doc: lesson_pdas_cpis_ptbr },
  // pt-BR Modules
  { label: "module [pt]", doc: module_blockchain_basics_ptbr },
  { label: "module [pt]", doc: module_anchor_framework_ptbr },
  // pt-BR Course
  { label: "course [pt]", doc: course_ptbr },
];

async function checkExists(id) {
  const existing = await client.fetch(`*[_id == $id][0]._id`, { id });
  return existing != null;
}

async function seed() {
  console.log("\n========================================");
  console.log("  Superteam Academy — Course Seed Script");
  console.log("========================================");
  console.log(`  Project ID : ${projectId}`);
  console.log(`  Dataset    : ${dataset}`);
  console.log(`  Documents  : ${ALL_DOCS.length}`);
  console.log("----------------------------------------\n");

  // Idempotency check — warn if the primary course already exists
  const courseAlreadyExists = await checkExists(course_en._id);
  if (courseAlreadyExists) {
    console.log(
      `[NOTE] Course "${course_en._id}" already exists in Sanity.\n` +
      `       Running createOrReplace — all documents will be updated in place.\n`
    );
  }

  let created = 0;
  let errors  = 0;

  for (const { label, doc } of ALL_DOCS) {
    try {
      const result = await client.createOrReplace(doc);
      const name = doc.title ?? doc._id;
      console.log(`  [OK] ${label.padEnd(14)} ${result._id.padEnd(48)} "${name}"`);
      created++;
    } catch (err) {
      console.error(`  [ERR] ${doc._type} ${doc._id}:`);
      console.error(`         ${err.message}`);
      errors++;
    }
  }

  console.log("\n----------------------------------------");
  console.log(`  Created / updated : ${created}`);

  if (errors > 0) {
    console.error(`  Errors            : ${errors}`);
    console.error("\n[FAIL] Some documents failed to seed. Check errors above.\n");
    process.exit(1);
  }

  console.log("\n[OK] Seeding complete!\n");
  console.log("  Courses created:");
  console.log(`    - English : /learn/en/solana-fundamentals`);
  console.log(`    - pt-BR   : /learn/pt-BR/fundamentos-de-solana`);
  console.log("\n  Modules: 2 (Blockchain Basics + Anchor Framework)");
  console.log("  Lessons: 6 EN + 6 pt-BR = 12 total");
  console.log("  Challenges: 2 (Read Account Balance + Anchor Hello World)");
  console.log("");
}

seed().catch((err) => {
  console.error("\n[FATAL]", err);
  process.exit(1);
});

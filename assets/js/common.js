/* -------------------------------------------------------------
   CRYPTOGRAPHY FROM BASICS — SHARED CORE JAVASCRIPT
   Theme, Typography, Reading Progress, Checkpoints, & Global Search
------------------------------------------------------------- */

(function () {
  let savedTheme = 'paper';
  let savedFont = 'sans';
  try {
    savedTheme = localStorage.getItem('crypto_theme') || 'paper';
  } catch (e) {}
  try {
    savedFont = localStorage.getItem('crypto_font') || 'sans';
  } catch (e) {}

  setTheme(savedTheme, false);
  setFont(savedFont, false);

  // Setup Scroll Progress Bar
  window.addEventListener('scroll', updateReadingProgress);

  // DOM Ready Initializations
  document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNavLink();
    updateThemeUI(savedTheme);
    updateFontUI(savedFont);
    initGlobalSearch();
  });
})();

// Reading Progress
function updateReadingProgress() {
  const progressBar = document.getElementById('readingProgress');
  if (!progressBar) return;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) {
    progressBar.style.width = '0%';
    return;
  }
  const scrolled = (window.scrollY / docHeight) * 100;
  progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
}

// Theme Switcher
function setTheme(themeName, persist = true) {
  document.documentElement.setAttribute('data-theme', themeName);
  if (persist) {
    try {
      localStorage.setItem('crypto_theme', themeName);
    } catch (e) {}
  }
  updateThemeUI(themeName);
}

function updateThemeUI(themeName) {
  document.querySelectorAll('.theme-chip').forEach(chip => chip.classList.remove('active'));
  const activeBtn = document.getElementById('theme' + themeName.charAt(0).toUpperCase() + themeName.slice(1));
  if (activeBtn) activeBtn.classList.add('active');
}

// Font Switcher
function setFont(fontType, persist = true) {
  document.documentElement.setAttribute('data-font', fontType);
  if (persist) {
    try {
      localStorage.setItem('crypto_font', fontType);
    } catch (e) {}
  }
  updateFontUI(fontType);
}

function updateFontUI(fontType) {
  const btnSans = document.getElementById('btnSans');
  const btnSerif = document.getElementById('btnSerif');
  if (btnSans && btnSerif) {
    btnSans.classList.toggle('active', fontType === 'sans');
    btnSerif.classList.toggle('active', fontType === 'serif');
  }
}

// Sidebar Active Page Matcher
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith(currentPath)) {
      link.classList.add('active');
    }
  });
}

// Universal Checkpoint Quiz Engine
function handleQuiz(button, isCorrect, explanationText) {
  const parentCard = button.closest('.checkpoint-card') || button.parentElement.parentElement;
  const feedback = parentCard.querySelector('.feedback-note');
  const allButtons = parentCard.querySelectorAll('.choice-btn');

  allButtons.forEach(btn => {
    btn.style.opacity = '0.45';
    btn.disabled = true;
  });

  button.style.opacity = '1';
  if (feedback) {
    feedback.style.display = 'block';
    if (isCorrect) {
      button.classList.add('selected-correct');
      feedback.style.background = 'var(--accent-soft)';
      feedback.style.color = 'var(--accent-text)';
      feedback.style.border = '1px solid var(--accent-border)';
      feedback.innerHTML = '<strong>Correct.</strong> ' + explanationText;
    } else {
      button.style.borderColor = '#c53030';
      feedback.style.background = 'rgba(197, 48, 48, 0.08)';
      feedback.style.color = '#c53030';
      feedback.style.border = '1px solid rgba(197, 48, 48, 0.2)';
      feedback.innerHTML = '<strong>Not quite.</strong> ' + explanationText;
    }
  }
}

/* -------------------------------------------------------------
   UNIVERSAL CRYPTOGRAPHIC SEARCH & QUICK LAUNCHER (CTRL+K)
------------------------------------------------------------- */
const SEARCH_INDEX = [
  // Foundations
  { title: "CIA Triad & Non-Repudiation (CIA-R)", badge: "M01 Foundations", desc: "Confidentiality, Integrity, Availability, and Non-Repudiation pillars", path: "engineering-knowledge/m01-foundations.html#cia-triad", keywords: "cia confidentiality integrity availability non-repudiation triad pillars" },
  { title: "Kerckhoffs's Principle & Shannon Maxim", badge: "M01 Foundations", desc: "Why security through obscurity fails: the enemy knows the system", path: "engineering-knowledge/m01-foundations.html#kerckhoffs", keywords: "kerckhoffs shannon obscurity open design enemy knows system" },
  { title: "Threat Models & Cryptographic Adversaries", badge: "M01 Foundations", desc: "Ciphertext-only, Known-Plaintext, Chosen-Plaintext, Chosen-Ciphertext attacks", path: "engineering-knowledge/m01-foundations.html#threat-models", keywords: "adversary attack coa kpa cpa cca mitm passive active" },
  
  // Bits & Encoding
  { title: "Bits, Bytes, Hexadecimal & ASCII", badge: "M02 Encoding", desc: "Foundational computer representations and binary conversions", path: "engineering-knowledge/m02-bits-and-encoding.html#bits-hex", keywords: "bits bytes binary hex hexadecimal ascii nibble base16" },
  { title: "Base64 Encoding & 6-Bit Chunking", badge: "M02 Encoding", desc: "Representing raw binary data over 7-bit ASCII channels with padding", path: "engineering-knowledge/m02-bits-and-encoding.html#base64", keywords: "base64 encoding padding mime pem binary to text chunking" },
  { title: "XOR (Exclusive OR) Cryptographic Properties", badge: "M02 Encoding", desc: "Self-inversion, commutativity, and the backbone of all modern ciphers", path: "engineering-knowledge/m02-bits-and-encoding.html#xor-properties", keywords: "xor exclusive or self-inverse bitwise stream cipher reversibility" },
  
  // Steganography
  { title: "Steganography vs Encryption", badge: "M03 Steganography", desc: "Hiding data existence vs hiding data meaning", path: "engineering-knowledge/m03-steganography.html#steg-vs-crypto", keywords: "steganography hiding cover covert channel carrier" },
  { title: "LSB (Least Significant Bit) Image Injection", badge: "M03 Steganography", desc: "Modifying lowest-order color bits to conceal secret byte payloads", path: "engineering-knowledge/m03-steganography.html#lsb-deep", keywords: "lsb least significant bit pixel color rgb carrier steganalysis payload" },

  // Randomness
  { title: "Entropy, PRNGs & CSPRNGs", badge: "M04 Randomness", desc: "True entropy sources vs deterministic pseudo-random generators", path: "engineering-knowledge/m04-randomness-entropy.html#entropy-sources", keywords: "entropy randomness prng csprng urandom seed unpredictability trng" },
  { title: "The Dual-EC-DRBG Backdoor & Seed Compromise", badge: "M04 Randomness", desc: "How kleptographic backdoors and low entropy destroy key secrecy", path: "engineering-knowledge/m04-randomness-entropy.html#csprng-failures", keywords: "dual-ec-drbg backdoor nsa seed compromise debian openssl bug debian" },

  // Classical Ciphers
  { title: "Caesar & Vigenère Ciphers", badge: "M05 Classical", desc: "Monoalphabetic shifts and polyalphabetic keystreams", path: "engineering-knowledge/m05-classical-ciphers.html#caesar-vigenere", keywords: "caesar vigenere substitution shift polyalphabetic kasiski tabula recta" },
  { title: "Frequency Analysis & Cryptanalysis", badge: "M05 Classical", desc: "Cracking classical ciphers using letter frequency distributions", path: "engineering-knowledge/m05-classical-ciphers.html#frequency-analysis", keywords: "frequency analysis cryptanalysis etaoin shrdlu letter distribution index coincidence" },
  { title: "One-Time Pad (OTP) & Perfect Secrecy", badge: "M05 Classical", desc: "Information-theoretic security: key length >= message, truly random, never reused", path: "engineering-knowledge/m05-classical-ciphers.html#one-time-pad", keywords: "one time pad otp vernam perfect secrecy shannon unconditional vernam cipher" },

  // Symmetric & AES
  { title: "Block Ciphers vs Stream Ciphers", badge: "M06 Symmetric", desc: "Fixed 128-bit blocks vs continuous pseudo-random keystream XOR", path: "engineering-knowledge/m06-symmetric-aes.html#block-vs-stream", keywords: "block cipher stream cipher aes chacha20 keystream salsa20" },
  { title: "AES (Advanced Encryption Standard) Round Architecture", badge: "M06 Symmetric", desc: "SubBytes (S-Box confusion), ShiftRows & MixColumns (diffusion), AddRoundKey", path: "engineering-knowledge/m06-symmetric-aes.html#aes-internals", keywords: "aes rijndael subbytes shiftrows mixcolumns addroundkey sbox confusion diffusion 128 192 256" },
  { title: "Block Cipher Modes: ECB, CBC, CTR & GCM", badge: "M06 Symmetric", desc: "Why ECB is forbidden, CBC error propagation, and modern AEAD GCM", path: "engineering-knowledge/m06-symmetric-aes.html#block-modes-deep", keywords: "ecb cbc ctr gcm aead modes initialization vector iv authentication tag ghash" },
  { title: "Interactive Tamper Simulator Lab", badge: "M06 Symmetric", desc: "Hands-on experiment: flip 1 ciphertext bit and watch error propagation across modes", path: "engineering-knowledge/m06-symmetric-aes.html#tamper-simulator", keywords: "tamper simulator lab bit-flip malleability authentication tag dropped error propagation" },

  // Hashing & Integrity
  { title: "Cryptographic Hash Functions: SHA-256, SHA-3, BLAKE3", badge: "M07 Hashing", desc: "Pre-image resistance, collision resistance, and the avalanche effect", path: "engineering-knowledge/m07-hashing-integrity.html#hash-properties", keywords: "sha256 sha3 keccak blake3 avalanche collision pre-image digest md5 sha1 sha2" },
  { title: "HMAC (Keyed-Hash Message Authentication Code)", badge: "M07 Hashing", desc: "Why simple Hash(Key || Message) is vulnerable to Length Extension Attacks", path: "engineering-knowledge/m07-hashing-integrity.html#hmac-deep", keywords: "hmac length extension attack hash mac integrity authenticity secret key ipad opad" },
  { title: "Merkle Trees & Lightweight Cryptographic Proofs", badge: "M07 Hashing", desc: "How Git and distributed systems verify 1 file out of 100,000 using 32-byte hashes", path: "engineering-knowledge/m07-hashing-integrity.html#merkle-trees", keywords: "merkle tree merkle root proof git commit integrity distributed blockchain" },

  // Asymmetric & Public-Key
  { title: "Diffie-Hellman Key Exchange (DH & ECDH)", badge: "M08 Asymmetric", desc: "Establishing a shared secret over an insecure channel without transmitting the key", path: "engineering-knowledge/m08-asymmetric-diffie-hellman.html#diffie-hellman", keywords: "diffie hellman ecdh discrete log public key shared secret x25519 color mixing" },
  { title: "RSA Cryptosystem & Prime Factorization", badge: "M08 Asymmetric", desc: "Trapdoor one-way functions, Euler's totient, modular exponentiation", path: "engineering-knowledge/m08-asymmetric-diffie-hellman.html#rsa-deep", keywords: "rsa prime factorization modular exponentiation public private key euler totient trapdoor" },
  { title: "Elliptic Curve Cryptography (ECC & Curve25519)", badge: "M08 Asymmetric", desc: "Point multiplication on Weierstrass and Montgomery curves for smaller, faster keys", path: "engineering-knowledge/m08-asymmetric-diffie-hellman.html#ecc-deep", keywords: "elliptic curve ecc curve25519 p256 point addition scalar multiplication secp256k1" },

  // Signatures & PKI
  { title: "Digital Signatures: Ed25519 & ECDSA", badge: "M09 Signatures", desc: "Authenticity and non-repudiation: sign with private key, verify with public key", path: "engineering-knowledge/m09-signatures-pki.html#digital-signatures", keywords: "digital signatures ed25519 ecdsa rsa sign verify signature signature verification" },
  { title: "Public Key Infrastructure (PKI) & X.509", badge: "M09 Signatures", desc: "Certificate Authorities, trust chains, Root CAs, and Subject Alternative Names", path: "engineering-knowledge/m09-signatures-pki.html#pki-deep", keywords: "pki x509 certificate authority root ca intermediate chain san csr cert pem" },
  { title: "Certificate Revocation: CRL, OCSP & OCSP Stapling", badge: "M09 Signatures", desc: "How browsers detect compromised certificates without privacy leaks or latency", path: "engineering-knowledge/m09-signatures-pki.html#revocation-deep", keywords: "revocation crl ocsp stapling letsencrypt compromised certificate crl distribution" },

  // Key Vaults, KMS & Incident Response
  { title: "Key Derivation Functions: Argon2id, bcrypt, PBKDF2", badge: "M10 Key Vaults", desc: "Memory-hard password hashing to neutralize GPU, FPGA, and ASIC brute-force", path: "engineering-knowledge/m10-key-vaults-kdfs.html#kdf-simulator", keywords: "argon2id bcrypt pbkdf2 password hashing salt pepper cost factor scrypt kdf" },
  { title: "Hardware Security: HSMs, TPMs & Secure Enclaves", badge: "M10 Key Vaults", desc: "FIPS 140-3 physical silicon trust, Measured Boot, and zeroization circuits", path: "engineering-knowledge/m10-key-vaults-kdfs.html#hardware-security-deep", keywords: "hsm tpm secure enclave titan fips 140-3 measured boot zeroization hardware vault" },
  { title: "Cloud KMS & Envelope Encryption Architecture", badge: "M10 Key Vaults", desc: "DEKs (Data Encryption Keys) + KEKs (Key Encryption Keys) for petabyte-scale encryption", path: "engineering-knowledge/m10-key-vaults-kdfs.html#envelope-encryption", keywords: "envelope encryption kms kek dek aws kms hashicorp vault key management google cloud kms" },
  { title: "Cryptographic Incident Response & Key Compromise Playbook", badge: "M10 Key Vaults", desc: "Production triage, zero-downtime dual-key migration, and secret revocation runbook", path: "engineering-knowledge/m10-key-vaults-kdfs.html#incident-response-playbook", keywords: "incident response key compromise leak rotation playbook zero-downtime rekeying triage" },
  { title: "Seed Phrases & BIP-39 Derivation Trees", badge: "M10 Key Vaults", desc: "Master seed phrases, checksums, and hierarchical deterministic key generation", path: "engineering-knowledge/m10-key-vaults-kdfs.html#seed-phrases", keywords: "bip39 seed phrase mnemonic hierarchical deterministic wallet recovery bip44" },

  // Applied Protocols
  { title: "TLS 1.3 Handshake Protocol & Forward Secrecy", badge: "M11 Applied", desc: "1-RTT encrypted handshake, ephemeral Diffie-Hellman, and zero-round-trip resumption", path: "engineering-knowledge/m11-applied-https-tokens.html#tls-handshake", keywords: "tls 1.3 https handshake forward secrecy pfs session resumption sni cipher suite" },
  { title: "Token Authentication: JWT vs PASETO", badge: "M11 Applied", desc: "Why 'alg: none' ruined JWT, and how PASETO enforces cryptographic security", path: "engineering-knowledge/m11-applied-https-tokens.html#tokens-deep", keywords: "jwt paseto tokens alg none signature authorization bearer claims jws jwe" },
  { title: "SSH & WireGuard Cryptographic Architecture", badge: "M11 Applied", desc: "Noise protocol, modern ChaCha20-Poly1305 tunnels, and Ed25519 identity", path: "engineering-knowledge/m11-applied-https-tokens.html#wireguard-ssh", keywords: "ssh wireguard noise protocol vpn authorized_keys tunneling modern crypto" },

  // Quantum & ZKP
  { title: "Post-Quantum Cryptography: NIST Standards (ML-KEM & ML-DSA)", badge: "M12 Quantum & ZKP", desc: "Shor's algorithm threat and lattice-based post-quantum cryptography (Kyber & Dilithium)", path: "engineering-knowledge/m12-zkp-quantum-era.html#pqc-deep", keywords: "post quantum pqc shor grover ml-kem kyber ml-dsa dilithium lattice nist quantum era" },
  { title: "Zero-Knowledge Proofs: zk-SNARKs & zk-STARKs Intuition", badge: "M12 Quantum & ZKP", desc: "Proving knowledge of a secret without revealing the secret itself", path: "engineering-knowledge/m12-zkp-quantum-era.html#zkp-deep", keywords: "zero knowledge zkp snark stark proof prover verifier succinct rollups" },

  // Module 13: Connected Topics & Public-Key Anatomy
  { title: "Anatomy of an X.509 Certificate (RFC 5280)", badge: "M13 Connected Topics", desc: "TBSCertificate dissection, Subject Alternative Name (SAN), Basic Constraints, and Key Usage", path: "engineering-knowledge/m13-misc-topics.html#x509-anatomy", keywords: "x509 certificate rfc 5280 san subject alternative name tbscertificate basic constraints eku" },
  { title: "Certificate Formats & Keystores: PEM, DER, PKCS#12, PKCS#7", badge: "M13 Connected Topics", desc: "Comparing Base64 PEM, raw binary DER, PKCS#7 chains, and password-encrypted PKCS#12 archives", path: "engineering-knowledge/m13-misc-topics.html#cert-formats", keywords: "pem der pkcs12 pfx pkcs7 p7b keystore jks certificate format conversion" },
  { title: "Cryptographic Serialization & Canonical Encodings (ASN.1 & DER)", badge: "M13 Connected Topics", desc: "Why non-deterministic JSON fails signature checks and how ASN.1 DER and CBOR guarantee unique bitstreams", path: "engineering-knowledge/m13-misc-topics.html#canonical-serialization", keywords: "asn1 der cbor serialization canonical encoding tlv distinguished encoding rules json" },
  { title: "Cryptographic Time: NTP Vulnerabilities, NTS & RFC 3161 TSP", badge: "M13 Connected Topics", desc: "Network Time Security (NTS) authenticated time and Timestamp Authorities for legal non-repudiation", path: "engineering-knowledge/m13-misc-topics.html#crypto-time", keywords: "time ntp nts network time security rfc 3161 tsp timestamp authority clock drift" },

  // Systems & Security Engineering Tracks
  { title: "Track 2: Operating System Fundamentals", badge: "Hub Track 02", desc: "Process lifecycles, virtual memory paging, CPU schedulers, file system inodes, and POSIX syscalls", path: "index.html#track-os-basics", keywords: "operating systems os processes threads virtual memory paging scheduling inodes syscalls ipc" },
  { title: "Track 3: OS Internals & Kernel Security", badge: "Hub Track 03", desc: "Ring 0 vs Ring 3, memory corruption, ASLR, DEP/NX, Linux capabilities, and eBPF tracing", path: "index.html#track-os-internals", keywords: "os internals kernel security ring 0 aslr dep nx buffer overflow ebpf selinux apparmor" },
  { title: "Track 4: Computer Networking & Protocols", badge: "Hub Track 04", desc: "TCP/IP stack, 3-way handshakes, congestion control, BGP routing, DNS, and WireGuard tunnels", path: "index.html#track-networking", keywords: "networking protocols tcp ip handshake bgp dns wireguard sockets congestion control" },
  { title: "Track 5: Hardware Architecture & Silicon", badge: "Hub Track 05", desc: "CPU instruction pipelines, branch prediction, L1/L2/L3 caches, MESI coherence, and MMU page tables", path: "index.html#track-hardware", keywords: "hardware architecture cpu pipeline cache mesi mmu page table uefi dma interrupts" },
  { title: "Track 6: Hardware Security & Silicon Trust", badge: "Hub Track 06", desc: "Spectre, Meltdown, Rowhammer, fault injection, voltage glitching, TPM 2.0, and Secure Enclaves", path: "index.html#track-hw-security", keywords: "hardware security spectre meltdown rowhammer fault injection tpm secure enclave glitching" },
  { title: "Track 7: Cloud Infrastructure Security", badge: "Hub Track 07", desc: "Zero-Trust architecture, Cloud IAM least privilege, VPC peering, container isolation, and Vault", path: "index.html#track-cloud-sec", keywords: "cloud security zero trust iam vpc container kubernetes vault mtls service mesh" },

  // CTF Engineering Tracks
  { title: "CTF Track 1: Starting CTF Knowledge & Problem Patterns", badge: "CTF Track 01", desc: "Flag discovery methodology, classical cipher reconnaissance (XOR, Caesar, Vigenère), and encoding detection", path: "ctf-01-starting-knowledge.html", keywords: "ctf capture the flag beginner patterns cyberchef pwntools recon xor caesar vigenere encoding base64 stego" },
  { title: "Interactive CTF Decryption Workbench", badge: "CTF Lab", desc: "Hands-on challenge lab: Multi-layer onion decoder, single-byte XOR breaker, and crib-dragging attack", path: "ctf-01-starting-knowledge.html#interactive-workbench", keywords: "ctf lab workbench onion decoder single byte xor frequency breaker crib dragging" },
  { title: "CTF Track 2: Intermediate CTF Cryptanalysis & Exploitation", badge: "CTF Track 02", desc: "CBC padding oracle attacks, ECB byte-at-a-time, RSA small exponent, PRNG state recovery, and hash length extension", path: "ctf-02-intermediate-cryptanalysis.html", keywords: "ctf intermediate cryptanalysis padding oracle ecb rsa factorisation mt19937 prng hash length extension jwt" },
  { title: "Intermediate Cryptanalysis Workbench", badge: "CTF Lab", desc: "Hands-on challenge lab: CBC padding oracle simulator, RSA e=3 integer cube root, and MT19937 untemper engine", path: "ctf-02-intermediate-cryptanalysis.html#interactive-workbench", keywords: "ctf lab workbench cbc padding oracle rsa small exponent cube root mt19937 mersenne twister untemper" },
  { title: "CTF Track 3: Curated CTF Problem Bank & Hands-on Challenges", badge: "CTF Track 03", desc: "Categorized CTF practice challenge bank spanning crypto, forensics, token exploits, and flag formats", path: "index.html#track-ctf-problems", keywords: "ctf problems challenge bank practice ctf crypto pcap forensics web jwt flag labs" },

  // Cheatsheets
  { title: "When to Use What — Master Decision Matrix", badge: "Cheatsheet", desc: "Head-to-head algorithm comparisons, NIST lifetime matrix, and the 10 Golden Rules", path: "cheatsheet.html", keywords: "cheatsheet decision matrix recommendations comparison golden rules when to use what" },
  { title: "OpenSSL 3.x Modern Command Handbook", badge: "OpenSSL", desc: "Intuitive command patterns for keys, certificates, HMACs, encryption, and TLS inspection", path: "openssl-cheatsheet.html", keywords: "openssl openssl 3 command cheatsheet req x509 genpkey dgst enc s_client s_server" }
];

let searchModalEl = null;
let searchInputEl = null;
let searchResultsEl = null;
let activeResultIndex = -1;
let filteredResults = [];

function initGlobalSearch() {
  if (!document.getElementById('searchModalOverlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'searchModalOverlay';
    overlay.innerHTML = `
      <div id="searchModalCard" onclick="event.stopPropagation()">
        <div id="searchModalHeader">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="searchModalInput" placeholder="Search algorithms, ciphers, RFCs, tools, or concepts..." autocomplete="off">
          <button id="searchModalClose" type="button" onclick="closeSearchModal()" title="Close (Esc)">&times;</button>
        </div>
        <div id="searchModalResults"></div>
        <div id="searchModalFooter">
          <span>Navigate with <kbd class="search-kbd">↑</kbd> <kbd class="search-kbd">↓</kbd></span>
          <span>Select <kbd class="search-kbd">Enter</kbd></span>
          <span>Close <kbd class="search-kbd">Esc</kbd></span>
        </div>
      </div>
    `;
    overlay.addEventListener('click', closeSearchModal);
    document.body.appendChild(overlay);
  }

  searchModalEl = document.getElementById('searchModalOverlay');
  searchInputEl = document.getElementById('searchModalInput');
  searchResultsEl = document.getElementById('searchModalResults');

  if (searchInputEl) {
    searchInputEl.addEventListener('input', handleSearchInput);
    searchInputEl.addEventListener('keydown', handleSearchKeydown);
  }

  // Keyboard shortcut listener
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleSearchModal();
    }
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape' && searchModalEl && searchModalEl.classList.contains('active')) {
      closeSearchModal();
    }
  });

  renderSearchResults('');
}

function openSearchModal() {
  if (!searchModalEl) initGlobalSearch();
  searchModalEl.classList.add('active');
  if (searchInputEl) {
    searchInputEl.value = '';
    renderSearchResults('');
    setTimeout(() => searchInputEl.focus(), 50);
  }
}

function closeSearchModal() {
  if (searchModalEl) {
    searchModalEl.classList.remove('active');
  }
}

function toggleSearchModal() {
  if (searchModalEl && searchModalEl.classList.contains('active')) {
    closeSearchModal();
  } else {
    openSearchModal();
  }
}

function handleSearchInput(e) {
  renderSearchResults(e.target.value);
}

function handleSearchKeydown(e) {
  if (!filteredResults.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeResultIndex = (activeResultIndex + 1) % filteredResults.length;
    updateActiveResultUI();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeResultIndex = (activeResultIndex - 1 + filteredResults.length) % filteredResults.length;
    updateActiveResultUI();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (activeResultIndex >= 0 && activeResultIndex < filteredResults.length) {
      navigateToSearchResult(filteredResults[activeResultIndex]);
    }
  }
}

function updateActiveResultUI() {
  const items = searchResultsEl.querySelectorAll('.search-result-item');
  items.forEach((item, idx) => {
    if (idx === activeResultIndex) {
      item.classList.add('active');
      item.scrollIntoView({ block: 'nearest' });
    } else {
      item.classList.remove('active');
    }
  });
}

function renderSearchResults(query) {
  if (!searchResultsEl) return;
  const q = query.trim().toLowerCase();
  
  if (!q) {
    filteredResults = SEARCH_INDEX.slice(0, 8);
  } else {
    const scored = [];
    SEARCH_INDEX.forEach(item => {
      const titleLower = item.title.toLowerCase();
      const descLower = item.desc.toLowerCase();
      const badgeLower = item.badge.toLowerCase();
      const kwLower = item.keywords.toLowerCase();
      
      let score = 0;
      if (titleLower === q) score += 200;
      else if (titleLower.startsWith(q)) score += 150;
      else if (titleLower.includes(' ' + q) || titleLower.includes('(' + q)) score += 120;
      else if (titleLower.includes(q)) score += 40;

      if (kwLower.includes(q)) score += 60;
      if (descLower.includes(q)) score += 20;
      if (badgeLower.includes(q)) score += 20;

      if (score > 0) {
        scored.push({ item, score });
      }
    });

    scored.sort((a, b) => b.score - a.score);
    filteredResults = scored.map(s => s.item);
  }

  activeResultIndex = filteredResults.length > 0 ? 0 : -1;

  if (filteredResults.length === 0) {
    searchResultsEl.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13.5px;">No cryptographic concepts found matching "<strong>' + escapeHtml(query) + '</strong>".</div>';
    return;
  }

  const isInsideEngineering = window.location.pathname.includes('/engineering-knowledge/') || window.location.href.includes('/engineering-knowledge/');

  let html = '';
  filteredResults.forEach((item, idx) => {
    let resolvedPath = item.path;
    if (isInsideEngineering) {
      if (resolvedPath.startsWith('engineering-knowledge/')) {
        resolvedPath = resolvedPath.replace('engineering-knowledge/', '');
      } else {
        resolvedPath = '../' + resolvedPath;
      }
    } else {
      resolvedPath = item.path;
    }

    const isActive = idx === activeResultIndex ? ' active' : '';
    html += `
      <a href="${resolvedPath}" class="search-result-item${isActive}" onclick="closeSearchModal()">
        <div class="search-result-left">
          <span class="search-result-badge">${item.badge}</span>
          <div class="search-result-text">
            <div class="search-result-title">${escapeHtml(item.title)}</div>
            <div class="search-result-desc">${escapeHtml(item.desc)}</div>
          </div>
        </div>
        <span class="search-result-arrow">→</span>
      </a>
    `;
  });

  searchResultsEl.innerHTML = html;
}

function navigateToSearchResult(item) {
  const isInsideEngineering = window.location.pathname.includes('/engineering-knowledge/') || window.location.href.includes('/engineering-knowledge/');
  let resolvedPath = item.path;
  if (isInsideEngineering) {
    if (resolvedPath.startsWith('engineering-knowledge/')) {
      resolvedPath = resolvedPath.replace('engineering-knowledge/', '');
    } else {
      resolvedPath = '../' + resolvedPath;
    }
  }
  closeSearchModal();
  window.location.href = resolvedPath;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

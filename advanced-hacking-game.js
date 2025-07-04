#!/usr/bin/env node

import chalk from "chalk"
import chalkAnimation from "chalk-animation"
import figlet from "figlet"
import gradient from "gradient-string"
import inquirer from "inquirer"
import { createSpinner } from "nanospinner"
import fs from "fs/promises"

class AdvancedHackingGame {
  constructor() {
    this.playerName = ""
    this.score = 0
    this.level = 1
    this.maxLevel = 10
    this.lives = 5
    this.reputation = 0
    this.tools = new Set()
    this.achievements = new Set()
    this.difficulty = "normal"
    this.gameState = {
      currentMission: null,
      discoveredSystems: [],
      crackedPasswords: [],
      exploitedVulnerabilities: [],
      stolenData: [],
    }
    this.saveFile = "hacker_profile.json"
  }

  async sleep(ms = 2000) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async typeWriter(text, delay = 50) {
    for (let i = 0; i < text.length; i++) {
      process.stdout.write(text[i])
      await this.sleep(delay)
    }
    console.log()
  }

  async loadGame() {
    try {
      const data = await fs.readFile(this.saveFile, "utf8")
      const savedGame = JSON.parse(data)
      Object.assign(this, savedGame)
      this.tools = new Set(savedGame.tools)
      this.achievements = new Set(savedGame.achievements)
      return true
    } catch {
      return false
    }
  }

  async saveGame() {
    const gameData = {
      ...this,
      tools: Array.from(this.tools),
      achievements: Array.from(this.achievements),
    }
    try {
      await fs.writeFile(this.saveFile, JSON.stringify(gameData, null, 2))
      return true
    } catch {
      return false
    }
  }

  async welcome() {
    console.clear()

    const matrix = chalkAnimation.karaoke(
      figlet.textSync("NEXUS HACK", {
        font: "Cyberlarge",
        horizontalLayout: "default",
        verticalLayout: "default",
      }),
    )

    await this.sleep(4000)
    matrix.stop()

    console.log(`
${gradient.cristal.multiline(
  [
    "╔═══════════════════════════════════════════════════════╗",
    "║                 NEXUS HACK 2025                       ║",
    "║                                                       ║",
    "║        Advanced Cybersecurity Simulation              ║",
    "║                                                       ║",
    "║  「 Welcome to the Underground, Hacker 」              ║",
    "╚═══════════════════════════════════════════════════════╝",
  ].join("\n"),
)}

${chalk.red("⚠️  WARNING: This is a simulation for educational purposes only")}
${chalk.gray("Real hacking is illegal and unethical. Use knowledge responsibly.")}
    `)

    await this.typeWriter(chalk.cyan("\n[SYSTEM] Initializing secure connection..."), 30)
    await this.typeWriter(chalk.green("[SYSTEM] Connection established. Welcome to the Nexus."), 30)
  }

  async setupPlayer() {
    const hasExistingGame = await this.loadGame()

    if (hasExistingGame) {
      const continueGame = await inquirer.prompt({
        name: "continue",
        type: "confirm",
        message: `Welcome back, ${this.playerName}! Continue your previous session?`,
        default: true,
      })

      if (continueGame.continue) {
        console.log(chalk.green(`\n[SYSTEM] Profile loaded. Welcome back, ${this.playerName}!`))
        return
      }
    }

    const setup = await inquirer.prompt([
      {
        name: "player_name",
        type: "input",
        message: "Enter your hacker codename:",
        validate: (input) => input.length >= 3 || "Codename must be at least 3 characters",
      },
      {
        name: "difficulty",
        type: "list",
        message: "Select difficulty level:",
        choices: [
          { name: "🟢 Script Kiddie (Easy)", value: "easy" },
          { name: "🟡 White Hat (Normal)", value: "normal" },
          { name: "🔴 Black Hat (Hard)", value: "hard" },
          { name: "💀 Elite (Nightmare)", value: "elite" },
        ],
      },
      {
        name: "background",
        type: "list",
        message: "Choose your background:",
        choices: [
          { name: "🎓 Computer Science Student", value: "student" },
          { name: "💼 Corporate IT Security", value: "corporate" },
          { name: "🕵️ Government Agent", value: "government" },
          { name: "🏴‍☠️ Underground Hacker", value: "underground" },
        ],
      },
    ])

    this.playerName = setup.player_name
    this.difficulty = setup.difficulty
    this.background = setup.background

    // Set initial stats based on difficulty and background
    this.setInitialStats()
    await this.saveGame()
  }

  setInitialStats() {
    const difficultyMultipliers = {
      easy: { lives: 7, tools: 3 },
      normal: { lives: 5, tools: 2 },
      hard: { lives: 3, tools: 1 },
      elite: { lives: 1, tools: 0 },
    }

    const backgroundBonuses = {
      student: { tools: ["port_scanner", "password_list"] },
      corporate: { tools: ["firewall_bypass", "privilege_escalator"] },
      government: { tools: ["crypto_analyzer", "network_mapper"] },
      underground: { tools: ["social_engineer", "zero_day_exploit"] },
    }

    const multiplier = difficultyMultipliers[this.difficulty]
    this.lives = multiplier.lives

    const backgroundTools = backgroundBonuses[this.background] || { tools: [] }
    backgroundTools.tools.slice(0, multiplier.tools).forEach((tool) => this.tools.add(tool))
  }

  async showAdvancedStatus() {
    console.log(`
${chalk.bgBlue(" NEXUS TERMINAL ")} ${chalk.cyan(`[${this.playerName}]`)} ${chalk.gray(`(${this.background})`)}
${chalk.green("❤️  Lives:")} ${this.lives} ${chalk.yellow("⭐ Score:")} ${this.score} ${chalk.magenta("🎯 Level:")} ${this.level}/${this.maxLevel}
${chalk.blue("🏆 Reputation:")} ${this.reputation} ${chalk.red("🛠️  Tools:")} ${this.tools.size} ${chalk.purple("🏅 Achievements:")} ${this.achievements.size}
${chalk.gray("━".repeat(80))}
    `)
  }

  async showInventory() {
    if (this.tools.size === 0) {
      console.log(chalk.red("No tools available. Complete missions to acquire tools."))
      return
    }

    const toolDescriptions = {
      port_scanner: "🔍 Port Scanner - Discover open ports on target systems",
      password_list: "📝 Password Dictionary - Common passwords for brute force attacks",
      firewall_bypass: "🛡️ Firewall Bypass - Circumvent basic firewall protections",
      privilege_escalator: "⬆️ Privilege Escalator - Gain higher system privileges",
      crypto_analyzer: "🔐 Crypto Analyzer - Break encryption and analyze ciphers",
      network_mapper: "🗺️ Network Mapper - Map network topology and find targets",
      social_engineer: "🎭 Social Engineering Kit - Manipulate human psychology",
      zero_day_exploit: "💥 Zero-Day Exploit - Unreported vulnerability exploits",
      sql_injector: "💉 SQL Injector - Advanced database exploitation tool",
      steganography_kit: "🖼️ Steganography Kit - Hide and extract hidden messages",
      buffer_overflow: "💾 Buffer Overflow Kit - Memory corruption exploits",
      keylogger: "⌨️ Keylogger - Capture keystrokes and credentials",
    }

    console.log(chalk.yellow("\n🛠️  YOUR TOOLKIT:"))
    Array.from(this.tools).forEach((tool) => {
      console.log(`  ${toolDescriptions[tool] || `🔧 ${tool}`}`)
    })
  }

  async mission1_CorporateInfiltration() {
    console.log(chalk.red("\n🏢 MISSION 1: CORPORATE INFILTRATION"))
    console.log(chalk.gray("Target: MegaCorp Industries"))
    console.log(chalk.yellow("Objective: Infiltrate their employee database"))

    await this.typeWriter(chalk.cyan("[INTEL] MegaCorp has recently updated their security..."), 40)
    await this.typeWriter(chalk.cyan("[INTEL] Multiple attack vectors available..."), 40)

    const approach = await inquirer.prompt({
      name: "method",
      type: "list",
      message: "Choose your infiltration method:",
      choices: [
        { name: "🔍 Port Scanning & Network Reconnaissance", value: "network" },
        { name: "🎭 Social Engineering Attack", value: "social" },
        { name: "📧 Phishing Campaign", value: "phishing" },
        { name: "🔐 Brute Force Login Portal", value: "bruteforce" },
      ],
    })

    let success = false
    const spinner = createSpinner("Executing attack...").start()
    await this.sleep(3000)

    switch (approach.method) {
      case "network":
        if (this.tools.has("port_scanner")) {
          spinner.success({ text: "Port scan successful! Found open SSH on port 2222" })
          success = await this.networkChallenge()
        } else {
          spinner.error({ text: "Port scanner required for this approach!" })
        }
        break

      case "social":
        if (this.tools.has("social_engineer")) {
          spinner.success({ text: "Target employee identified on LinkedIn" })
          success = await this.socialEngineeringChallenge()
        } else {
          spinner.error({ text: "Social engineering kit required!" })
        }
        break

      case "phishing":
        spinner.success({ text: "Phishing emails sent to 50 employees" })
        success = await this.phishingChallenge()
        break

      case "bruteforce":
        if (this.tools.has("password_list")) {
          spinner.success({ text: "Password dictionary loaded" })
          success = await this.bruteForceChallenge()
        } else {
          spinner.error({ text: "Password dictionary required!" })
        }
        break
    }

    if (success) {
      this.score += 200
      this.reputation += 10
      this.tools.add("sql_injector")
      this.achievements.add("corporate_infiltrator")
      console.log(chalk.green("\n✅ Mission Complete! Acquired SQL Injector tool"))
    }

    return success
  }

  async networkChallenge() {
    console.log(chalk.yellow("\n🔍 NETWORK RECONNAISSANCE PHASE"))

    const questions = [
      {
        name: "nmap_command",
        type: "input",
        message: "What nmap command scans for open ports on 192.168.1.100?",
        validate: (input) => {
          const correct =
            input.toLowerCase().includes("nmap") &&
            input.includes("192.168.1.100") &&
            (input.includes("-p") || input.includes("--port"))
          return correct || "Hint: nmap -p [port_range] [target_ip]"
        },
      },
      {
        name: "ssh_version",
        type: "list",
        message: "SSH banner reveals: 'SSH-2.0-OpenSSH_7.4'. What's the vulnerability?",
        choices: [
          "No known vulnerabilities",
          "Username enumeration (CVE-2018-15473)",
          "Remote code execution",
          "Denial of service only",
        ],
      },
    ]

    const answers = await inquirer.prompt(questions)
    return answers.ssh_version === "Username enumeration (CVE-2018-15473)"
  }

  async socialEngineeringChallenge() {
    console.log(chalk.yellow("\n🎭 SOCIAL ENGINEERING PHASE"))

    await this.typeWriter(chalk.gray("Target: Sarah Johnson, IT Administrator"), 30)
    await this.typeWriter(chalk.gray("LinkedIn shows she recently got promoted..."), 30)

    const approach = await inquirer.prompt({
      name: "strategy",
      type: "list",
      message: "How do you approach Sarah?",
      choices: [
        "Congratulate her on promotion and ask about new security systems",
        "Pretend to be from IT support needing her credentials",
        "Pose as a vendor offering security solutions",
        "Send a fake security alert requiring immediate action",
      ],
    })

    const followUp = await inquirer.prompt({
      name: "pretext",
      type: "input",
      message: "What's your opening line in the phone call?",
    })

    // Realistic social engineering success based on approach
    const successRate = {
      0: 0.8, // Congratulation approach - most natural
      1: 0.3, // Direct credential request - suspicious
      2: 0.6, // Vendor approach - moderately believable
      3: 0.7, // Fake alert - creates urgency
    }

    const success = Math.random() < (successRate[approach.strategy] || 0.5)

    if (success) {
      console.log(chalk.green("\n✅ Sarah provided her temporary password: 'MegaCorp2025!'"))
      return true
    } else {
      console.log(chalk.red("\n❌ Sarah became suspicious and hung up"))
      return false
    }
  }

  async phishingChallenge() {
    console.log(chalk.yellow("\n📧 PHISHING CAMPAIGN PHASE"))

    const emailTemplate = await inquirer.prompt({
      name: "subject",
      type: "list",
      message: "Choose your phishing email subject:",
      choices: [
        "🚨 URGENT: Security Breach - Immediate Action Required",
        "🎉 Congratulations! You've won a company bonus",
        "📋 IT Department: Please update your password",
        "📦 Package delivery failed - click to reschedule",
      ],
    })

    const landingPage = await inquirer.prompt({
      name: "page",
      type: "list",
      message: "What does your fake landing page mimic?",
      choices: ["Company login portal", "Microsoft Office 365", "Bank security verification", "Social media login"],
    })

    const spinner = createSpinner("Monitoring phishing campaign...").start()
    await this.sleep(4000)

    // Simulate realistic phishing success rates
    const clickRate = Math.floor(Math.random() * 15) + 5 // 5-20% click rate
    const credentialRate = Math.floor(clickRate * 0.3) // 30% of clickers enter credentials

    spinner.success({ text: `Campaign results: ${clickRate}% clicked, ${credentialRate}% entered credentials` })

    if (credentialRate > 3) {
      console.log(chalk.green(`\n✅ Captured ${credentialRate} sets of credentials!`))
      return true
    } else {
      console.log(chalk.red("\n❌ Insufficient credential capture for access"))
      return false
    }
  }

  async bruteForceChallenge() {
    console.log(chalk.yellow("\n🔐 BRUTE FORCE ATTACK PHASE"))

    const target = await inquirer.prompt({
      name: "service",
      type: "list",
      message: "Which service do you target for brute force?",
      choices: ["SSH (Port 22)", "RDP (Port 3389)", "Web Admin Panel (Port 80)", "FTP (Port 21)"],
    })

    const strategy = await inquirer.prompt({
      name: "approach",
      type: "list",
      message: "Choose your brute force strategy:",
      choices: [
        "Dictionary attack with common passwords",
        "Hybrid attack (dictionary + numbers)",
        "Pure brute force (all combinations)",
        "Smart attack based on company info",
      ],
    })

    const spinner = createSpinner("Running brute force attack...").start()
    await this.sleep(5000)

    // Simulate realistic brute force scenarios
    const serviceVulnerability = {
      0: 0.7, // SSH often has weak passwords
      1: 0.4, // RDP usually better protected
      2: 0.8, // Web panels often weak
      3: 0.6, // FTP moderate
    }

    const strategyEffectiveness = {
      0: 0.6, // Dictionary
      1: 0.8, // Hybrid
      2: 0.2, // Pure brute force (too slow)
      3: 0.9, // Smart attack
    }

    const successChance = serviceVulnerability[target.service] * strategyEffectiveness[strategy.approach]

    if (Math.random() < successChance) {
      spinner.success({ text: "Password cracked: admin:MegaCorp123!" })
      return true
    } else {
      spinner.error({ text: "Attack failed - account locked or password too complex" })
      return false
    }
  }

  async mission2_CryptographicChallenge() {
    console.log(chalk.red("\n🔐 MISSION 2: THE CIPHER VAULT"))
    console.log(chalk.gray("Target: Encrypted Government Communications"))
    console.log(chalk.yellow("Objective: Decrypt classified messages"))

    const challenges = [
      await this.caesarCipherAdvanced(),
      await this.rsaChallenge(),
      await this.steganographyChallenge(),
    ]

    const successCount = challenges.filter(Boolean).length

    if (successCount >= 2) {
      this.score += 300
      this.reputation += 15
      this.tools.add("crypto_analyzer")
      this.achievements.add("cryptographer")
      return true
    }

    return false
  }

  async caesarCipherAdvanced() {
    console.log(chalk.yellow("\n📜 ADVANCED CAESAR CIPHER"))
    console.log(chalk.gray("Intercepted message: 'WKH HDJOH ODQGV DW PLGQLJKW'"))
    console.log(chalk.gray("Intelligence suggests variable shift cipher..."))

    const analysis = await inquirer.prompt([
      {
        name: "frequency",
        type: "input",
        message: "What's the most frequent letter in English? (for frequency analysis)",
      },
      {
        name: "shift",
        type: "input",
        message: "What shift value decrypts this message?",
      },
      {
        name: "plaintext",
        type: "input",
        message: "What's the decrypted message?",
      },
    ])

    const correct =
      analysis.frequency.toLowerCase() === "e" &&
      analysis.shift === "3" &&
      analysis.plaintext.toLowerCase().replace(/\s/g, "") === "theeaglelandsatmidnight"

    if (correct) {
      console.log(chalk.green("✅ Cipher cracked! Operation details revealed."))
      return true
    } else {
      console.log(chalk.red("❌ Decryption failed. Message remains classified."))
      return false
    }
  }

  async rsaChallenge() {
    console.log(chalk.yellow("\n🔢 RSA CRYPTANALYSIS"))
    console.log(chalk.gray("Captured RSA public key with small primes (educational example)"))
    console.log(chalk.gray("n = 77, e = 7"))

    const rsa = await inquirer.prompt([
      {
        name: "factorization",
        type: "input",
        message: "Factor n=77 into its prime components (format: p,q):",
      },
      {
        name: "totient",
        type: "input",
        message: "Calculate φ(n) = (p-1)(q-1):",
      },
      {
        name: "private_key",
        type: "input",
        message: "Calculate private key d where e*d ≡ 1 (mod φ(n)):",
      },
    ])

    const correct = rsa.factorization === "7,11" && rsa.totient === "60" && rsa.private_key === "43"

    if (correct) {
      console.log(chalk.green("✅ RSA key compromised! Private communications accessible."))
      return true
    } else {
      console.log(chalk.red("❌ RSA analysis failed. Encryption holds."))
      return false
    }
  }

  async steganographyChallenge() {
    console.log(chalk.yellow("\n🖼️ STEGANOGRAPHY ANALYSIS"))
    console.log(chalk.gray("Suspicious image file detected in communications..."))

    if (!this.tools.has("steganography_kit")) {
      console.log(chalk.red("❌ Steganography kit required for this challenge!"))
      return false
    }

    const stego = await inquirer.prompt([
      {
        name: "method",
        type: "list",
        message: "Which steganography technique do you use?",
        choices: [
          "LSB (Least Significant Bit) analysis",
          "DCT coefficient analysis",
          "Palette-based hiding detection",
          "Metadata examination",
        ],
      },
      {
        name: "extraction",
        type: "input",
        message: "Hidden message found: '01001000 01100101 01101100 01110000'. Convert to ASCII:",
      },
    ])

    const correct = stego.extraction.toLowerCase() === "help"

    if (correct) {
      console.log(chalk.green("✅ Hidden message extracted: 'Help' - Asset requesting extraction!"))
      return true
    } else {
      console.log(chalk.red("❌ Steganography analysis inconclusive."))
      return false
    }
  }

  async mission3_NetworkDomination() {
    console.log(chalk.red("\n🌐 MISSION 3: NETWORK DOMINATION"))
    console.log(chalk.gray("Target: Critical Infrastructure Network"))
    console.log(chalk.yellow("Objective: Gain persistent access across the network"))

    const phases = [
      { name: "Reconnaissance", challenge: this.networkRecon },
      { name: "Initial Access", challenge: this.initialAccess },
      { name: "Lateral Movement", challenge: this.lateralMovement },
      { name: "Privilege Escalation", challenge: this.privilegeEscalation },
      { name: "Persistence", challenge: this.establishPersistence },
    ]

    let successfulPhases = 0

    for (const phase of phases) {
      console.log(chalk.cyan(`\n🔄 Phase: ${phase.name}`))
      const success = await phase.challenge.call(this)
      if (success) {
        successfulPhases++
        console.log(chalk.green(`✅ ${phase.name} completed successfully`))
      } else {
        console.log(chalk.red(`❌ ${phase.name} failed`))
        if (successfulPhases < 2) break // Mission fails if early phases fail
      }
    }

    if (successfulPhases >= 4) {
      this.score += 500
      this.reputation += 25
      this.tools.add("network_mapper")
      this.tools.add("privilege_escalator")
      this.achievements.add("network_dominator")
      return true
    }

    return false
  }

  async networkRecon() {
    const recon = await inquirer.prompt([
      {
        name: "scan_type",
        type: "list",
        message: "Choose reconnaissance approach:",
        choices: [
          "Aggressive scan (-A flag)",
          "Stealth SYN scan (-sS)",
          "UDP scan (-sU)",
          "Comprehensive scan (-sC -sV)",
        ],
      },
      {
        name: "target_range",
        type: "input",
        message: "Enter target network range (CIDR notation):",
        default: "192.168.1.0/24",
      },
    ])

    const spinner = createSpinner("Scanning network...").start()
    await this.sleep(3000)

    // Stealth approach has higher success rate
    const stealthSuccess = recon.scan_type.includes("Stealth") && Math.random() > 0.3
    const otherSuccess = Math.random() > 0.5

    if (stealthSuccess || otherSuccess) {
      spinner.success({ text: "Network mapped: 15 hosts discovered, 8 with open services" })
      return true
    } else {
      spinner.error({ text: "Scan detected by IDS - network lockdown initiated" })
      return false
    }
  }

  async initialAccess() {
    const access = await inquirer.prompt({
      name: "vector",
      type: "list",
      message: "Choose initial access vector:",
      choices: [
        "Exploit unpatched SMB vulnerability",
        "Brute force SSH with credential list",
        "Web application SQL injection",
        "Phishing attack on network admin",
      ],
    })

    const spinner = createSpinner("Attempting initial access...").start()
    await this.sleep(2500)

    // Different success rates for different vectors
    const successRates = [0.8, 0.6, 0.9, 0.7]
    const success = Math.random() < successRates[access.vector]

    if (success) {
      spinner.success({ text: "Initial foothold established on target system" })
      return true
    } else {
      spinner.error({ text: "Access attempt failed - target hardened" })
      return false
    }
  }

  async lateralMovement() {
    if (!this.tools.has("network_mapper")) {
      console.log(chalk.red("❌ Network mapper required for lateral movement!"))
      return false
    }

    const movement = await inquirer.prompt([
      {
        name: "technique",
        type: "list",
        message: "Choose lateral movement technique:",
        choices: ["Pass-the-Hash attack", "Golden Ticket (Kerberos)", "WMI remote execution", "PowerShell remoting"],
      },
      {
        name: "target_priority",
        type: "list",
        message: "Which systems do you target first?",
        choices: ["Domain controllers", "Database servers", "File servers", "Workstations"],
      },
    ])

    const spinner = createSpinner("Moving laterally through network...").start()
    await this.sleep(3000)

    // Domain controllers are high-value but well-protected
    const targetSuccess = {
      0: 0.6, // Domain controllers
      1: 0.8, // Database servers
      2: 0.9, // File servers
      3: 0.7, // Workstations
    }

    if (Math.random() < targetSuccess[movement.target_priority]) {
      spinner.success({ text: "Successfully compromised 3 additional systems" })
      return true
    } else {
      spinner.error({ text: "Lateral movement detected - access revoked" })
      return false
    }
  }

  async privilegeEscalation() {
    const escalation = await inquirer.prompt([
      {
        name: "method",
        type: "list",
        message: "Choose privilege escalation method:",
        choices: [
          "Kernel exploit (CVE-2021-34527)",
          "Service misconfiguration abuse",
          "Scheduled task hijacking",
          "DLL hijacking",
        ],
      },
      {
        name: "persistence_prep",
        type: "confirm",
        message: "Prepare for persistence while escalating?",
        default: true,
      },
    ])

    const spinner = createSpinner("Escalating privileges...").start()
    await this.sleep(2000)

    if (this.tools.has("privilege_escalator") || Math.random() > 0.4) {
      spinner.success({ text: "SYSTEM/root privileges obtained!" })
      return true
    } else {
      spinner.error({ text: "Privilege escalation failed - access limited" })
      return false
    }
  }

  async establishPersistence() {
    const persistence = await inquirer.prompt([
      {
        name: "mechanisms",
        type: "checkbox",
        message: "Select persistence mechanisms:",
        choices: [
          { name: "Registry Run keys", value: "registry" },
          { name: "Scheduled tasks", value: "tasks" },
          { name: "Service installation", value: "service" },
          { name: "Startup folder", value: "startup" },
          { name: "WMI event subscription", value: "wmi" },
        ],
      },
      {
        name: "stealth",
        type: "list",
        message: "Stealth level for persistence:",
        choices: [
          "Maximum stealth (harder to detect)",
          "Moderate stealth (balanced)",
          "Minimal stealth (easier to maintain)",
        ],
      },
    ])

    const spinner = createSpinner("Establishing persistence...").start()
    await this.sleep(2500)

    // More mechanisms = higher success but higher detection risk
    const mechanismCount = persistence.mechanisms.length
    const stealthLevel = persistence.stealth

    const baseSuccess = Math.min(0.9, 0.4 + mechanismCount * 0.15)
    const stealthBonus = stealthLevel.includes("Maximum") ? 0.1 : 0

    if (Math.random() < baseSuccess + stealthBonus) {
      spinner.success({ text: `Persistence established using ${mechanismCount} mechanisms` })
      return true
    } else {
      spinner.error({ text: "Persistence mechanisms detected and removed" })
      return false
    }
  }

  async finalBoss_TheNexus() {
    console.log(chalk.red("\n💀 FINAL MISSION: THE NEXUS CORE"))
    console.log(chalk.gray("Target: The Nexus - Global Surveillance Network"))
    console.log(chalk.yellow("Objective: Infiltrate the most secure system on Earth"))

    await this.typeWriter(chalk.red("[WARNING] This is a point of no return..."), 50)
    await this.typeWriter(chalk.red("[WARNING] Success will mark you as a legend..."), 50)
    await this.typeWriter(chalk.red("[WARNING] Failure means digital exile..."), 50)

    const confirmation = await inquirer.prompt({
      name: "proceed",
      type: "confirm",
      message: "Do you wish to proceed with the final hack?",
      default: false,
    })

    if (!confirmation.proceed) {
      console.log(chalk.yellow("Mission aborted. Perhaps wisdom is the greatest hack of all."))
      return false
    }

    // Multi-stage final boss
    const stages = [
      { name: "Quantum Encryption", challenge: this.quantumChallenge },
      { name: "AI Defense System", challenge: this.aiDefenseChallenge },
      { name: "Biometric Bypass", challenge: this.biometricChallenge },
      { name: "Core Access", challenge: this.coreAccessChallenge },
    ]

    let stagesCompleted = 0

    for (const stage of stages) {
      console.log(chalk.magenta(`\n🔥 NEXUS STAGE: ${stage.name}`))
      const success = await stage.challenge.call(this)

      if (success) {
        stagesCompleted++
        console.log(chalk.green(`✅ ${stage.name} breached!`))

        if (stagesCompleted < stages.length) {
          const continueSpinner = createSpinner("Nexus adapting defenses...").start()
          await this.sleep(2000)
          continueSpinner.success({ text: "Ready for next stage" })
        }
      } else {
        console.log(chalk.red(`❌ ${stage.name} repelled the attack!`))
        break
      }
    }

    if (stagesCompleted === stages.length) {
      await this.nexusVictory()
      return true
    } else {
      await this.nexusDefeat()
      return false
    }
  }

  async quantumChallenge() {
    console.log(chalk.cyan("🌌 Quantum encryption detected - traditional methods useless"))

    const quantum = await inquirer.prompt([
      {
        name: "principle",
        type: "list",
        message: "Which quantum principle can break this encryption?",
        choices: ["Quantum superposition", "Quantum entanglement", "Quantum tunneling", "Shor's algorithm"],
      },
      {
        name: "qubits",
        type: "input",
        message: "How many qubits needed to factor RSA-2048? (approximate)",
      },
    ])

    return (
      quantum.principle === "Shor's algorithm" &&
      Number.parseInt(quantum.qubits) >= 4000 &&
      Number.parseInt(quantum.qubits) <= 6000
    )
  }

  async aiDefenseChallenge() {
    console.log(chalk.cyan("🤖 AI Defense System activated - learning your patterns"))

    const ai = await inquirer.prompt([
      {
        name: "strategy",
        type: "list",
        message: "How do you defeat an adaptive AI defense?",
        choices: [
          "Use completely random attack patterns",
          "Exploit the AI's training data biases",
          "Overwhelm with simultaneous attacks",
          "Feed it contradictory information",
        ],
      },
      {
        name: "implementation",
        type: "input",
        message: "Describe your specific approach in one sentence:",
      },
    ])

    // Accept creative answers that show understanding
    const validStrategies = ["random", "bias", "contradictory", "poison"]
    const hasValidConcept = validStrategies.some((concept) => ai.implementation.toLowerCase().includes(concept))

    return ai.strategy.includes("biases") || hasValidConcept
  }

  async biometricChallenge() {
    console.log(chalk.cyan("👁️ Multi-factor biometric authentication required"))

    const biometric = await inquirer.prompt([
      {
        name: "bypass_method",
        type: "checkbox",
        message: "Select biometric bypass techniques:",
        choices: [
          { name: "Fingerprint spoofing with silicone", value: "fingerprint" },
          { name: "Iris pattern projection", value: "iris" },
          { name: "Voice synthesis from recordings", value: "voice" },
          { name: "Facial recognition deepfake", value: "face" },
          { name: "Gait analysis mimicry", value: "gait" },
        ],
      },
      {
        name: "social_engineering",
        type: "confirm",
        message: "Combine with social engineering to get biometric samples?",
        default: true,
      },
    ])

    // Need multiple bypass methods and social engineering for success
    return biometric.bypass_method.length >= 3 && biometric.social_engineering
  }

  async coreAccessChallenge() {
    console.log(chalk.cyan("⚡ NEXUS CORE - Final authentication sequence"))

    const core = await inquirer.prompt([
      {
        name: "master_key",
        type: "password",
        message: "Enter the master key (hint: what connects all hackers?):",
        mask: "*",
      },
      {
        name: "philosophy",
        type: "input",
        message: "Complete the hacker motto: 'Information wants to be...'",
      },
      {
        name: "responsibility",
        type: "confirm",
        message: "Do you promise to use this power responsibly?",
        default: true,
      },
    ])

    return (
      core.master_key.toLowerCase() === "curiosity" &&
      core.philosophy.toLowerCase().includes("free") &&
      core.responsibility
    )
  }

  async nexusVictory() {
    console.clear()

    const victoryAnimation = chalkAnimation.rainbow(figlet.textSync("NEXUS BREACHED", { font: "Big" }))

    await this.sleep(4000)
    victoryAnimation.stop()

    console.log(`
${gradient.rainbow.multiline(
  [
    "╔═══════════════════════════════════════════════════════╗",
    "║                                                       ║",
    "║              🏆 LEGENDARY HACKER 🏆                   ║",
    "║                                                       ║",
    "║        You have achieved the impossible...            ║",
    "║                                                       ║",
    "║    The Nexus has been breached. You are now part     ║",
    "║         of hacking legend and folklore.               ║",
    "║                                                       ║",
    "╚═══════════════════════════════════════════════════════╝",
  ].join("\n"),
)}

${chalk.gold("🎖️  FINAL STATISTICS:")}
${chalk.cyan("Legendary Hacker:")} ${this.playerName}
${chalk.yellow("Final Score:")} ${this.score + 1000}
${chalk.green("Reputation:")} ${this.reputation + 100} (LEGENDARY)
${chalk.blue("Tools Mastered:")} ${this.tools.size}
${chalk.purple("Achievements:")} ${this.achievements.size + 1}

${chalk.red("⚠️  With great power comes great responsibility.")}
${chalk.gray("Use your knowledge to protect, not to harm.")}
    `)

    this.achievements.add("nexus_breacher")
    this.achievements.add("legendary_hacker")
    this.score += 1000
    this.reputation += 100
    await this.saveGame()
  }

  async nexusDefeat() {
    console.log(`
${chalk.red("💀 THE NEXUS REMAINS UNBROKEN")}

${chalk.gray("The most secure system on Earth has repelled your attack.")}
${chalk.gray("Your digital footprints have been traced...")}
${chalk.gray("Authorities are closing in...")}

${chalk.yellow("But legends are born from failure as much as success.")}
${chalk.cyan("Your reputation in the underground has grown.")}

${chalk.blue("Final Score:")} ${this.score + 200}
${chalk.green("Reputation:")} ${this.reputation + 20}
    `)

    this.achievements.add("nexus_challenger")
    this.score += 200
    this.reputation += 20
    await this.saveGame()
  }

  async gameOver(won = false) {
    if (!won) {
      const gameOverAnimation = chalkAnimation.glitch(figlet.textSync("TRACED", { font: "Big" }))

      await this.sleep(3000)
      gameOverAnimation.stop()

      console.log(`
${chalk.red("🚨 GAME OVER - YOU'VE BEEN TRACED 🚨")}

${chalk.gray("Your digital footprints led authorities right to you...")}
${chalk.gray("All your tools have been confiscated...")}
${chalk.gray("Your reputation in the underground remains...")}

${chalk.blue("Final Score:")} ${this.score}
${chalk.green("Reputation:")} ${this.reputation}
${chalk.purple("Achievements Unlocked:")} ${this.achievements.size}
      `)
    }

    const playAgain = await inquirer.prompt({
      name: "restart",
      type: "list",
      message: "What's your next move?",
      choices: [
        "Start a new hacking career",
        "Continue from last save",
        "View achievements and stats",
        "Exit to the real world",
      ],
    })

    switch (playAgain.restart) {
      case "Start a new hacking career":
        this.resetGame()
        await this.startGame()
        break
      case "Continue from last save":
        await this.loadGame()
        await this.startGame()
        break
      case "View achievements and stats":
        await this.showStats()
        await this.gameOver(won)
        break
      default:
        console.log(chalk.cyan("\n🌐 Disconnecting from the Nexus..."))
        console.log(chalk.gray("Remember: Real hacking is about curiosity, learning, and protection."))
        console.log(chalk.yellow("Stay curious, stay ethical. 🛡️"))
    }
  }

  async showStats() {
    console.log(`
${chalk.bgBlue(" HACKER PROFILE ")}

${chalk.cyan("Codename:")} ${this.playerName}
${chalk.gray("Background:")} ${this.background}
${chalk.yellow("Difficulty:")} ${this.difficulty}

${chalk.green("📊 STATISTICS:")}
${chalk.white("Score:")} ${this.score}
${chalk.white("Reputation:")} ${this.reputation}
${chalk.white("Current Level:")} ${this.level}/${this.maxLevel}
${chalk.white("Lives Remaining:")} ${this.lives}

${chalk.blue("🛠️  TOOLS ACQUIRED:")}
${Array.from(this.tools)
  .map((tool) => `  • ${tool.replace(/_/g, " ")}`)
  .join("\n")}

${chalk.purple("🏅 ACHIEVEMENTS UNLOCKED:")}
${Array.from(this.achievements)
  .map((achievement) => `  🏆 ${achievement.replace(/_/g, " ")}`)
  .join("\n")}
    `)
  }

  resetGame() {
    this.score = 0
    this.level = 1
    this.lives = 5
    this.reputation = 0
    this.tools.clear()
    this.achievements.clear()
    this.gameState = {
      currentMission: null,
      discoveredSystems: [],
      crackedPasswords: [],
      exploitedVulnerabilities: [],
      stolenData: [],
    }
  }

  async startGame() {
    await this.welcome()
    await this.setupPlayer()

    console.log(chalk.green(`\n[SYSTEM] Welcome to the underground, ${this.playerName}...`))
    console.log(chalk.gray("[SYSTEM] Your journey into the digital shadows begins now."))

    const missions = [
      this.mission1_CorporateInfiltration,
      this.mission2_CryptographicChallenge,
      this.mission3_NetworkDomination,
      this.finalBoss_TheNexus,
    ]

    for (let i = 0; i < missions.length; i++) {
      if (this.lives <= 0) {
        await this.gameOver(false)
        return
      }

      await this.showAdvancedStatus()

      const missionStart = await inquirer.prompt({
        name: "ready",
        type: "confirm",
        message: `Ready to begin Mission ${i + 1}?`,
        default: true,
      })

      if (!missionStart.ready) {
        await this.showInventory()
        continue
      }

      const success = await missions[i].call(this)

      if (success) {
        console.log(chalk.green(`\n🎉 Mission ${i + 1} completed successfully!`))
        this.level++
        await this.saveGame()

        if (i < missions.length - 1) {
          const continueSpinner = createSpinner("Preparing next mission...").start()
          await this.sleep(2000)
          continueSpinner.success({ text: "Next mission available" })
        }
      } else {
        console.log(chalk.red(`\n💥 Mission ${i + 1} failed!`))
        this.lives--

        if (this.lives > 0) {
          console.log(chalk.yellow(`Lives remaining: ${this.lives}. Retrying mission...`))
          i-- // Retry the same mission
        }
      }

      await this.sleep(1500)
    }

    if (this.lives > 0 && this.level > missions.length) {
      await this.gameOver(true)
    } else {
      await this.gameOver(false)
    }
  }
}

// Initialize and start the advanced hacking game
const game = new AdvancedHackingGame()
game.startGame().catch(console.error)

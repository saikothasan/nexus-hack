#!/usr/bin/env node

import chalk from "chalk"
import chalkAnimation from "chalk-animation"
import figlet from "figlet"
import gradient from "gradient-string"
import inquirer from "inquirer"
import { createSpinner } from "nanospinner"

class HackingGame {
  constructor() {
    this.playerName = ""
    this.score = 0
    this.level = 1
    this.maxLevel = 5
    this.lives = 3
  }

  async sleep(ms = 2000) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async welcome() {
    const rainbowTitle = chalkAnimation.rainbow(
      figlet.textSync("CYBER HACK", {
        font: "Big",
        horizontalLayout: "default",
        verticalLayout: "default",
      }),
    )

    await this.sleep(3000)
    rainbowTitle.stop()

    console.log(`
${gradient.pastel.multiline(
  [
    "╔══════════════════════════════════════╗",
    "║     Welcome to CYBER HACK 2025       ║",
    "║                                      ║",
    "║  A Terminal Hacking Simulation Game  ║",
    "╚══════════════════════════════════════╝",
  ].join("\n"),
)}

${chalk.cyan("Rules:")}
${chalk.white("• Complete 5 hacking challenges")}
${chalk.white("• You have 3 lives")}
${chalk.white("• Each level gets progressively harder")}
${chalk.white("• Wrong answers cost you a life")}
${chalk.red("• Fail all lives = GAME OVER")}
    `)
  }

  async askName() {
    const answers = await inquirer.prompt({
      name: "player_name",
      type: "input",
      message: "Enter your hacker alias:",
      default() {
        return "Anonymous"
      },
    })

    this.playerName = answers.player_name
  }

  async showStatus() {
    console.log(`
${chalk.bgBlue(" STATUS ")} ${chalk.cyan(this.playerName)}
${chalk.green("Lives:")} ${"❤️ ".repeat(this.lives)}
${chalk.yellow("Score:")} ${this.score}
${chalk.magenta("Level:")} ${this.level}/${this.maxLevel}
    `)
  }

  async level1_PasswordCrack() {
    console.log(chalk.red("\n🔒 LEVEL 1: PASSWORD CRACKING"))
    console.log(chalk.gray("Target: Corporate Database"))

    const spinner = createSpinner("Scanning for vulnerabilities...").start()
    await this.sleep(2000)
    spinner.success({ text: "Vulnerability found!" })

    console.log(chalk.yellow("\nPassword hint: Famous tech company founded in 1976"))
    console.log(chalk.gray("Clue: Think fruit..."))

    const answer = await inquirer.prompt({
      name: "password",
      type: "input",
      message: "Enter the password:",
    })

    if (answer.password.toLowerCase() === "apple") {
      const successSpinner = createSpinner("Cracking password...").start()
      await this.sleep(1500)
      successSpinner.success({ text: "ACCESS GRANTED!" })
      this.score += 100
      return true
    } else {
      const failSpinner = createSpinner("Invalid password...").start()
      await this.sleep(1000)
      failSpinner.error({ text: "ACCESS DENIED!" })
      this.lives--
      return false
    }
  }

  async level2_NetworkInfiltration() {
    console.log(chalk.red("\n🌐 LEVEL 2: NETWORK INFILTRATION"))
    console.log(chalk.gray("Target: Government Server"))

    const spinner = createSpinner("Mapping network topology...").start()
    await this.sleep(2500)
    spinner.success({ text: "Network mapped successfully!" })

    console.log(chalk.yellow("\nWhich port is commonly used for SSH?"))

    const answer = await inquirer.prompt({
      name: "port",
      type: "list",
      message: "Select the correct port:",
      choices: ["21", "22", "23", "80", "443"],
    })

    if (answer.port === "22") {
      const successSpinner = createSpinner("Establishing SSH connection...").start()
      await this.sleep(2000)
      successSpinner.success({ text: "CONNECTION ESTABLISHED!" })
      this.score += 150
      return true
    } else {
      const failSpinner = createSpinner("Connection failed...").start()
      await this.sleep(1000)
      failSpinner.error({ text: "INTRUSION DETECTED!" })
      this.lives--
      return false
    }
  }

  async level3_SystemAccess() {
    console.log(chalk.red("\n💻 LEVEL 3: SYSTEM ACCESS"))
    console.log(chalk.gray("Target: Banking System"))

    const spinner = createSpinner("Bypassing firewall...").start()
    await this.sleep(3000)
    spinner.success({ text: "Firewall bypassed!" })

    console.log(chalk.yellow("\nSQL Injection Challenge:"))
    console.log(chalk.gray("Complete this SQL injection: SELECT * FROM users WHERE username = 'admin' "))

    const answer = await inquirer.prompt({
      name: "injection",
      type: "input",
      message: "What should you add to bypass the password check?",
      default: "OR 1=1--",
    })

    if (answer.injection.includes("OR 1=1") || answer.injection.includes("or 1=1")) {
      const successSpinner = createSpinner("Executing SQL injection...").start()
      await this.sleep(2000)
      successSpinner.success({ text: "ADMIN ACCESS GRANTED!" })
      this.score += 200
      return true
    } else {
      const failSpinner = createSpinner("Query failed...").start()
      await this.sleep(1000)
      failSpinner.error({ text: "INJECTION BLOCKED!" })
      this.lives--
      return false
    }
  }

  async level4_CryptoChallenge() {
    console.log(chalk.red("\n🔐 LEVEL 4: CRYPTOGRAPHY"))
    console.log(chalk.gray("Target: Encrypted Communications"))

    const spinner = createSpinner("Intercepting encrypted messages...").start()
    await this.sleep(2500)
    spinner.success({ text: "Message intercepted!" })

    console.log(chalk.yellow("\nCaesar Cipher Challenge:"))
    console.log(chalk.gray('Encrypted message: "KHOOR ZRUOG" (shift of 3)'))

    const answer = await inquirer.prompt({
      name: "decrypted",
      type: "input",
      message: "What is the decrypted message?",
    })

    if (answer.decrypted.toLowerCase().replace(/\s/g, "") === "helloworld") {
      const successSpinner = createSpinner("Decrypting message...").start()
      await this.sleep(1500)
      successSpinner.success({ text: "MESSAGE DECRYPTED!" })
      this.score += 250
      return true
    } else {
      const failSpinner = createSpinner("Decryption failed...").start()
      await this.sleep(1000)
      failSpinner.error({ text: "WRONG DECRYPTION!" })
      this.lives--
      return false
    }
  }

  async level5_FinalBoss() {
    console.log(chalk.red("\n👑 FINAL LEVEL: THE MAINFRAME"))
    console.log(chalk.gray("Target: Global Defense Network"))

    const spinner = createSpinner("Locating mainframe...").start()
    await this.sleep(3000)
    spinner.success({ text: "Mainframe located!" })

    console.log(chalk.yellow("\nMulti-step Authentication:"))

    // Step 1: Binary
    console.log(chalk.cyan("Step 1: Convert binary 01001000 01101001 to text"))
    const step1 = await inquirer.prompt({
      name: "binary",
      type: "input",
      message: "Binary to text:",
    })

    if (step1.binary.toLowerCase() !== "hi") {
      this.lives--
      return false
    }

    // Step 2: Math
    console.log(chalk.cyan("Step 2: What is 0xFF in decimal?"))
    const step2 = await inquirer.prompt({
      name: "hex",
      type: "input",
      message: "Hexadecimal to decimal:",
    })

    if (step2.hex !== "255") {
      this.lives--
      return false
    }

    // Step 3: Logic
    console.log(chalk.cyan("Step 3: Complete the sequence: 2, 4, 8, 16, ?"))
    const step3 = await inquirer.prompt({
      name: "sequence",
      type: "input",
      message: "Next number:",
    })

    if (step3.sequence !== "32") {
      this.lives--
      return false
    }

    const successSpinner = createSpinner("Accessing mainframe...").start()
    await this.sleep(3000)
    successSpinner.success({ text: "MAINFRAME COMPROMISED!" })
    this.score += 500
    return true
  }

  async gameOver(won = false) {
    console.clear()

    if (won) {
      const winAnimation = chalkAnimation.rainbow(figlet.textSync("MISSION COMPLETE!", { font: "Small" }))
      await this.sleep(3000)
      winAnimation.stop()

      console.log(`
${gradient.morning.multiline(
  [
    "╔══════════════════════════════════════╗",
    "║          CONGRATULATIONS!            ║",
    "║                                      ║",
    "║     You are now a CYBER LEGEND!      ║",
    "╚══════════════════════════════════════╝",
  ].join("\n"),
)}

${chalk.green("🏆 FINAL STATS:")}
${chalk.cyan("Hacker:")} ${this.playerName}
${chalk.yellow("Final Score:")} ${this.score}
${chalk.green("Status:")} ELITE HACKER
      `)
    } else {
      const loseAnimation = chalkAnimation.glitch(figlet.textSync("GAME OVER", { font: "Small" }))
      await this.sleep(3000)
      loseAnimation.stop()

      console.log(`
${chalk.red("💀 MISSION FAILED!")}
${chalk.gray("You have been traced and captured...")}

${chalk.red("📊 FINAL STATS:")}
${chalk.cyan("Hacker:")} ${this.playerName}
${chalk.yellow("Final Score:")} ${this.score}
${chalk.red("Status:")} CAPTURED
      `)
    }

    const playAgain = await inquirer.prompt({
      name: "restart",
      type: "confirm",
      message: "Do you want to play again?",
      default: false,
    })

    if (playAgain.restart) {
      this.resetGame()
      await this.startGame()
    } else {
      console.log(chalk.cyan("\nThanks for playing CYBER HACK!"))
      console.log(chalk.gray("Remember: Use your skills for good! 🛡️"))
    }
  }

  resetGame() {
    this.score = 0
    this.level = 1
    this.lives = 3
  }

  async startGame() {
    console.clear()
    await this.welcome()
    await this.askName()

    console.log(chalk.green(`\nWelcome, ${this.playerName}! Let's begin your hacking journey...\n`))

    const levels = [
      this.level1_PasswordCrack,
      this.level2_NetworkInfiltration,
      this.level3_SystemAccess,
      this.level4_CryptoChallenge,
      this.level5_FinalBoss,
    ]

    for (let i = 0; i < levels.length; i++) {
      if (this.lives <= 0) {
        await this.gameOver(false)
        return
      }

      await this.showStatus()
      const success = await levels[i].call(this)

      if (success) {
        console.log(chalk.green("\n✅ Level completed successfully!"))
        this.level++

        if (i < levels.length - 1) {
          const continueSpinner = createSpinner("Preparing next challenge...").start()
          await this.sleep(2000)
          continueSpinner.success({ text: "Ready for next level!" })
        }
      } else {
        console.log(chalk.red(`\n❌ Level failed! Lives remaining: ${this.lives}`))
        if (this.lives > 0) {
          console.log(chalk.yellow("Try the level again..."))
          i-- // Retry the same level
        }
      }

      await this.sleep(1000)
    }

    if (this.lives > 0) {
      await this.gameOver(true)
    } else {
      await this.gameOver(false)
    }
  }
}

// Start the game
const game = new HackingGame()
game.startGame().catch(console.error)

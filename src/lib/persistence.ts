/**
 * @module persistence
 * @description Module responsible for managing account data persistence using a JSON file as storage
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { Account } from '@/types'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, '../data/db.json')

// In-memory store
const accounts = new Map<string, Account>()

// Load initial data from db.json
try {
  const dbContent = JSON.parse(readFileSync(dbPath, 'utf-8'))
  if (dbContent.accounts) {
    dbContent.accounts.forEach((account: Account) => {
      accounts.set(account.accountId, account)
    })
  }
  console.log(`Loaded ${accounts.size} accounts from db.json`)
} catch (error) {
  console.error('Failed to load initial data from db.json:', error)
}

/**
 * Retrieves an account from the storage by its ID
 * @param {string} accountId - The unique identifier of the account
 * @returns {Account | undefined} The account if found, undefined otherwise
 */
export function getAccount(accountId: string): Account | undefined {
  return accounts.get(accountId)
}

/**
 * Saves an account to the storage and persists it to the JSON file
 * @param {Account} account - The account object to be saved
 * @returns {void}
 * @throws {Error} If there's an error writing to the JSON file
 */
export function saveAccount(account: Account): void {
  accounts.set(account.accountId, account)
  try {
    const dbContent = JSON.parse(readFileSync(dbPath, 'utf-8'))
    dbContent.accounts = Array.from(accounts.values())
    writeFileSync(dbPath, JSON.stringify(dbContent, null, 2))
  } catch (error) {
    console.error('Failed to save to db.json:', error)
  }
}

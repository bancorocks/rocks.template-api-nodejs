/**
 * @module accounts
 * @description Express router module for handling account-related endpoints
 */

import { Router } from 'express'
import { nanoid } from 'nanoid'
import type { OpenAccountRequest, OpenAccountResponse } from '@/types'
import { saveAccount, getAccount } from '@/lib/persistence'

const router = Router()

/**
 * POST / - Creates a new bank account
 * @route POST /
 * @param {OpenAccountRequest} req.body - The account creation request data
 * @returns {OpenAccountResponse} 201 - The created account information
 */
router.post('/', async (req, res) => {
  const { name, document } = req.body as OpenAccountRequest

  const account = {
    accountId: nanoid(),
    number: Math.floor(100000 + Math.random() * 900000).toString(),
    branch: Math.floor(1000 + Math.random() * 9000).toString(),
    name,
    document,
    status: 'active' as const,
    createdAt: new Date().toISOString(),
  }

  saveAccount(account)

  const response: OpenAccountResponse = {
    accountId: account.accountId,
    number: account.number,
    branch: account.branch,
    name: account.name,
    status: account.status,
    createdAt: account.createdAt,
  }

  res.status(201).json(response)
})

/**
 * GET /:accountId - Retrieves account information by ID
 * @route GET /:accountId
 * @param {string} req.params.accountId - The unique identifier of the account
 * @returns {Account} 200 - The account information
 * @returns {Error} 404 - Account not found
 */
router.get('/:accountId', (req, res) => {
  const account = getAccount(req.params.accountId)
  if (!account) {
    return res.status(404).json({
      code: 'ACCOUNT_NOT_FOUND',
      message: 'Account not found',
    })
  }
  res.json(account)
})

export default router

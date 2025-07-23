import crypto from 'node:crypto'

export function generateId() {
  // Create a 21 characters random id like this: bEbUn1NVCHKfMmCny4k8w
  return crypto.randomUUID().replace(/-/g, '').slice(0, 21)
}

export function generateInvoiceNumber() {
  // Create a 7 characters random number like this: 1234567
  return crypto.randomInt(1000000, 9999999).toString()
}

import axios from 'axios';
import type { Contact } from '../_type/contact';

const serverUrl = 'http://localhost:3001';

/**
 * @openapi
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         userId:
 *           type: string
 *           example: "1"
 *     CreateContactInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - userId
 *       properties:
 *         name:
 *           type: string
 *           example: "Jane Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "jane@example.com"
 *         userId:
 *           type: string
 *           example: "1"
 *     UpdateContactInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Jane Smith"
 *         email:
 *           type: string
 *           format: email
 *           example: "jane.smith@example.com"
 *         userId:
 *           type: string
 *           example: "1"
 *
 * /contacts:
 *   get:
 *     summary: Fetch contacts
 *     description: Returns all contacts, or filters by userId when provided.
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter contacts for a specific user.
 *     responses:
 *       200:
 *         description: Contact list returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *   post:
 *     summary: Add contact
 *     tags:
 *       - Contacts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateContactInput'
 *     responses:
 *       201:
 *         description: Contact created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *
 * /contacts/{id}:
 *   get:
 *     summary: Fetch a contact by id
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found.
 *   patch:
 *     summary: Update contact
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateContactInput'
 *     responses:
 *       200:
 *         description: Contact updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found.
 *   delete:
 *     summary: Delete contact
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted.
 *       404:
 *         description: Contact not found.
 */
export type CreateContactInput = Omit<Contact, 'id'>;
export type UpdateContactInput = Partial<Omit<Contact, 'id'>>;

export async function getContacts(userId?: string): Promise<Contact[]> {
  const response = await axios.get<Contact[]>(`${serverUrl}/contacts`, {
    params: userId ? { userId } : undefined,
    maxBodyLength: Infinity,
  });

  return response.data;
}

export async function getContact(id: string): Promise<Contact> {
  const response = await axios.get<Contact>(`${serverUrl}/contacts/${id}`, {
    maxBodyLength: Infinity,
  });

  return response.data;
}

export async function createContact(payload: CreateContactInput): Promise<Contact> {
  const response = await axios.post<Contact>(`${serverUrl}/contacts`, payload, {
    maxBodyLength: Infinity,
  });

  return response.data;
}

export async function updateContact(id: string, payload: UpdateContactInput): Promise<Contact> {
  const response = await axios.patch<Contact>(`${serverUrl}/contacts/${id}`, payload, {
    maxBodyLength: Infinity,
  });

  return response.data;
}

export async function deleteContact(id: string): Promise<void> {
  await axios.delete(`${serverUrl}/contacts/${id}`, {
    maxBodyLength: Infinity,
  });
}
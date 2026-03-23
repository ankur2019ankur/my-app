import axios from 'axios';
import type { User } from '../_type/user';

const serverUrl = 'http://localhost:3001';

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
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
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: "Jane Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "jane@example.com"
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Jane Smith"
 *         email:
 *           type: string
 *           format: email
 *           example: "jane.smith@example.com"
 *
 * /users:
 *   get:
 *     summary: Fetch users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User list returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Add user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 * /users/{id}:
 *   get:
 *     summary: Fetch a user by id
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *   patch:
 *     summary: Update user
 *     tags:
 *       - Users
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
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: User updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *   delete:
 *     summary: Delete user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted.
 *       404:
 *         description: User not found.
 */
export type CreateUserInput = Omit<User, 'id'>;
export type UpdateUserInput = Partial<Omit<User, 'id'>>;

export async function getUsers(): Promise<User[]> {
  const response = await axios.get<User[]>(`${serverUrl}/users`, {
    maxBodyLength: Infinity,
  });

  return response.data;
}

export async function getUser(id: string): Promise<User> {
  const response = await axios.get<User>(`${serverUrl}/users/${id}`, {
    maxBodyLength: Infinity,
  });

  return response.data;
}

export async function createUser(payload: CreateUserInput): Promise<User> {
  const response = await axios.post<User>(`${serverUrl}/users`, payload, {
    maxBodyLength: Infinity,
  });

  return response.data;
}

export async function updateUser(id: string, payload: UpdateUserInput): Promise<User> {
  const response = await axios.patch<User>(`${serverUrl}/users/${id}`, payload, {
    maxBodyLength: Infinity,
  });

  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await axios.delete(`${serverUrl}/users/${id}`, {
    maxBodyLength: Infinity,
  });
}

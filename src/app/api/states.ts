import axios from 'axios';
import type { State } from '../_type/state';

const serverUrl = 'http://localhost:3001';

/**
 * @openapi
 * components:
 *   schemas:
 *     State:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - capital
 *         - temperature
 *         - season
 *         - gdp
 *         - population
 *         - area
 *       properties:
 *         id:
 *           type: string
 *           example: "jharkhand"
 *         name:
 *           type: string
 *           example: "Jharkhand"
 *         capital:
 *           type: string
 *           example: "Ranchi"
 *         temperature:
 *           type: string
 *           example: "30-33°C"
 *         season:
 *           type: string
 *           example: "Moderate summer"
 *         gdp:
 *           type: string
 *           example: "₹4.5 lakh crore"
 *         population:
 *           type: string
 *           example: "3.8 crore"
 *         area:
 *           type: string
 *           example: "79,714 km²"
 *     CreateStateInput:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - capital
 *         - temperature
 *         - season
 *         - gdp
 *         - population
 *         - area
 *       properties:
 *         id:
 *           type: string
 *           example: "jharkhand"
 *         name:
 *           type: string
 *           example: "Jharkhand"
 *         capital:
 *           type: string
 *           example: "Ranchi"
 *         temperature:
 *           type: string
 *           example: "30-33°C"
 *         season:
 *           type: string
 *           example: "Moderate summer"
 *         gdp:
 *           type: string
 *           example: "₹4.5 lakh crore"
 *         population:
 *           type: string
 *           example: "3.8 crore"
 *         area:
 *           type: string
 *           example: "79,714 km²"
 *     UpdateStateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Jharkhand"
 *         capital:
 *           type: string
 *           example: "Ranchi"
 *         temperature:
 *           type: string
 *           example: "30-33°C"
 *         season:
 *           type: string
 *           example: "Moderate summer"
 *         gdp:
 *           type: string
 *           example: "₹4.5 lakh crore"
 *         population:
 *           type: string
 *           example: "3.8 crore"
 *         area:
 *           type: string
 *           example: "79,714 km²"
 *
 * /states:
 *   get:
 *     summary: Fetch states
 *     tags:
 *       - States
 *     parameters:
 *       - in: query
 *         name: _page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: _per_page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Page size
 *     responses:
 *       200:
 *         description: Paginated state list returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - data
 *                 - page
 *                 - limit
 *                 - total
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/State'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 36
 *   post:
 *     summary: Add state
 *     tags:
 *       - States
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStateInput'
 *     responses:
 *       201:
 *         description: State created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/State'
 *
 * /states/{id}:
 *   get:
 *     summary: Fetch a state by id
 *     tags:
 *       - States
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: State returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/State'
 *       404:
 *         description: State not found.
 *   patch:
 *     summary: Update state
 *     tags:
 *       - States
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
 *             $ref: '#/components/schemas/UpdateStateInput'
 *     responses:
 *       200:
 *         description: State updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/State'
 *       404:
 *         description: State not found.
 *   delete:
 *     summary: Delete state
 *     tags:
 *       - States
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: State deleted.
 *       404:
 *         description: State not found.
 */
export type CreateStateInput = State;
export type UpdateStateInput = Partial<Omit<State, 'id'>>;

export type GetStatesResponse = {
  data: State[];
  page: number;
  limit: number;
  total: number;
};

export async function getStates(options?: { page?: number; limit?: number }): Promise<GetStatesResponse> {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;

  const response = await axios.get<unknown>(`${serverUrl}/states`, {
    maxBodyLength: Infinity,
    params: {
      _page: page,
      _per_page: limit,
    },
  });

  // Backend supports both:
  // - Array response: State[]
  // - Paginated response: { data: State[]; items: number; ... }
  const body = response.data as unknown;
  const data = Array.isArray(body) ? (body as State[]) : ((body as { data?: State[] }).data ?? []);
  const totalFromBody = !Array.isArray(body) ? (body as { items?: number }).items : undefined;

  const totalHeader = response.headers?.['x-total-count'];
  const totalFromHeader =
    typeof totalHeader === 'string' ? Number.parseInt(totalHeader, 10) : Number.NaN;

  return {
    data,
    page,
    limit,
    total: Number.isFinite(totalFromHeader)
      ? totalFromHeader
      : typeof totalFromBody === 'number'
        ? totalFromBody
        : data.length,
  };
}

export async function addStates(payload: CreateStateInput): Promise<State> {
  const response = await axios.post<State>(`${serverUrl}/states`, payload, {
    maxBodyLength: Infinity,
  });

  return response.data;
}

export async function updateStates(id: string, payload: UpdateStateInput): Promise<State> {
  const response = await axios.patch<State>(`${serverUrl}/states/${id}`, payload, {
    maxBodyLength: Infinity,
  });

  return response.data;
}

export async function deleteStates(id: string): Promise<void> {
  await axios.delete(`${serverUrl}/states/${id}`, {
    maxBodyLength: Infinity,
  });
}


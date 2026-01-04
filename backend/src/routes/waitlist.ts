import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq, desc, and } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

const LOOKING_FOR_OPTIONS = [
  'Long-term relationship',
  'Marriage',
  'Life partner',
  'Serious dating',
  'Meaningful connection',
  'Friendship first',
  'Casual dating',
  'New experiences',
  'Travel companion',
  'Activity partner',
  'Intellectual connection',
  'Spiritual connection',
];

interface CreateApplicationRequest {
  first_name?: string;
  last_name?: string;
  age?: number;
  city?: string;
  province_state?: string;
  country?: string;
  email?: string;
  phone_number?: string;
  looking_for?: string[];
  additional_information?: string;
}

interface UpdateStatusRequest {
  status?: 'pending' | 'approved' | 'rejected';
}

interface ListQuerystring {
  status?: string;
}

interface ExportQuerystring {
  status?: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateLookingFor(lookingFor: unknown): lookingFor is string[] {
  if (!Array.isArray(lookingFor)) return false;
  if (lookingFor.length === 0 || lookingFor.length > 3) return false;
  return lookingFor.every(
    (item) => typeof item === 'string' && LOOKING_FOR_OPTIONS.includes(item)
  );
}

function generateCsvContent(applications: any[]): string {
  const headers = [
    'ID',
    'First Name',
    'Last Name',
    'Age',
    'City',
    'Province/State',
    'Country',
    'Email',
    'Phone Number',
    'Looking For',
    'Additional Information',
    'Status',
    'Created At',
    'Updated At',
  ];

  const rows = applications.map((app) => [
    app.id,
    app.firstName,
    app.lastName,
    app.age,
    app.city,
    app.provinceState,
    app.country,
    app.email,
    app.phoneNumber || '',
    (app.lookingFor || []).join('; '),
    (app.additionalInformation || '').replace(/"/g, '""'),
    app.status,
    app.createdAt?.toISOString() || '',
    app.updatedAt?.toISOString() || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const str = String(cell);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    ),
  ].join('\n');

  return csvContent;
}

export function register(app: App, fastify: FastifyInstance) {
  // POST /api/waitlist/apply - Submit a new application
  fastify.post<{ Body: CreateApplicationRequest }>(
    '/api/waitlist/apply',
    {
      schema: {
        description: 'Submit a new waitlist application for Intentional dating app',
        tags: ['waitlist'],
        body: {
          type: 'object',
          required: [
            'first_name',
            'last_name',
            'age',
            'city',
            'province_state',
            'country',
            'email',
            'looking_for',
          ],
          properties: {
            first_name: { type: 'string', minLength: 1 },
            last_name: { type: 'string', minLength: 1 },
            age: { type: 'number', minimum: 18 },
            city: { type: 'string', minLength: 1 },
            province_state: { type: 'string', minLength: 1 },
            country: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            phone_number: { type: 'string' },
            looking_for: {
              type: 'array',
              items: { type: 'string' },
              minItems: 1,
              maxItems: 3,
            },
            additional_information: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              id: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateApplicationRequest }>, reply: FastifyReply) => {
      try {
        const {
          first_name = '',
          last_name = '',
          age,
          city = '',
          province_state = '',
          country = '',
          email = '',
          phone_number,
          looking_for,
          additional_information,
        } = request.body;

        // Validation
        if (!first_name || !first_name.trim()) {
          return reply.code(400).send({ error: 'First name is required' });
        }

        if (!last_name || !last_name.trim()) {
          return reply.code(400).send({ error: 'Last name is required' });
        }

        if (!age || age < 18) {
          return reply.code(400).send({ error: 'Age must be at least 18' });
        }

        if (!city || !city.trim()) {
          return reply.code(400).send({ error: 'City is required' });
        }

        if (!province_state || !province_state.trim()) {
          return reply.code(400).send({ error: 'Province/State is required' });
        }

        if (!country || !country.trim()) {
          return reply.code(400).send({ error: 'Country is required' });
        }

        if (!email || !validateEmail(email)) {
          return reply.code(400).send({ error: 'Valid email is required' });
        }

        if (!validateLookingFor(looking_for)) {
          return reply.code(400).send({
            error:
              'Looking for must contain 1-3 valid selections from the predefined options',
          });
        }

        // Insert the application
        const [application] = await app.db
          .insert(schema.waitlistApplications)
          .values({
            firstName: first_name.trim(),
            lastName: last_name.trim(),
            age,
            city: city.trim(),
            provinceState: province_state.trim(),
            country: country.trim(),
            email: email.toLowerCase().trim(),
            phoneNumber: phone_number ? phone_number.trim() : undefined,
            lookingFor: looking_for,
            additionalInformation: additional_information
              ? additional_information.trim()
              : undefined,
            status: 'pending',
          })
          .returning();

        return reply.code(201).send({
          success: true,
          message: 'Application submitted successfully',
          id: application.id,
        });
      } catch (error) {
        // Handle unique email constraint
        if (error instanceof Error && 'code' in error && error.code === '23505' && 'detail' in error && typeof error.detail === 'string' && error.detail?.includes('email')) {
          return reply.code(400).send({
            error: 'An application with this email already exists',
          });
        }

        app.logger.error({ error }, 'Error creating waitlist application');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // GET /api/waitlist/applications - Get all applications (with status filter)
  fastify.get<{ Querystring: ListQuerystring }>(
    '/api/waitlist/applications',
    {
      schema: {
        description: 'Get all waitlist applications (admin only)',
        tags: ['waitlist'],
        querystring: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
          },
        },
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                age: { type: 'number' },
                city: { type: 'string' },
                province_state: { type: 'string' },
                country: { type: 'string' },
                email: { type: 'string' },
                phone_number: { type: ['string', 'null'] },
                looking_for: { type: 'array', items: { type: 'string' } },
                additional_information: { type: ['string', 'null'] },
                status: { type: 'string' },
                created_at: { type: 'string' },
                updated_at: { type: 'string' },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: ListQuerystring }>, reply: FastifyReply) => {
      try {
        const { status } = request.query;

        const applications = await (status && ['pending', 'approved', 'rejected'].includes(status)
          ? app.db
              .select()
              .from(schema.waitlistApplications)
              .where(
                eq(schema.waitlistApplications.status, status as 'pending' | 'approved' | 'rejected')
              )
              .orderBy(desc(schema.waitlistApplications.createdAt))
          : app.db
              .select()
              .from(schema.waitlistApplications)
              .orderBy(desc(schema.waitlistApplications.createdAt)));

        return reply.send(
          applications.map((app) => ({
            id: app.id,
            first_name: app.firstName,
            last_name: app.lastName,
            age: app.age,
            city: app.city,
            province_state: app.provinceState,
            country: app.country,
            email: app.email,
            phone_number: app.phoneNumber,
            looking_for: app.lookingFor,
            additional_information: app.additionalInformation,
            status: app.status,
            created_at: app.createdAt?.toISOString(),
            updated_at: app.updatedAt?.toISOString(),
          }))
        );
      } catch (error) {
        app.logger.error({ error }, 'Error fetching waitlist applications');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // GET /api/waitlist/applications/:id - Get single application
  fastify.get<{ Params: { id: string } }>(
    '/api/waitlist/applications/:id',
    {
      schema: {
        description: 'Get a single waitlist application by ID',
        tags: ['waitlist'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              first_name: { type: 'string' },
              last_name: { type: 'string' },
              age: { type: 'number' },
              city: { type: 'string' },
              province_state: { type: 'string' },
              country: { type: 'string' },
              email: { type: 'string' },
              phone_number: { type: ['string', 'null'] },
              looking_for: { type: 'array', items: { type: 'string' } },
              additional_information: { type: ['string', 'null'] },
              status: { type: 'string' },
              created_at: { type: 'string' },
              updated_at: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        const application = await app.db.query.waitlistApplications.findFirst({
          where: eq(schema.waitlistApplications.id, id),
        });

        if (!application) {
          return reply.code(404).send({ error: 'Application not found' });
        }

        return reply.send({
          id: application.id,
          first_name: application.firstName,
          last_name: application.lastName,
          age: application.age,
          city: application.city,
          province_state: application.provinceState,
          country: application.country,
          email: application.email,
          phone_number: application.phoneNumber,
          looking_for: application.lookingFor,
          additional_information: application.additionalInformation,
          status: application.status,
          created_at: application.createdAt?.toISOString(),
          updated_at: application.updatedAt?.toISOString(),
        });
      } catch (error) {
        app.logger.error({ error }, 'Error fetching waitlist application');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // PATCH /api/waitlist/applications/:id/status - Update application status
  fastify.patch<{ Params: { id: string }; Body: UpdateStatusRequest }>(
    '/api/waitlist/applications/:id/status',
    {
      schema: {
        description: 'Update the status of a waitlist application',
        tags: ['waitlist'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateStatusRequest }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const { status } = request.body;

        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
          return reply.code(400).send({
            error: 'Invalid status. Must be pending, approved, or rejected',
          });
        }

        const [updated] = await app.db
          .update(schema.waitlistApplications)
          .set({ status: status as 'pending' | 'approved' | 'rejected', updatedAt: new Date() })
          .where(eq(schema.waitlistApplications.id, id))
          .returning();

        if (!updated) {
          return reply.code(404).send({ error: 'Application not found' });
        }

        return reply.send({
          success: true,
          message: 'Application status updated successfully',
        });
      } catch (error) {
        app.logger.error({ error }, 'Error updating waitlist application status');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // GET /api/waitlist/export - Export applications as CSV
  fastify.get<{ Querystring: ExportQuerystring }>(
    '/api/waitlist/export',
    {
      schema: {
        description: 'Export all waitlist applications as CSV',
        tags: ['waitlist'],
        querystring: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
          },
        },
        response: {
          200: {
            type: 'string',
            description: 'CSV file content',
          },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: ExportQuerystring }>, reply: FastifyReply) => {
      try {
        const { status } = request.query;

        const applications = await (status && ['pending', 'approved', 'rejected'].includes(status)
          ? app.db
              .select()
              .from(schema.waitlistApplications)
              .where(
                eq(schema.waitlistApplications.status, status as 'pending' | 'approved' | 'rejected')
              )
              .orderBy(desc(schema.waitlistApplications.createdAt))
          : app.db
              .select()
              .from(schema.waitlistApplications)
              .orderBy(desc(schema.waitlistApplications.createdAt)));

        const csvContent = generateCsvContent(applications);

        reply.type('text/csv;charset=utf-8');
        reply.header('Content-Disposition', 'attachment; filename="waitlist-applications.csv"');
        return reply.send(csvContent);
      } catch (error) {
        app.logger.error({ error }, 'Error exporting waitlist applications');
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

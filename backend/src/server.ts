import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'

type Status = 'Applied' | 'Interview' | 'Offer' | 'Rejected'

type Application = {
    id: number
    company: string
    role: string
    location: string
    status: Status
    appliedDate: string
    nextStep: string
    accent: string
}

const applications: Application[] = [
    { id: 1, company: 'Linear', role: 'Product Design Intern', location: 'Remote', status: 'Interview', appliedDate: '2026-09-18', nextStep: 'Portfolio review · Sep 26', accent: '#e8f3ff' },
    { id: 2, company: 'Vercel', role: 'Frontend Engineering Intern', location: 'New York, NY', status: 'Applied', appliedDate: '2026-09-14', nextStep: 'Follow up in 4 days', accent: '#f0edff' },
    { id: 3, company: 'Notion', role: 'Developer Experience Intern', location: 'San Francisco, CA', status: 'Offer', appliedDate: '2026-08-31', nextStep: 'Decision due · Oct 02', accent: '#e8f7ef' },
    { id: 4, company: 'Figma', role: 'Design Systems Intern', location: 'San Francisco, CA', status: 'Applied', appliedDate: '2026-09-11', nextStep: 'Follow up in 1 day', accent: '#fff1e7' },
    { id: 5, company: 'Stripe', role: 'Backend Engineering Intern', location: 'Seattle, WA', status: 'Rejected', appliedDate: '2026-08-20', nextStep: 'Keep building momentum', accent: '#ffe9ee' },
]

const openApi = {
    openapi: '3.0.3',
    info: { title: 'InternHub API', version: '1.0.0', description: 'API for tracking internship applications and progress.' },
    servers: [{ url: 'http://localhost:4000' }],
    paths: {
        '/api/applications': {
            get: { summary: 'List applications', responses: { '200': { description: 'Application list' } } },
            post: {
                summary: 'Create an application',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ApplicationInput' } } } },
                responses: { '201': { description: 'Created application' }, '400': { description: 'Missing required fields' } },
            },
        },
        '/api/summary': { get: { summary: 'Get dashboard summary', responses: { '200': { description: 'Summary metrics' } } } },
    },
    components: {
        schemas: {
            ApplicationInput: {
                type: 'object', required: ['company', 'role', 'location'],
                properties: { company: { type: 'string' }, role: { type: 'string' }, location: { type: 'string' }, status: { type: 'string', enum: ['Applied', 'Interview', 'Offer', 'Rejected'] } },
            },
        },
    },
}

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApi))

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.get('/api/applications', (_request, response) => response.json(applications))
app.get('/api/summary', (_request, response) => {
    const counts = applications.reduce<Record<string, number>>((summary, application) => {
        summary[application.status] = (summary[application.status] ?? 0) + 1
        return summary
    }, {})
    response.json({ total: applications.length, interviews: counts.Interview ?? 0, offers: counts.Offer ?? 0, responseRate: Math.round(((applications.length - (counts.Applied ?? 0)) / applications.length) * 100) })
})
app.post('/api/applications', (request, response) => {
    const { company, role, location, status = 'Applied' } = request.body as Partial<Application>
    if (!company || !role || !location) {
        response.status(400).json({ message: 'company, role, and location are required' })
        return
    }
    const application: Application = { id: Date.now(), company, role, location, status, appliedDate: new Date().toISOString().slice(0, 10), nextStep: 'Set a follow-up date', accent: '#edf5ff' }
    applications.unshift(application)
    response.status(201).json(application)
})

const port = Number(process.env.PORT ?? 4000)
app.listen(port, () => console.log(`InternHub API running at http://localhost:${port}`))

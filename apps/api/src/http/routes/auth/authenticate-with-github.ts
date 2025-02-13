import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { BadRequestError } from "../_errors/bad-request-error";
import { prisma } from "@/lib/prisma";


export async function authenticateWithGithub(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        '/sessions/github', 
    {
        schema: {
            tags: ['auth'],
            summary: 'Authenticate with github',
            body: z.object({
                code: z.string(),
            }),
            response: {
                201: z.object({
                    token: z.string(),
                })
            }
        },
    },
    async (request, reply) => {
        const { code } = request.body

        const githubOAuthURL = new URL(
            'https://github.com/login/oauth/access_token'
        )

        githubOAuthURL.searchParams.set('client_id', 'Ov23liRfekefL8Mo7tZS')
        githubOAuthURL.searchParams.set('client_secret', '2c07891b46b66f513d811a726f73fedd29acb532')
        githubOAuthURL.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/callback')
        githubOAuthURL.searchParams.set('code', code)

        const githubAccessTokenResponse = await fetch(githubOAuthURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
        })

        const githubAccessTokenData = await githubAccessTokenResponse.json()

        const { access_token: githubAccessToken } = z.object({
            access_token: z.string(),
            token_type: z.literal('bearer'),
            scope: z.string(), 
        })
        .parse(githubAccessTokenData)

        const githubUserResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${githubAccessToken}`
            }
        })

        const githubUserData = await githubUserResponse.json()

        const { id: githubId, name, email, avatar_url: avatarUrl, } = z.object({
            id: z.number().int().transform(String),
            avatar_url: z.string().url(),
            name: z.string().nullable(),
            email: z.string().nullable()
        })
        .parse(githubUserData)

        if ( email === null ) {
            throw new BadRequestError(
                'You GitHub account must have an email to authenticate.'
            )
        }

        let user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name, 
                    email,
                    avatarUrl,
                },
            })
        }

        let account = await prisma.account.findUnique({
            where: {
                provider_userId: {
                    provider: 'GITHUB',
                    userId: user.id,
                }
            }
        })

        if (!account) {
            account = await prisma.account.create({
                data: {
                    provider: 'GITHUB',
                    providerAccountId: githubId,
                    userId: user.id
                }
            })
        }

        const token = await reply.jwtSign({
            sub: user.id,
        },
        {
            sign: {
                expiresIn: '7d',
            },
        },
    )
    }
  )    
}
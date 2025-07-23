import type { D1Database } from '@cloudflare/workers-types'
import type { EventHandlerRequest, H3Event } from 'h3'
import { D1Dialect } from '@atinux/kysely-d1'
import { betterAuth } from 'better-auth'
import { admin, emailOTP } from 'better-auth/plugins'
import { consola } from 'consola'

let _auth: ReturnType<typeof betterAuth>
export function serverAuth() {
  const runtimeConfig = useRuntimeConfig()
  if (!_auth) {
    _auth = betterAuth({
      secret: runtimeConfig.auth.secret,
      database: {
        dialect: new D1Dialect({
          database: hubDatabase() as unknown as D1Database,
        }),
        type: 'sqlite',
      },
      secondaryStorage: {
        get: async (key) => {
          const item = await hubKV().get(`_auth:${key}`)
          return JSON.stringify(item)
        },
        set: (key, value, ttl) => {
          return hubKV().set(`_auth:${key}`, value, { ttl })
        },
        delete: key => hubKV().del(`_auth:${key}`),
      },
      baseURL: getBaseURL(),
      account: {
        accountLinking: {
          enabled: true,
        },
      },
      plugins: [
        admin({
          adminRoles: ['superadmin', 'admin'],
        }),
        emailOTP({
          disableSignUp: true,
          async sendVerificationOTP({ email, otp }) {
            consola.info('SEND VERIFICATION OTP', email, otp)
            const res = await useResend().emails.send({
              from: 'Nexus by Shaoula <noreply@mailer.shaoula.com>',
              to: email,
              subject: "Nexus'a giriş yapmak için doğrulama kodunuz",
              html: `
                            <!DOCTYPE html>
                            <html>
                                <head>
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Nexus Doğrulama Kodu</title>
                                </head>
                                <body style="margin: 0; padding: 20px; background-color: #f9fafb; font-family: Arial, sans-serif;">
                                    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        <img src="https://nexus.shaoula.com/logo-dark.png" alt="Nexus Logo" style="display: block; margin: 0 auto 30px; max-width: 200px;">
                                        <h1 style="color: #111827; font-size: 24px; margin-bottom: 20px; text-align: center;">Doğrulama Kodunuz</h1>
                                        <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 30px; text-align: center;">
                                            Nexus'a giriş yapmak için aşağıdaki doğrulama kodunu kullanın:
                                        </p>
                                        <div style="background-color: #f3f4f6; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                                            <p style="color: #111827; font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 8px; margin: 0;">
                                                ${otp}
                                            </p>
                                        </div>
                                        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 0;">
                                            Bu kodu kimseyle paylaşmayın. Eğer giriş yapmaya çalışmıyorsanız, bu e-postayı görmezden gelebilirsiniz.
                                        </p>
                                    </div>
                                </body>
                            </html>
                        `,
            })
            consola.log(res)
          },
        }),
      ],
    })
  }
  return _auth
}

function getBaseURL() {
  let baseURL = process.env.BETTER_AUTH_URL
  if (!baseURL) {
    try {
      baseURL = getRequestURL(useEvent()).origin
    }
    catch (e) {
      console.error(e)
    }
  }
  return baseURL
}

export async function getAuthSession(event: H3Event<EventHandlerRequest>) {
  const session = await serverAuth().api.getSession({
    headers: event.headers,
  })

  return session
}

// Export auth config type
export type AuthConfig = Parameters<typeof serverAuth>

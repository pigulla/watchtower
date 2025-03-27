import { ConsolaInstance } from 'consola'
import { createTransport } from 'nodemailer'

import { Config } from '../config'

export type SendMail = (data: {
    subject: string
    text: string
}) => Promise<void>

export function sendMailFactory({
    config,
    logger,
}: {
    config: Config
    logger: ConsolaInstance
}): SendMail {
    const log = logger.withTag('sendMail')
    const { host, port, secure, auth, from, to } = config.email

    const transporter = createTransport({
        host,
        port,
        secure,
        auth,
    })

    return async function sendMail({
        subject,
        text,
    }: {
        subject: string
        text: string
    }): Promise<void> {
        log.debug('Sending mail')
        await transporter.sendMail({
            from,
            to,
            subject,
            text,
        })
    }
}

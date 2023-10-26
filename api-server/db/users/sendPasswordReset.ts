import nodemailer, { SendMailOptions } from 'nodemailer';
import prisma from '../prismaSingleton';
import 'dotenv/config';
import { TRPCError } from '@trpc/server';

const {
  NODEMAILER_USER,
  NODEMAILER_PASS,
  FRONTEND_DEV,
  FRONTEND_PROD,
  NODE_ENV,
} = process.env;

const RESTORE_URL =
  (NODE_ENV === 'production' ? FRONTEND_PROD : FRONTEND_DEV) +
  '/recover-password';

export default async function sendPasswordReset({ email }: { email: string }) {
  // check that email exists
  const emailCheck = await prisma.user.findUnique({ where: { email } });
  if (!emailCheck) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'email' });
  }

  const resetCode = await generateResetCode(email);

  const transporter = nodemailer.createTransport({
    host: 'smtp.forwardemail.net',
    port: 465,
    secure: true,
    auth: {
      user: NODEMAILER_USER,
      pass: NODEMAILER_PASS,
    },
  });

  const mailOptions: SendMailOptions = {
    from: '"Forgot Password" <forgot-password@pattyb.dev>',
    to: email,
    subject: 'Your password reset link',
    html: `
    <h1>We heard you could use some help with your password...</h1>
    
    <p>
    Don't sweat it, it happens all the time. Your reset code is below -- copy it and click on the link to go to the password reset form. Assuming you did your job & I did mine, we'll have you sharing recipes again in no time.
    </p>

    <p>
    Oh, and by 'no time' I mean within like 10 minutes...we can't leave these reset codes lying around, so it won't work beyond that. If you run out of time, feel free to request another code.
    </p>

    <p>
      Your reset code is: ${resetCode}
      <a href="${RESTORE_URL}?email=${email}&code=${resetCode}">Password reset form</a>
    </p>

    <p>Now go find something good to cook!</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  return { message: `email sent to ${email}`, messageId: info.messageId };
}

async function generateResetCode(email: string) {
  const resetCode = Math.round(Math.random() * 1000000);

  const reset = await prisma.passwordReset.create({
    data: { resetCode, user: { connect: { email } } },
  });

  return reset.resetCode;
}

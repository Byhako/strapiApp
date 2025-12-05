"use server"

import { type FormState } from "@/validations/auth"
import { SignupFormSchema } from "@/validations/auth"
import { z } from "zod"
import { registerUser } from "@/lib/strapi"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7,  // 7 days
  path: '/',
  httpOnly: true,  // Only accessible by the server
  domain: process.env.HOST ?? 'localhost',
  secure: process.env.NODE_ENV === 'production',
}

export const registerUserAction = async (prevData: FormState, formData: FormData): Promise<FormState> => {

  const fields = {
    username: formData.get('username') as string,
    password: formData.get('password') as string,
    email: formData.get('email') as string,
  }

  const validateFields = SignupFormSchema.safeParse(fields)

  if (!validateFields.success) {
    const errors = z.flattenError(validateFields.error)
    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: errors.fieldErrors,
      data: fields,
    }
  }

  const response = await registerUser(validateFields.data)

  if (!response || response.error) {
    return {
      success: false,
      message: "User registration failed",
      zodErrors: null,
      strapiErrors: response?.error,
      data: fields,
    }
  }

  const cookieStore = await cookies()
  cookieStore.set('jwt', response?.jwt, cookieConfig)
  redirect('/dashboard')

}

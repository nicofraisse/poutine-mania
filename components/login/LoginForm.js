import { useState, useRef } from 'react'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

async function createUser(email, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!')
  }

  return data
}

function AuthForm() {
  const emailInputRef = useRef()
  const passwordInputRef = useRef()
  const { push } = useRouter()

  async function submitHandler(event) {
    event.preventDefault()
    const enteredEmail = emailInputRef.current.value
    const enteredPassword = passwordInputRef.current.value
    const result = await signIn('credentials', {
      email: enteredEmail,
      password: enteredPassword,
      callbackUrl: `/`,
    })

    if (!result.error) {
      toast.error('erreur')
    }
  }

  return (
    <section className='text-center mx-auto max-w-xs bg-neutral-500 px-8 py-6 mt-20 shadow-xl text-white rounded-lg'>
      <h1 className='font-bold text-2xl mb-4'>Login</h1>
      <form onSubmit={submitHandler}>
        <div className='flex flex-col justify-center mb-3'>
          <label htmlFor='email'>Your Email</label>
          <input
            className='text-black px-2 w-full py-1 border rounded-lg'
            type='email'
            id='email'
            required
            ref={emailInputRef}
          />
        </div>
        <div className='flex flex-col align-center justify-center mb-3'>
          <label htmlFor='password'>Your Password</label>
          <input
            className='text-black px-2 w-full py-1 border rounded-lg'
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <div className='mt-6 flex justify-between items-center'>
          <button className='bg-green-300 rounded-lg text-black px-4 py-2'>Login</button>
          <button type='button' className='ml-4' onClick={() => push('/sign-up')}>
            Créer un compte
          </button>
        </div>
      </form>
    </section>
  )
}

export default AuthForm

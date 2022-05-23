import React from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import { useRouter } from 'next/dist/client/router'
import toast from 'react-hot-toast'
import Form from 'components/Form'
import Field from 'components/Field'
import Button from 'components/Button'
import { useLoginForm } from '../context/LoginFormProvider'

const SignUp = ({ onSubmit }) => {
  const { push } = useRouter()
  const { openLogin, closeSignup } = useLoginForm()

  const handleSubmit = (values, formikBag) => {
    axios
      .post('/api/auth/signup', values)
      .then(() => {
        toast.success('Inscription réussie!')
        push('/')
        formikBag.setSubmitting(false)
        onSubmit && onSubmit()
      })
      .catch((e) => {
        toast.error(e?.response?.data?.message || e.message)
        formikBag.setSubmitting(false)
      })
  }

  const handleSwitchForm = () => {
    closeSignup()
    openLogin()
  }

  return (
    <Form
      initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object({
        firstName: Yup.string().min(1).required('Required'),
        lastName: Yup.string().min(1).required('Required'),
        email: Yup.string().min(1).required('Required'),
        password: Yup.string().min(1).required('Required'),
      })}
      className='max-w-sm p-4'
    >
      {({ isSubmitting }) => (
        <>
          <div className='flex'>
            <Field name='firstName' className='pr-[6px]' />
            <Field name='lastName' className='pl-[6px]' />
          </div>

          <Field name='email' />
          <Field name='password' type='password' />
          <div className='text-sm'>
            Vous avez déjà un compte?{' '}
            <span className='font-bold cursor-pointer hover:underline' onClick={handleSwitchForm}>
              Connectez-vous
            </span>
          </div>
          <Button type='submit' variant='primary' className='mt-6' loading={isSubmitting}>
            Je m&apos;inscris
          </Button>
        </>
      )}
    </Form>
  )
}

export default SignUp

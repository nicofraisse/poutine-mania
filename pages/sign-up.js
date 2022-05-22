import React from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import { useRouter } from 'next/dist/client/router'
import toast from 'react-hot-toast'
import Form from 'components/Form'
import Field from 'components/Field'
import Button from '../components/Button'

const SignUp = () => {
  const { push } = useRouter()

  const handleSubmit = (values) => {
    axios
      .post('/api/auth/signup', values)
      .then((data) => {
        toast.success('Sign up successful')
        push('/')
      })
      .catch((e) => {
        toast.error(e.response.data.message)
      })
  }

  return (
    <div className='border max-w-sm p-10 mx-auto mt-20'>
      <Form
        initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          firstName: Yup.string().min(1).required('Required'),
          lastName: Yup.string().min(1).required('Required'),
          email: Yup.string().min(1).required('Required'),
          password: Yup.string().min(1).required('Required'),
        })}
      >
        {({ touched, errors }) => (
          <>
            <div className='flex'>
              <Field name='firstName' className='pr-[6px]' />
              <Field name='lastName' className='pl-[6px]' />
            </div>

            <Field name='email' />

            <Field name='password' />

            {touched.firstName && errors ? (
              <div className='my-2 text-sm text-red-500'>{JSON.stringify(errors)}</div>
            ) : null}

            <Button type='submit' variant='primary' className='mt-6'>
              Je m&apos;inscris
            </Button>
          </>
        )}
      </Form>
    </div>
  )
}

export default SignUp

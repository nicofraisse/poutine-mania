import { signIn } from 'next-auth/client'
import toast from 'react-hot-toast'
import Button from '../Button'
import * as Yup from 'yup'
import Form from 'components/Form'
import Field from 'components/Field'
import { useLoginForm } from '../context/LoginFormProvider'

const Login = ({ onSubmit }) => {
  const { openSignup, closeLogin } = useLoginForm()
  const handleSubmit = (values) => {
    signIn('credentials', values)
      .then(() => {
        toast.success('Connexion réussie')
        onSubmit && onSubmit()
      })
      .catch((e) => toast.error(e.message))
  }

  const handleSwitchForm = () => {
    closeLogin()
    openSignup()
  }

  return (
    <Form
      initialValues={{ email: '', password: '' }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object({
        email: Yup.string().min(1).required('Required'),
        password: Yup.string().min(1).required('Required'),
      })}
      className='w-[330px] p-4'
    >
      {({ isSubmitting }) => (
        <>
          <Field name='email' />
          <Field name='password' type='password' />
          <div className='text-sm'>
            Vous n&apos;avez pas de compte?{' '}
            <span className='font-bold cursor-pointer hover:underline' onClick={handleSwitchForm}>
              Inscrivez-vous
            </span>
          </div>
          <Button type='submit' variant='primary' className='mt-6' loading={isSubmitting}>
            Connexion
          </Button>
        </>
      )}
    </Form>
  )
}

export default Login

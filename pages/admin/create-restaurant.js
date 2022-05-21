import React from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import { useRouter } from 'next/dist/client/router'
import toast from 'react-hot-toast'
import Button from '../../components/Button'

import Form from 'components/Form'
import Field from 'components/Field'
import DynamicInput from '../../components/controls/DynamicInput'

const CreateRestaurant = () => {
  const { push } = useRouter()

  const handleSubmit = (values) => {
    axios
      .post('/api/restaurants/create', values)
      .then((data) => {
        push('/restaurants')
      })

      .catch((err) => toast.error(err.message))
  }

  return (
    <div className='w-[400px] py-10 px-16'>
      <h1 className='my-4 text-2xl'>Nouveau Restaurant</h1>
      <Form
        initialValues={{ name: '', addresses: JSON.stringify([]) }}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          name: Yup.string().min(1).required('Required'),
          addresses: Yup.string().min(1).required('Requis'),
        })}
      >
        {({ errors, values }) => (
          <>
            <Field name='name' />
            <Field name='addresses' control={DynamicInput} label='Adresse(s)' />
            {JSON.stringify(errors)}
            {JSON.stringify(values)}
            <Button
              className='bg-gray-300 px-4 py-1 rounded-lg shadoow mx-2 w-40'
              type='submit'
              size='sm'
            >
              Valider
            </Button>
          </>
        )}
      </Form>
    </div>
  )
}

export default CreateRestaurant

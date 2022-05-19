import React from 'react'
import { Formik, Field, Form } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import { useRouter } from 'next/dist/client/router'

const CreateRestaurant = () => {
  const { push } = useRouter()

  const handleSubmit = (values) => {
    axios
      .post('/api/restaurants/create', values)
      .then((data) => {
        push('/restaurants')
      })

      .catch((err) => console.log(err))
  }

  return (
    <div className='p-16' justify-center>
      <h1 className='my-4 text-2xl'>Nouveau Restaurant</h1>
      <Formik
        initialValues={{ name: '' }}
        onSubmit={handleSubmit}
        className='border'
        validationSchema={Yup.object({
          name: Yup.string().min(1).required('Required'),
        })}
      >
        {({ touched, errors }) => (
          <Form>
            <div>Nom du restaurant</div>
            <Field name='name' className='border' />
            {touched.name && errors.name ? <div>{errors.name}</div> : null}
            <button className='bg-gray-300 px-4 py-1 rounded-lg shadoow mx-2' type='submit'>
              CREER LE RESTORAN
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CreateRestaurant

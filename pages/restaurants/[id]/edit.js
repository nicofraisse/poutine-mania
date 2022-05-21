import React from 'react'
import { Formik, Field, Form } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import { useRouter } from 'next/dist/client/router'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const EditRestaurants = () => {
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const { query } = useRouter()

  useEffect(() => {
    if (query.id) {
      axios
        .get(`/api/restaurants/${query.id}`)
        .then(({ data }) => {
          setLoading(false)
          setRestaurant(data)
        })
        .catch((e) => toast.error(e.message))
    }
  }, [query])

  const { push } = useRouter()

  const handleSubmit = (values) => {
    axios
      .post(`/api/restaurants/${query.id}/update`, values)
      .then((data) => {
        push('/restaurants')
      })
      .catch((err) => console.log(err))
  }

  if (!restaurant || loading) return 'loading'

  return (
    <div className='p-16' justify-center>
      <h1 className='my-4 text-2xl'>Nouveau Restaurant</h1>
      <Formik
        initialValues={{ name: restaurant.name }}
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
              MODIFIER LE RESTORAN
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EditRestaurants

import React from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import { useRouter } from 'next/dist/client/router'
import toast from 'react-hot-toast'
import Button from '../../components/Button'
import { useGet } from 'lib/useAxios'
import Form from 'components/Form'
import Field from 'components/Field'
import AutocompleteSelect from '../../components/controls/AutocompleteSelect'
import Spinner from '../Spinner'

const RestaurantForm = ({ type, onSubmit }) => {
  const { push, query } = useRouter()

  const {
    data: restaurant,
    loading,
    error,
  } = useGet(`/api/restaurants/${query.id}`, { skip: !query.id })

  const handleSubmit = (values, { setSubmitting }) => {
    if (type === 'create') {
      axios
        .post('/api/restaurants/create', values)
        .then(() => {
          setSubmitting(false)
          toast.success(type + ' success')
          onSubmit && onSubmit()
        })
        .catch((err) => toast.error(err.message))
    } else if (type === 'update') {
      axios
        .post(`/api/restaurants/${query.id}/update`, values)
        .then(() => {
          toast.success(type + ' success')
        })
        .catch((err) => toase.error(err))
    }
  }

  if (loading) return <Spinner />

  return (
    <Form
      initialValues={{
        name: type === 'update' ? restaurant.name : '',
        addresses: type === 'update' ? restaurant.addresses : [],
      }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object({
        name: Yup.string().min(1).required('Required'),
        addresses: Yup.array().min(1, 'Requis').required('required'),
      })}
    >
      {({ isSubmitting, errors }) => (
        <>
          <Field name='name' />
          <Field name='addresses' control={AutocompleteSelect} label='Adresse(s)' />
          {JSON.stringify(errors)}
          <Button
            loading={isSubmitting}
            className='bg-gray-300 px-4 py-1 rounded-lg shadoow w-40'
            type='submit'
            size='sm'
          >
            Valider
          </Button>
        </>
      )}
    </Form>
  )
}

export default RestaurantForm

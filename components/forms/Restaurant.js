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
  const { query, push } = useRouter()

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
          push(`/admin/restaurants`)
        })
        .catch((err) => toast.error(err.message))
    } else if (type === 'update') {
      axios
        .post(`/api/restaurants/${query.id}/update`, values)
        .then(() => {
          toast.success(type + ' success')
          push(`/admin/restaurants`)
        })
        .catch((err) => toast.error(err.message))
    }
  }

  if (loading || (type === 'update' && !restaurant)) return <Spinner />

  return (
    <Form
      initialValues={{
        name: type === 'update' ? restaurant.name : '',
        phoneNumber: type === 'update' ? restaurant.phoneNumber : '',
        website: type === 'update' ? restaurant.website : '',
        addresses: type === 'update' ? restaurant.addresses : [],
        priceRange: type === 'update' ? restaurant.priceRange : [],
      }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object({
        name: Yup.string().min(1).required('Required'),
        phoneNumber: Yup.string().min(1),
        website: Yup.string().min(1),
        addresses: Yup.array().min(1, 'Requis').required('required'),
        priceRange: Yup.number().min(1).max(3),
      })}
    >
      {({ isSubmitting, errors }) => (
        <>
          <Field name='name' />
          <Field name='addresses' control={AutocompleteSelect} label='Adresse(s)' />
          <Field name='phoneNumber' label='Numéro de téléphone' />
          <Field name='website' label='Site internet' />
          <Field name='priceRange' type='number' label='Gamme de prix' min={1} max={3} />
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

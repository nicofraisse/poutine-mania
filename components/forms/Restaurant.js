import React, { useEffect, useState } from 'react'
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
import { Plus, Trash } from 'react-feather'
import { cloneDeep } from 'lodash'
import classNames from 'classnames'

const RestaurantForm = ({ type, onSubmit }) => {
  const { query, push } = useRouter()
  const [succursales, setSuccursales] = useState([{ address: '', phoneNumber: '' }])

  const { data: restaurant, loading } = useGet(`/api/restaurants/${query.id}`, { skip: !query.id })

  const handleSubmit = (values, { setSubmitting }) => {
    console.log(succursales)
    if (succursales.find((s) => !s.address && !s.hide)) {
      setSubmitting(false)
      window.alert('Adresse vide!')
      return
    }

    const submitValues = {
      name: values.name,
      succursales: succursales.filter((s) => !s.hide),
      website: values.website,
      phoneNumber: values.phoneNumber,
      priceRange: values.priceRange,
    }
    if (type === 'create') {
      axios
        .post('/api/restaurants/create', submitValues)
        .then(() => {
          setSubmitting(false)
          toast.success(type + ' success')
          onSubmit && onSubmit()
          push(`/admin/restaurants`)
        })
        .catch((err) => toast.error(err.message))
    } else if (type === 'update') {
      axios
        .post(`/api/restaurants/${query.id}/update`, submitValues)
        .then(() => {
          toast.success(type + ' success')
          push(`/admin/restaurants`)
        })
        .catch((err) => toast.error(err.message))
    }
  }

  useEffect(() => {
    if (restaurant?.succursales && succursales[0].address === '') {
      console.log('ok')
      setSuccursales(restaurant.succursales)
    }
  }, [restaurant, succursales])

  useEffect(() => {
    console.log({ succursales })
  }, [succursales])

  const updateSuccursaleField = (value, index, field) => {
    const succursalesCopy = cloneDeep(succursales)
    succursalesCopy[index][field] = value
    setSuccursales(succursalesCopy)
  }

  if (loading || (type === 'update' && !restaurant)) return <Spinner />

  const initialValues = {
    name: type === 'update' ? restaurant.name : '',
    website: type === 'update' ? restaurant.website : '',
    priceRange: type === 'update' ? restaurant.priceRange : [],
  }

  if (type === 'update') {
    restaurant.succursales.forEach((succursale, index) => {
      initialValues[`address-${index}`] = {
        label: succursale.address.place_name,
        value: succursale.address,
      }
      initialValues[`phoneNumber-${index}`] = succursale.phoneNumber
    })
  }

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={Yup.object({
        name: Yup.string().min(1).required('Required'),
        website: Yup.string().min(1),
        priceRange: Yup.number().min(1).max(3),
      })}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <>
          {console.log({ values })}
          <Field name='name' />

          <Field name='website' label='Site internet' />
          <Field name='priceRange' type='number' label='Gamme de prix' min={1} max={3} />
          {succursales.map((succursale, index) => (
            <div
              key={index}
              className={classNames('border p-4 rounded mb-3 bg-gray-50 relative', {
                hidden: succursale.hide,
              })}
            >
              {index !== 0 && (
                <Trash
                  className='absolute right-4 top-3 text-gray-400 hover:text-gray-600'
                  size={18}
                  onClick={() => {
                    if (window.confirm('Supprimer la succursale?')) {
                      setFieldValue(`address-${index}`, { label: '', value: '' })
                      setFieldValue(`phoneNumber-${index}`, '')

                      setSuccursales(
                        succursales.map((s, i) => {
                          if (i === index) {
                            return { address: '', phoneNumber: '', hide: true }
                          }
                          return s
                        })
                      )
                    }
                  }}
                />
              )}
              <div>index: {index}</div>
              <Field
                name={`address-${index}`}
                onChange={(value, formikBag) => {
                  setFieldValue(`address-${index}`, { label: value.place_name, value })
                  updateSuccursaleField(value, index, 'address')
                }}
                // value={succursales[index].address}
                control={AutocompleteSelect}
                label='Adresse'
              />
              <Field
                name={`phoneNumber-${index}`}
                label='Numéro de téléphone'
                value={succursale.phoneNumber}
                onChange={(e) => updateSuccursaleField(e.target.value, index, 'phoneNumber')}
              />
            </div>
          ))}

          <div className='flex items-center justify-between'>
            <Button
              type='button'
              variant='light'
              size='sm'
              className=''
              onClick={() => setSuccursales([...succursales, { address: '', phoneNumber: '' }])}
            >
              <Plus size={20} className='mr-1' />
              Ajouter une succursale
            </Button>
            <Button
              loading={isSubmitting}
              className='bg-gray-300 px-4 py-1 rounded-lg shadoow w-40'
              type='submit'
              size='sm'
            >
              Valider
            </Button>
          </div>
        </>
      )}
    </Form>
  )
}

export default RestaurantForm

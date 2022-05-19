import { Form as FormikForm, Formik } from 'formik'
import { createContext } from 'react'

export const FormContext = createContext()

export const Form = ({ children, className, id, validationSchema, ...props }) => {
  return (
    <FormContext.Provider value={{ id, validationSchema }}>
      <Formik {...props} validationSchema={validationSchema}>
        {({ handleSubmit, ...props }) => {
          return (
            <FormikForm className={className} onSubmit={handleSubmit}>
              {children(props)}
            </FormikForm>
          )
        }}
      </Formik>
    </FormContext.Provider>
  )
}

export default Form

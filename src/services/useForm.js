import { useEffect, useState } from 'react';

const useForm = (
  initialValues,
  validator,
  isSubmitting,
  setSubmittingAction,
  submitAction
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = ({ target: { name, value } }) => {
    setValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleBlur = ({ target: { name, value } }) => {
    const { valuesAreValid, errors } = validator({ [name]: value });
    setErrors(prevErrors => {
      if (valuesAreValid) {
        // remove this field's error
        const { [name]: noop, ...newErrors } = prevErrors;
        return newErrors;
      } else {
        return { ...prevErrors, ...errors };
      }
    });
  };

  const handleSubmit = e => {
    const { valuesAreValid, errors } = validator(values);
    setErrors(errors);
    valuesAreValid && setSubmittingAction(true);
    e.preventDefault();
  };

  useEffect(() => {
    isSubmitting && submitAction(values);
  }, [isSubmitting]);

  return { values, handleChange, handleBlur, handleSubmit, errors };
};

export default useForm;

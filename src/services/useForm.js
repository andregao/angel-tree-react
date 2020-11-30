import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const useForm = (
  initialValues,
  validator,
  isSubmitting,
  setSubmitting,
  submit
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
    e.preventDefault();
    const { valuesAreValid, errors } = validator(values);
    setErrors(errors);
    valuesAreValid && setSubmitting(true);
  };

  const history = useHistory();
  useEffect(() => {
    if (isSubmitting) {
      submit(values).then(result => {
        if (result.status === 200) {
          // redirect to success page
          history.push('/success');
        }
        if (result.status === 403) {
          // prompt and click to go home
          history.push('/pick-another');
        }
        // server error, retry
        setSubmitting(false);
      });
    }
  }, [isSubmitting]);

  return { values, handleChange, handleBlur, handleSubmit, errors };
};

export default useForm;

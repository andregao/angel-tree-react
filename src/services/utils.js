export const itemsFromArray = array => {
  let result = '';
  array.map(item => (result += `${item}, `));
  return result;
};

export const itemsToArray = str => {
  return str
    .trim()
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 1);
};
export const getRandomItem = collection =>
  collection[Math.floor(Math.random() * collection.length)];
export const getRandomItems = (collection, count) => {
  const usedIndices = {};
  const result = [];
  for (let i = 0; i < count; i++) {
    const pick = Math.floor(Math.random() * collection.length);
    if (!usedIndices[pick]) {
      usedIndices[pick] = true;
      result.push(collection[pick]);
    } else {
      i--;
    }
  }
  return result;
};

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateForm = data => {
  const { email, phone, name } = data;
  let errors = {};
  name !== undefined && (errors = validateName(name, errors));
  email !== undefined && (errors = validateEmail(email, errors));
  phone !== undefined && (errors = validatePhone(phone, errors));
  const valuesAreValid = Object.keys(errors).length === 0;
  return { valuesAreValid, errors };
};
function validateName(name, prevErrors) {
  if (name.trim() === '') {
    return { ...prevErrors, name: 'Name is required' };
  }
  if (name.trim().length < 3) {
    return { ...prevErrors, name: 'Please use your full name' };
  }
  return prevErrors;
}
function validateEmail(email, prevErrors) {
  if (email.trim() === '') {
    return { ...prevErrors, email: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { ...prevErrors, email: 'Invalid email address' };
  }
  return prevErrors;
}

function validatePhone(phone, prevErrors) {
  if (phone.trim() === '') {
    return { ...prevErrors, phone: 'Phone number is required' };
  }
  if (phone.trim().length < 10) {
    return { ...prevErrors, phone: 'Please enter a valid number' };
  }
  return prevErrors;
}

export const FUNCTIONS_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://Andre-Macbook.local:3001'
    : 'https://3bd2j300fk.execute-api.us-east-1.amazonaws.com/Prod';

export async function getTreeData() {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/tree`);
  const data = await response.json();
  return data.content;
}

export async function getAdminData(secret) {
  return await fetch(`${FUNCTIONS_BASE_URL}/admin`, {
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  });
  // const data = await response.json();
  // return data.content;
}

export async function getChildInfo(id) {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/child/info/${id}`);
  return await response.json();
}

export async function sendSubmission(data) {
  console.log('posting to database', data);
  const { childId } = data;
  return await fetch(`${FUNCTIONS_BASE_URL}/donate/${childId}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

function wrapPromise(promise) {
  let status = 'pending';
  let result;
  let suspender = promise.then(
    r => {
      status = 'success';
      result = r;
    },
    e => {
      status = 'error';
      result = e;
    }
  );
  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    },
  };
}

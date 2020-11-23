export const FUNCTIONS_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://Andre-Macbook.local:3001'
    : 'https://8obndk0xs3.execute-api.us-east-1.amazonaws.com/Prod';

export async function getTreeData() {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/tree`);
  const data = await response.json();
  return data.content;
}

export async function getChildInfo(id) {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/child/info/${id}`);
  return await response.json();
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

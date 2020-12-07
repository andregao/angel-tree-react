export const FUNCTIONS_BASE_URL =
  'https://st71g32d7l.execute-api.us-west-1.amazonaws.com/Prod';
// process.env.NODE_ENV === 'development'
//   ? 'http://docker.for.mac.localhost:3001'
//   : 'https://st71g32d7l.execute-api.us-west-1.amazonaws.com/Prod';

export async function getTreeData() {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/tree`);
  const data = await response.json();
  return data.content;
}

export async function getChildrenData(secret) {
  return await fetch(`${FUNCTIONS_BASE_URL}/children`, {
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  });
}
export async function getDonationsData(secret) {
  return await fetch(`${FUNCTIONS_BASE_URL}/donations`, {
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  });
}

export async function getChildInfo(id) {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/child/info/${id}`);
  return await response.json();
}

export async function sendSubmission(data) {
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

export async function postNewChild(data, secret) {
  return await fetch(`${FUNCTIONS_BASE_URL}/child`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify(data),
  });
}

export async function postWaitlist(data) {
  return await fetch(`${FUNCTIONS_BASE_URL}/waitlist`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function updateChild(data, secret) {
  return await fetch(`${FUNCTIONS_BASE_URL}/child/${data.id}`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteChild(id, secret) {
  return await fetch(`${FUNCTIONS_BASE_URL}/child/${id}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
  });
}

export async function updateDonation(data, secret) {
  return await fetch(`${FUNCTIONS_BASE_URL}/donation/${data.id}`, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteDonation(id, secret) {
  return await fetch(`${FUNCTIONS_BASE_URL}/donation/${id}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
  });
}

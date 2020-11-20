export const FUNCTIONS_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://Andre-Macbook.local:3001'
    : 'https://8obndk0xs3.execute-api.us-east-1.amazonaws.com/Prod';

export async function getTreeData() {
  const response = await fetch(`${FUNCTIONS_BASE_URL}/tree`);
  const data = await response.json();
  return data.content;
}

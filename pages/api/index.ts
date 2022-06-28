export const fetcher = (url: string) => fetch(url).then((res) => res.json())

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export const post = (url: string, body: any) => {
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  }).then(handleResponse)
}

export const put = (url: string, body: any) => {
  return fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  }).then(handleResponse)
}

export const remove = (url: string) => {
  return fetch(url, {
    method: 'DELETE',
    headers,
  }).then(handleResponse)
}

const handleResponse = (response: Response) => {
  if (!response.ok) {
    throw Error(response.statusText)
  }

  return response
    .clone()
    .json()
    .catch(() => response.text())
}

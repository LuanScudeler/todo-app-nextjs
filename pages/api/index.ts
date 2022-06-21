export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const post = (url: string, body: any) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(handleResponse)
}

export const remove = (url: string) => {
  return fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(handleResponse)
}

function handleResponse(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }

  return response
    .clone()
    .json()
    .catch(() => response.text())
}

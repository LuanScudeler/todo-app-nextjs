export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const post = (url: string, body: any) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json())
}

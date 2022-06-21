export const getErrorMessage = (erro: unknown) => {
  let error = 'Unknown Error'

  if (erro instanceof Error) error = erro.message
  return error
}

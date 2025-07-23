import type { IUser } from '~~/types'

const _baseUrl = '/api/users'
const _baseKey = 'users'
type BaseType = IUser
interface InviteType {
  name: string
  email: string
}

export const useUser = defineQuery(() => {
  const { data, ...rest } = useQuery({
    key: [_baseKey],
    query: async (): Promise<BaseType[]> => {
      const { data } = await useFetch<BaseType[]>(_baseUrl)
      return data.value ?? []
    },
  })

  const getUser = (id: string): BaseType | undefined => {
    const foundData = data.value?.find((record) => {
      return record.id === id
    })

    if (!foundData)
      return undefined

    return foundData
  }

  const refetchUser = async (id: string) => {
    const foundData = getUser(id)

    if (!foundData)
      return

    // Refetch user
    const { data: fetchedData } = await useFetch<BaseType>(`${_baseUrl}/${id}`)

    return fetchedData.value
  }

  return {
    users: data,
    ...rest,

    // Functions
    getUser,
    refetchUser,
  }
})

// Invite Member
export const useInviteUser = defineMutation(() => {
  const { mutateAsync, ...rest } = useMutation({
    mutation: async (data: InviteType) => {
      const response = await fetch(`${_baseUrl}/invite`, { method: 'POST', body: JSON.stringify(data) })

      if (!response.ok)
        throw createError(response)

      return response.json()
    },
  })

  return { inviteUser: mutateAsync, ...rest }
})

export const useSaveUser = defineMutation(() => {
  const queryCache = useQueryCache()

  const { mutateAsync, ...rest } = useMutation({
    mutation: async (data: BaseType) => {
      const url = data.id ? `${_baseUrl}/${data.id}` : _baseUrl
      const method = data.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: JSON.stringify(data),
      })

      if (!response.ok)
        throw createError(response)

      return response.json()
    },
    onSettled: () => queryCache.invalidateQueries({ key: [_baseKey] }),
  })

  return { saveUser: mutateAsync, ...rest }
})

export const useDeleteUser = defineMutation(() => {
  const queryCache = useQueryCache()

  const { mutateAsync, ...rest } = useMutation({
    mutation: async (id: string) => {
      const response = await fetch(`${_baseUrl}/${id}`, { method: 'DELETE' })

      if (!response.ok)
        throw createError(response)

      return response.json()
    },
    onSettled: () => queryCache.invalidateQueries({ key: [_baseKey] }),
  })

  return { deleteUser: mutateAsync, ...rest }
})

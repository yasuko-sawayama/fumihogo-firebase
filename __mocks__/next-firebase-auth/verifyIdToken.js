import getMockAuthUser from '../../utils/testUtils/getMockAuthUser'

const verifyIdToken = jest.fn(async (token) => {
  if (!token) {
    throw new Error('verifyIdToken requires a token')
  }
  return getMockAuthUser()
})

export default verifyIdToken

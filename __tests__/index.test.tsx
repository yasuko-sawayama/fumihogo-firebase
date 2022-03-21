import { render, screen } from '@testing-library/react'
import Home from '../pages'

jest.mock('next-firebase-auth')

describe('Home', () => {
  afterAll(() => {
    // Reset the mocks so that they don't bleed into the next test suite.
    jest.resetAllMocks()
  })
  it('renders a heading', () => {
    render(<Home />)
    console.log(screen.debug())
    const heading = screen.getByRole('heading', {
      name: /ふみほご/i,
    })

    expect(heading).toBeInTheDocument()
  })
})

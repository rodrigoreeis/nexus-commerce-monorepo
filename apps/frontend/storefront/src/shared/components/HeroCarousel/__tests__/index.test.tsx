import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeroCarousel, HeroSlide } from '../index'

const mockSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    imageUrl: 'http://localhost:8080/banners/banner1.jpg',
    alt: 'Banner Oferta 1',
    href: '#link-1',
  },
  {
    id: 'slide-2',
    imageUrl: 'http://localhost:8080/banners/banner2.jpg',
    alt: 'Banner Oferta 2',
    href: '#link-2',
  },
]

describe('HeroCarousel component', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('renders image banner with alt text and fixed dimensions attributes', () => {
    render(<HeroCarousel slides={mockSlides} />)

    const img1 = screen.getByAltText('Banner Oferta 1')
    expect(img1).toBeInTheDocument()
    expect(img1).toHaveAttribute('src', 'http://localhost:8080/banners/banner1.jpg')
    expect(img1).toHaveAttribute('width', '1600')
    expect(img1).toHaveAttribute('height', '440')
    expect(screen.getByRole('link', { name: 'Banner Oferta 1' })).toHaveAttribute('href', '#link-1')
  })

  it('navigates to next and previous slides using arrow buttons', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<HeroCarousel slides={mockSlides} />)

    const nextButton = screen.getByRole('button', { name: 'Próximo slide' })
    await user.click(nextButton)

    const slide2 = screen.getByRole('group', { name: /Banner Oferta 2/i })
    expect(slide2).toHaveAttribute('aria-hidden', 'false')

    const prevButton = screen.getByRole('button', { name: 'Slide anterior' })
    await user.click(prevButton)

    const slide1 = screen.getByRole('group', { name: /Banner Oferta 1/i })
    expect(slide1).toHaveAttribute('aria-hidden', 'false')
  })

  it('navigates using dot indicators', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    render(<HeroCarousel slides={mockSlides} />)

    const dot2 = screen.getByRole('tab', { name: /Ir para banner 2/i })
    await user.click(dot2)

    const slide2 = screen.getByRole('group', { name: /Banner Oferta 2/i })
    expect(slide2).toHaveAttribute('aria-hidden', 'false')
  })

  it('automatically advances slides via timer', () => {
    render(<HeroCarousel slides={mockSlides} autoplayInterval={3000} />)

    const slide1 = screen.getByRole('group', { name: /Banner Oferta 1/i })
    expect(slide1).toHaveAttribute('aria-hidden', 'false')

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    const slide2 = screen.getByRole('group', { name: /Banner Oferta 2/i })
    expect(slide2).toHaveAttribute('aria-hidden', 'false')
  })

  it('returns null when slides array is empty', () => {
    const { container } = render(<HeroCarousel slides={[]} />)
    expect(container.firstChild).toBeNull()
  })
})

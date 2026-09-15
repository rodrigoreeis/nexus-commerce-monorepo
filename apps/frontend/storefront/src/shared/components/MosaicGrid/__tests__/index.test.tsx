import { render, screen } from '@testing-library/react'
import { MosaicGrid, defaultMosaicItems } from '../index'

describe('MosaicGrid component (Pinterest-style Masonry)', () => {
  it('renders section heading, subtitle, and all default banner cards', () => {
    render(<MosaicGrid />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Inspirações & Tendências' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Explore coleções exclusivas, tecnologia de ponta/i)
    ).toBeInTheDocument()

    const grid = screen.getByTestId('mosaic-grid')
    expect(grid).toBeInTheDocument()

    // Verify all 8 default items are rendered with titles and tags
    defaultMosaicItems.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument()
      expect(screen.getByText(item.tag)).toBeInTheDocument()
      const img = screen.getByAltText(item.alt)
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', item.imageUrl)
    })
  })

  it('supports custom title, subtitle, and custom items', () => {
    const customItems = [
      {
        id: 'custom-1',
        title: 'Coleção Exclusiva de Inverno',
        tag: 'Destaque',
        imageUrl: 'https://images.unsplash.com/photo-custom?auto=format&fit=crop&w=800&q=80',
        aspectRatioClass: 'aspect-[3/4]',
        alt: 'Banner de Inverno',
      },
    ]

    render(
      <MosaicGrid
        title="Galeria Customizada"
        subtitle="Subtítulo da galeria customizada"
        items={customItems}
      />
    )

    expect(
      screen.getByRole('heading', { level: 2, name: 'Galeria Customizada' })
    ).toBeInTheDocument()
    expect(screen.getByText('Subtítulo da galeria customizada')).toBeInTheDocument()
    expect(screen.getByText('Coleção Exclusiva de Inverno')).toBeInTheDocument()
    expect(screen.getByText('Destaque')).toBeInTheDocument()
    expect(screen.getByAltText('Banner de Inverno')).toHaveAttribute(
      'src',
      customItems[0].imageUrl
    )
  })
})

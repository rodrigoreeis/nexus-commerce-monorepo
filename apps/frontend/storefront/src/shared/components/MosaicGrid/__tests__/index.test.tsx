import { render, screen } from '@testing-library/react'
import { MosaicGrid, defaultMosaicItems } from '../index'

describe('MosaicGrid component (6-item Pinterest-style masonry grid)', () => {
  it('renders section heading, subtitle, and all 6 default banner cards', () => {
    render(<MosaicGrid />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Inspirações & Tendências' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Explore coleções exclusivas, tecnologia de ponta/i)
    ).toBeInTheDocument()

    const grid = screen.getByTestId('mosaic-grid')
    expect(grid).toBeInTheDocument()

    expect(defaultMosaicItems).toHaveLength(6)

    // Verify all 6 default items are rendered with titles and images
    defaultMosaicItems.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument()
      const img = screen.getByAltText(item.alt)
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', item.imageUrl)
    })

    // Ensure no tag badges or "ver destaques" exist
    expect(screen.queryByText(/Ver destaques/i)).not.toBeInTheDocument()
  })

  it('supports custom title, subtitle, and custom items', () => {
    const customItems = [
      {
        id: 'custom-1',
        title: 'Coleção Exclusiva de Inverno',
        imageUrl: 'https://images.unsplash.com/photo-custom?auto=format&fit=crop&w=800&q=80',
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
    expect(screen.getByAltText('Banner de Inverno')).toHaveAttribute(
      'src',
      customItems[0].imageUrl
    )
  })
})

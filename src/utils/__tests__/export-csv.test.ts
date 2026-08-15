import { exportToCsv } from '../export-csv'

describe('exportToCsv', () => {
  beforeEach(() => {
    // Mock navigator and document APIs used for downloading
    Object.defineProperty(window.navigator, 'msSaveBlob', {
      value: jest.fn(),
      configurable: true,
    })
    
    Object.defineProperty(global, 'URL', {
      value: {
        createObjectURL: jest.fn(() => 'blob:url'),
      },
      writable: true,
    })
    document.createElement = jest.fn().mockReturnValue({
      setAttribute: jest.fn(),
      click: jest.fn(),
      style: {},
      download: '',
    })
    document.body.appendChild = jest.fn()
    document.body.removeChild = jest.fn()
  })

  it('handles empty data', () => {
    exportToCsv('test.csv', [])
    expect(window.URL.createObjectURL).not.toHaveBeenCalled()
  })

  it('exports data correctly', () => {
    const data = [
      { id: 1, name: 'Alice', notes: 'Has "quotes"' },
      { id: 2, name: 'Bob', notes: 'Has, commas' },
    ]
    exportToCsv('test.csv', data)
    

    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(document.body.appendChild).toHaveBeenCalled()
  })
})

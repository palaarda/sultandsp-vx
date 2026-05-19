import type { FxCategory, FxDevice, IFxService } from '../types'
import { fxLibraryData } from '../data/fxLibrary'

function getAllDevices(library: FxCategory[]): FxDevice[] {
  return library.flatMap((cat) =>
    cat.subcategories.flatMap((sub) => sub.devices)
  )
}

class LocalFxService implements IFxService {
  private library: FxCategory[] = fxLibraryData

  async getLibrary(): Promise<FxCategory[]> {
    return this.library
  }

  async getDeviceById(id: string): Promise<FxDevice | undefined> {
    return getAllDevices(this.library).find((d) => d.id === id)
  }

  async searchDevices(query: string): Promise<FxDevice[]> {
    const q = query.toLowerCase()
    return getAllDevices(this.library).filter((d) =>
      d.name.toLowerCase().includes(q) ||
      d.brand.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q)) ||
      d.category.toLowerCase().includes(q) ||
      d.subcategory.toLowerCase().includes(q)
    )
  }
}
export const fxService: IFxService = new LocalFxService()

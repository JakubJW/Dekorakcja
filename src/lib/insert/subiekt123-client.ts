import { InsertHttpClient } from './insert-http-client'
import { CreateInvoiceDTO, InsertInvoiceResponse } from './types'

export class Subiekt123Client {
  constructor(private http: InsertHttpClient) {}

  async getInvoices() {
    return this.http.request<InsertInvoiceResponse[]>('/invoices')
  }

  async getInvoiceById(id: string) {
    return this.http.request<InsertInvoiceResponse>(`/invoices/${id}`)
  }

  async createInvoice(payload: CreateInvoiceDTO) {
    return this.http.request<InsertInvoiceResponse>('/invoices', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async getCustomers() {
    return this.http.request('/contractors')
  }
}

import { useState } from 'react'
import { Button } from '@/componentes/ui/button'
import { Input } from '@/componentes/ui/input'
import { Search, ShoppingCart, Trash2, Plus, Minus, DollarSign, LogOut } from 'lucide-react'

type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CashierPOS() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const products = [
    { id: '1', name: 'Tattoo Session - Small', price: 150 },
    { id: '2', name: 'Tattoo Session - Medium', price: 300 },
    { id: '3', name: 'Tattoo Session - Large', price: 500 },
    { id: '4', name: 'Piercing', price: 50 },
    { id: '5', name: 'Aftercare Kit', price: 25 },
    { id: '6', name: 'Touch-up Session', price: 100 },
  ]

  const addItem = (product: typeof products[0]) => {
    const existing = orderItems.find(item => item.id === product.id)
    if (existing) {
      setOrderItems(orderItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setOrderItems([...orderItems, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: string, delta: number) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id))
  }

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleCheckout = () => {
    console.log('Processing order:', orderItems)
    alert('Order processed successfully!')
    setOrderItems([])
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ff5a66] rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 
              className="text-[24px] font-light text-white/95 leading-none"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Obsidian Archive POS
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mt-1">
              Cashier: John Doe
            </p>
          </div>
        </div>
        <Button variant="ghost" className="text-white/40 hover:text-[#ff5a66] hover:bg-white/5">
          <LogOut className="w-4 h-4 mr-2" />
          <span className="text-[10px] uppercase tracking-[0.25em]">Logout</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto p-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/30" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/40 border-white/10 text-white pl-10 h-10 focus-visible:ring-0 focus-visible:border-[#ff5a66]"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {products
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(product => (
                  <button
                    key={product.id}
                    onClick={() => addItem(product)}
                    className="h-auto flex flex-col items-start p-4 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-[#ff5a66]/50 text-left transition-all rounded-sm"
                  >
                    <span className="font-medium text-white/90 text-sm mb-2">{product.name}</span>
                    <span className="text-[#ff5a66] font-bold text-lg">${product.price}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="w-5 h-5 text-[#ff5a66]" />
              <h2 
                className="text-[20px] font-light text-white/95"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Current Order
              </h2>
            </div>

            {orderItems.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No items in order</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-80 overflow-y-auto mb-6">
                  {orderItems.map(item => (
                    <div key={item.id} className="bg-black/40 border border-white/10 p-4 rounded-sm">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-white/90 text-sm font-medium pr-2">{item.name}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#ff5a66] hover:text-[#ff7078] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3 text-white" />
                          </button>
                          <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3 text-white" />
                          </button>
                        </div>
                        <span className="text-[#ff5a66] font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60 text-sm">
                    <span>Tax (10%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white text-xl font-bold pt-2">
                    <span>Total:</span>
                    <span className="text-[#ff5a66]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full h-14 bg-[#ff5a66] hover:bg-[#ff7078] text-black font-bold text-[11px] uppercase tracking-[0.3em] rounded-sm"
                >
                  Process Payment
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

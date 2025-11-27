import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Package, ShoppingBag, Settings } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { items } = useCartStore()

  // Mock orders data
  const orders = [
    { id: '1', date: '2024-01-15', status: 'Delivered', total: 59.98, items: 2 },
    { id: '2', date: '2024-01-10', status: 'Processing', total: 24.99, items: 1 },
    { id: '3', date: '2024-01-05', status: 'Shipped', total: 39.99, items: 1 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your orders, designs, and account settings
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cart Items</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">$124.96</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Designs</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Settings className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                    <p className="text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${order.total}</p>
                    <p className="text-sm text-muted-foreground">{order.items} item{order.items > 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col">
                <User className="h-6 w-6 mb-2" />
                <span>Profile</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Package className="h-6 w-6 mb-2" />
                <span>Orders</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <ShoppingBag className="h-6 w-6 mb-2" />
                <span>Designs</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Settings className="h-6 w-6 mb-2" />
                <span>Settings</span>
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Get Started</h3>
              <p className="text-sm text-blue-700 mb-3">
                Ready to create your first custom product?
              </p>
              <Button className="w-full">
                Start Designing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
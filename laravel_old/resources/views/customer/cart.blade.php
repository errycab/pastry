@extends('customer.layout')

@section('title', 'Cart')

@section('content')
<div class="card">
    <h1>Cart</h1>
    @if (empty($items))
        <p>Your cart is empty.</p>
        <a href="{{ url('products') }}" class="button">Continue Shopping</a>
    @else
        <table class="table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @foreach ($items as $item)
                <tr>
                    <td>{{ $item['product']['name'] ?? 'Product' }}</td>
                    <td>{{ $item['size_label'] ?? 'Regular' }}</td>
                    <td>{{ $item['quantity'] }}</td>
                    <td>₱{{ number_format($item['price'], 2) }}</td>
                    <td>₱{{ number_format($item['subtotal'], 2) }}</td>
                    <td>
                        <form method="post" action="{{ url('cart.php') }}">
                            @csrf
                            <input type="hidden" name="remove_item" value="{{ $item['key'] }}">
                            <button type="submit" class="button-secondary">Remove</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="card" style="margin-top:24px;">
            <p><strong>Cart total:</strong> ₱{{ number_format($total, 2) }}</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap">
                <form method="post" action="{{ url('cart.php') }}">
                    @csrf
                    <button type="submit" name="clear_cart" value="1" class="button-secondary">Clear Cart</button>
                </form>
                <a href="{{ url('checkout.php') }}" class="button">Checkout</a>
            </div>
        </div>
    @endif
</div>
@endsection

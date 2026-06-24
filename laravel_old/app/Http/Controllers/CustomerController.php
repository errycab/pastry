<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        require_once base_path('../includes/data.php');
        require_once base_path('../includes/db.php');
    }

    protected function requireLogin()
    {
        if (!isset($_SESSION['user'])) {
            return redirect('/login.php');
        }

        return null;
    }

    public function dashboard(Request $request)
    {
        if ($redirect = $this->requireLogin()) {
            return $redirect;
        }

        $user = $_SESSION['user'];
        $products = getDB()['products'] ?? [];
        $cartCount = get_cart_count();

        return view('customer.dashboard', compact('user', 'products', 'cartCount'));
    }

    public function cart(Request $request)
    {
        if ($redirect = $this->requireLogin()) {
            return $redirect;
        }

        if ($request->isMethod('post')) {
            if ($request->has('add_to_cart')) {
                add_to_cart(
                    (int)$request->input('product_id', 0),
                    $request->input('size', 'slice'),
                    (int)$request->input('quantity', 1)
                );

                return redirect()->back();
            }

            if ($request->has('update_qty')) {
                $keys = explode(',', $request->input('cart_keys', ''));
                foreach ($keys as $key) {
                    $qty = (int)$request->input('qty_' . trim($key), 1);
                    update_cart_item(trim($key), max(1, $qty));
                }

                return redirect()->back();
            }

            if ($request->has('remove_item')) {
                $removeKeys = explode(',', $request->input('remove_item'));
                foreach ($removeKeys as $key) {
                    remove_from_cart(trim($key));
                }

                return redirect()->back();
            }

            if ($request->has('clear_cart')) {
                clear_cart();
                return redirect()->back();
            }
        }

        $items = get_cart_items();
        $cartCount = get_cart_count();
        $total = get_cart_total();

        return view('customer.cart', compact('items', 'cartCount', 'total'));
    }

    public function checkout(Request $request)
    {
        if ($redirect = $this->requireLogin()) {
            return $redirect;
        }

        $items = get_cart_items();
        if (empty($items)) {
            return redirect('/cart.php');
        }

        $user = $_SESSION['user'];
        $cartTotal = get_cart_total();
        $deliveryFee = 50;
        $grandTotal = $cartTotal + $deliveryFee;

        return view('customer.checkout', compact('items', 'user', 'cartTotal', 'deliveryFee', 'grandTotal'));
    }

    public function placeOrder(Request $request)
    {
        if ($redirect = $this->requireLogin()) {
            return $redirect;
        }

        $items = get_cart_items();
        if (empty($items)) {
            return redirect('/cart.php');
        }

        $user = $_SESSION['user'];
        $orderItems = [];

        foreach ($items as $item) {
            $orderItems[] = [
                'product' => $item['product']['id'] ?? 0,
                'qty' => $item['quantity'],
                'price' => $item['price'],
            ];
        }

        $data = [
            'customer' => $user['name'] ?? 'Guest',
            'email' => $user['email'] ?? '',
            'type' => $request->input('order_type', 'Delivery'),
            'payment' => $request->input('payment', 'COD'),
            'address' => $request->input('address', ''),
            'items' => $orderItems,
        ];

        db_place_order($data);
        clear_cart();

        return redirect('/orders.php')->with('message', 'Your order has been placed successfully.');
    }

    public function orders(Request $request)
    {
        if ($redirect = $this->requireLogin()) {
            return $redirect;
        }

        $filter = $request->query('filter', 'all');
        $userEmail = $_SESSION['user']['email'] ?? '';

        $orders = array_filter(
            getDB()['orders'] ?? [],
            fn($order) => ($order['email'] ?? '') === $userEmail
        );

        if ($filter !== 'all') {
            $orders = array_filter(
                $orders,
                fn($order) => strtolower($order['status'] ?? '') === strtolower($filter)
            );
        }

        $orders = array_reverse($orders);
        $cartCount = get_cart_count();

        return view('customer.orders', compact('orders', 'filter', 'cartCount'));
    }

    public function notifications(Request $request)
    {
        if ($redirect = $this->requireLogin()) {
            return $redirect;
        }

        $userId = $_SESSION['user']['id'] ?? null;
        $notifications = [];
        if ($userId) {
            $notifications = db_get_notifications($userId);
        }

        $cartCount = get_cart_count();
        return view('customer.notifications', compact('notifications', 'cartCount'));
    }

    public function logout()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        session_destroy();
        return redirect('/login.php');
    }

    public function findConfig()
    {
        $dir = realpath(base_path('../')) ?: base_path('../');
        $files = [];

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir)
        );

        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getFilename() === 'config.php') {
                $files[] = str_replace('\\', '/', $file->getPathname());
            }
        }

        return view('customer.find_config', compact('files'));
    }
}

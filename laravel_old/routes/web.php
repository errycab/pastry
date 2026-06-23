<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerApiController;

Route::get('/products', [ProductController::class, 'index'])->name('products.index');

// Legacy customer pages converted into Laravel controllers
Route::get('/dashboard.php', [CustomerController::class, 'dashboard']);
Route::match(['get', 'post'], '/cart.php', [CustomerController::class, 'cart']);
Route::get('/checkout.php', [CustomerController::class, 'checkout']);
Route::post('/place_order.php', [CustomerController::class, 'placeOrder']);
Route::get('/orders.php', [CustomerController::class, 'orders']);
Route::get('/notifications.php', [CustomerController::class, 'notifications']);
Route::get('/logout.php', [CustomerController::class, 'logout']);
Route::get('/find_config.php', [CustomerController::class, 'findConfig']);

Route::any('/api_products.php', [CustomerApiController::class, 'products']);
Route::any('/api_login.php', [CustomerApiController::class, 'login']);
Route::any('/api_forgot_password.php', [CustomerApiController::class, 'forgotPassword']);
Route::any('/api_verify_reset_password.php', [CustomerApiController::class, 'verifyResetCode']);
Route::any('/api_reset_password.php', [CustomerApiController::class, 'resetPassword']);
Route::any('/api_orders.php', [CustomerApiController::class, 'createOrder']);
Route::get('/api_get_orders.php', [CustomerApiController::class, 'getOrders']);
Route::post('/api_cancel_order.php', [CustomerApiController::class, 'cancelOrder']);
Route::post('/api_confirm_received.php', [CustomerApiController::class, 'confirmReceived']);
Route::any('/api_users.php', [CustomerApiController::class, 'users']);
Route::get('/api_chat_fetch.php', [CustomerApiController::class, 'chatFetch']);
Route::post('/api_chat_send.php', [CustomerApiController::class, 'chatSend']);
Route::any('/create_payment.php', [CustomerApiController::class, 'createPayment']);
Route::any('/cart_api.php', [CustomerApiController::class, 'cartApi']);
Route::get('/api_user.php', [CustomerApiController::class, 'user']);

// Redirect admin users to the legacy admin products page for the same behavior
Route::get('/admin-products', function () {
    return redirect('/admin_products');
})->name('admin.products');

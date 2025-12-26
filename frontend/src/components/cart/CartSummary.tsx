import { formatCurrency } from '@/lib/utils';

interface CartSummaryProps {
    subtotal: number;
    total?: number;
    shippingFee?: number;
    discount?: number;
    onCheckout?: () => void;
}

export default function CartSummary({
    subtotal,
    total,
    shippingFee = 0,
    discount = 0,
    onCheckout,
}: CartSummaryProps) {
    const finalTotal = total || (subtotal + shippingFee - discount);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>

                {shippingFee > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        <span className="font-semibold">{formatCurrency(shippingFee)}</span>
                    </div>
                )}

                {discount > 0 && (
                    <div className="flex justify-between text-red-600">
                        <span>Giảm giá:</span>
                        <span className="font-semibold">-{formatCurrency(discount)}</span>
                    </div>
                )}
            </div>

            <div className="border-t pt-4 mb-4">
                <div className="flex justify-between">
                    <span className="text-lg font-bold">Tổng cộng:</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(finalTotal)}</span>
                </div>
            </div>

            {onCheckout && (
                <button
                    onClick={onCheckout}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                    Tiến hành thanh toán
                </button>
            )}
        </div>
    );
}

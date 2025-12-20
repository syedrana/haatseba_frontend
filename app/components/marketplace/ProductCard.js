"use client";
import Image from "next/image";

export default function ProductCard({ product,
  selected,
  onSelect,
  onBuyNow, }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>

      <h3 className="mt-3 font-semibold text-gray-800 line-clamp-2">
        {product.name}
      </h3>

      <p className="text-sm text-gray-500">
        {product.brand?.name}
      </p>

      <div className="flex items-center justify-between mt-3">
        <div>
          <span className="text-lg font-bold text-green-600">
            ৳{product.price}
          </span>
          {product.discount > 0 && (
            <span className="ml-2 text-sm text-red-500">
              -{product.discount}%
            </span>
          )}
        </div>

        <button 
            onClick={(e) => {
            e.stopPropagation(); // ⭐ খুব জরুরি
            onBuyNow();
          }}
          className="bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

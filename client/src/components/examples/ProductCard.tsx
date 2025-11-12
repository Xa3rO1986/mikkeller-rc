import ProductCard from '../ProductCard'
import productImage from '@assets/generated_images/Black_running_t-shirt_product_3eadb9cf.png'

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        slug="black-running-tee"
        title="Беговая футболка MRC"
        price={2500}
        image={productImage}
        category="Футболки"
        sizes={["S", "M", "L", "XL"]}
        colors={["Черный", "Желтый"]}
        inStock={true}
      />
    </div>
  )
}

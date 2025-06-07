import { IProduct } from "../interfaces";
import { txtSlicer } from "../utils/functions";
import CircleColor from "./CircleColor";
import Image from "./Image";
import Button from "./ui/Button";

interface IProps {
  product: IProduct;
  onEdit: (product: IProduct) => void;
  onDelete: (productId: string) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: IProps) => {
  const { title, description, imageURL, price, colors, category } = product;

  const renderProductColors = colors.map((color) => (
    <CircleColor key={color} color={color} />
  ));

  return (
    <div className="product-card bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm md:max-w-lg mx-auto p-4 flex flex-col h-full">
      {/* Product Image */}
      <Image
        imageURL={imageURL}
        alt={title}
        className="w-full h-full object-cover rounded-md mb-4 border border-gray-200 shadow-sm"
      />

      {/* Product Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-2">{txtSlicer(description, 70)}</p>

      {/* Colors */}
      <div className="flex items-center flex-wrap gap-1 mb-2">
        {renderProductColors}
      </div>

      {/* Price & Category */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <span className="text-lg font-bold text-indigo-600">${price}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{category.name}</span>
          <Image
            imageURL={category.imageURL}
            alt={category.name}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
        <Button
          className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded hover:bg-indigo-700 transition"
          onClick={() => onEdit(product)}
        >
            Edit
        </Button>
        <Button
          className="flex-1 bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 transition"
          onClick={() => onDelete(product.id || "")}
        >
            Delete
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
import defaultImage from "../../assets/images/default_product.jpg"
import { Link } from "react-router";

const ProductItem = ({product = {}}) => {
    // Early return if product is not valid
    if (!product || !product.id) {
        return null;
    }

    return (
        <Link to={`/shop/${product.id}`}>
            <div className="card bg-base-100 w-96 shadow-sm">
            <figure className="px-10 pt-10">
                <img
                src={product.images?.length > 0 ? product.images[0]?.image : defaultImage}
                alt={product.name || "Product image"}
                className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{product.name || "Product Name"}</h2>
                <h3 className="font-bold text-xl text-red-700 mt-1">৳ {product.price || "0.00"}</h3>
                <p>{product.description || "No description available"}</p>
                <div className="card-actions">
                <button className="btn bg-yellow-700 text-gray-50">Book Now</button>
                </div>
            </div>
            </div>
        </Link>
    );
};

export default ProductItem;
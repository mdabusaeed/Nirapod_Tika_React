import defaultImage from "../../assets/images/default_product.jpg"
import { Link, useNavigate } from "react-router-dom";

const ProductItem = ({product = {}, compact = false}) => {
    const navigate = useNavigate();
    
    // Early return if product is not valid
    if (!product || !product.id) {
        return null;
    }
    
    const handleBookNow = (e) => {
        // Prevent the parent Link from triggering
        e.preventDefault();
        e.stopPropagation();
        
        // Navigate to the schedules page with product info as state data
        navigate('/schedules', { 
            state: { 
                selectedProduct: product,
                fromBookNow: true
            } 
        });
    };

    return (
        <Link to={`/shop/${product.id}`}>
            <div className="card bg-base-100 shadow-sm mx-auto border border-gray-100 hover:shadow-md transition-shadow duration-300" style={{ maxWidth: '100%', width: compact ? '205px' : '280px' }}>
                <figure className="px-4 pt-4">
                    <img
                    src={product.images?.length > 0 ? product.images[0]?.image : defaultImage}
                    alt={product.name || "Product image"}
                    className="rounded-xl object-cover h-40 w-full" />
                </figure>
                <div className="card-body items-center text-center p-4">
                    <h2 className="card-title text-base">{product.name || "Product Name"}</h2>
                    <h3 className="font-bold text-lg text-green-600 mt-1">৳ {product.price || "0.00"}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description || "No description available"}</p>
                    <div className="card-actions mt-2">
                    <button 
                        onClick={handleBookNow}
                        className="btn btn-sm bg-amber-600 hover:bg-amber-700 text-white border-none">Book Now</button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductItem;
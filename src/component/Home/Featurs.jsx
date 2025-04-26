import { FaShippingFast, FaShieldAlt, FaHeadset, FaTags } from 'react-icons/fa';

const Featurs = () => {
const features = [
        {
            icon: <FaShippingFast className="text-3xl text-blue-600" />,
            title: "Fast Delivery",
            description: "Get your orders delivered within 24 hours"
          },
          {
            icon: <FaShieldAlt className="text-3xl text-green-600" />,
            title: "Quality Guarantee",
            description: "100% authentic products"
          },
          {
            icon: <FaHeadset className="text-3xl text-purple-600" />,
            title: "24/7 Support",
            description: "Our expert team is always ready"
          },
          {
            icon: <FaTags className="text-3xl text-red-600" />,
            title: "Special Offers",
            description: "Regular discounts and deals"
          }
        ];
      
        return (
          <section className="py-12 bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Our Key Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
                  >
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
    );
};

export default Featurs;
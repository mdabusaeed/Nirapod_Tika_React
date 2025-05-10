import { useEffect, useState } from 'react';
import apiClient from '../services/api-client';

const useFetchVaccines = (
    currentPage, 
    priceRange, 
    searchQuery, 
    sortOrder
) => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVaccines = async () => {
      setLoading(true);
      setError(null);

      // Construct URL with query parameters
      let url = `/vaccines/?page=${currentPage}`;
      url += `&price__gte=${priceRange[0]}&price__lte=${priceRange[1]}`;
      url += `&search=${encodeURIComponent(searchQuery)}`;
      url += `&ordering=${encodeURIComponent(sortOrder)}`;

      try {
        const response = await apiClient.get(url);
        const data = response.data;

        // Handle paginated or non-paginated response
        if (data.results && data.count) {
          setVaccines(data.results);
          setTotalPages(data.results.length > 0 ? Math.ceil(data.count / data.results.length) : 0);
        } else {
          setVaccines(data);
          setTotalPages(data.length > 0 ? 1 : 0);
        }
      } catch (error) {
        setError('Failed to fetch vaccines. Please try again later.');
        console.error('Error fetching vaccines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccines();
  }, [currentPage, priceRange, searchQuery, sortOrder]);

  return { vaccines, loading, totalPages, error };
};

export default useFetchVaccines;
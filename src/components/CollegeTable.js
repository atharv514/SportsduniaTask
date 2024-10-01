import React, { useState, useEffect } from 'react';
import collegesData from '../data/colleges.json'; 

const CollegeTable = ({ searchTerm }) => {
  const [visibleColleges, setVisibleColleges] = useState(collegesData.slice(0, 10)); // Start with 10 rows
  const [hasMore, setHasMore] = useState(true); // Tracks if more colleges are available
  const [currentIndex, setCurrentIndex] = useState(10); // Tracks how many colleges are currently loaded
  const [allColleges, setAllColleges] = useState(collegesData); // Store all colleges for filtering
  const [sortConfig, setSortConfig] = useState({ key: 'ranking', direction: 'ascending' }); // Sorting configuration

  // Function to sort colleges based on the selected criteria
  const sortColleges = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedColleges = [...allColleges].sort((a, b) => {
      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return direction === 'ascending' ? a[key] - b[key] : b[key] - a[key];
      } else {
        return direction === 'ascending' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      }
    });

    setSortConfig({ key, direction });
    setVisibleColleges(sortedColleges.slice(0, 10));
    setCurrentIndex(10);
    setHasMore(sortedColleges.length > 10);
  };

  useEffect(() => {
    const filteredColleges = allColleges.filter(college =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedColleges = [...filteredColleges].sort((a, b) => {
      if (sortConfig.direction === 'ascending') {
        return typeof a[sortConfig.key] === 'number' 
          ? a[sortConfig.key] - b[sortConfig.key] 
          : a[sortConfig.key].localeCompare(b[sortConfig.key]);
      } else {
        return typeof a[sortConfig.key] === 'number' 
          ? b[sortConfig.key] - a[sortConfig.key] 
          : b[sortConfig.key].localeCompare(a[sortConfig.key]);
      }
    });

    setVisibleColleges(sortedColleges.slice(0, 10));
    setCurrentIndex(10);
    setHasMore(sortedColleges.length > 10);
  }, [searchTerm, sortConfig]);

  // Function to load more colleges when user scrolls to the bottom
  const loadMoreColleges = () => {
    const filteredColleges = allColleges.filter(college =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedColleges = [...filteredColleges].sort((a, b) => {
      if (sortConfig.direction === 'ascending') {
        return typeof a[sortConfig.key] === 'number' 
          ? a[sortConfig.key] - b[sortConfig.key] 
          : a[sortConfig.key].localeCompare(b[sortConfig.key]);
      } else {
        return typeof a[sortConfig.key] === 'number' 
          ? b[sortConfig.key] - a[sortConfig.key] 
          : b[sortConfig.key].localeCompare(a[sortConfig.key]);
      }
    });

    if (currentIndex < sortedColleges.length) {
      const newColleges = sortedColleges.slice(currentIndex, currentIndex + 10);
      setVisibleColleges(prevColleges => [...prevColleges, ...newColleges]);
      setCurrentIndex(prevIndex => prevIndex + 10);
    } else {
      setHasMore(false); // No more colleges to load
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 1 // Added a slight threshold
      ) {
        loadMoreColleges(); // Load more colleges
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Clean up the event listener
  }, [currentIndex, allColleges, searchTerm, sortConfig]); // Re-run the effect when these dependencies change

  return (
    <div>
      <table>
        <thead className="table-header">
          <tr>
            <th className="center" onClick={() => sortColleges('ranking')}>
              Rank {sortConfig.key === 'ranking' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => sortColleges('name')}>
              College {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => sortColleges('fees')}>
              Course Fees {sortConfig.key === 'fees' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => sortColleges('placement')}>
              Placement {sortConfig.key === 'placement' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => sortColleges('userReviewRating')}>
              User Reviews {sortConfig.key === 'userReviewRating' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
            <th onClick={() => sortColleges('rating')}>
              Ranking {sortConfig.key === 'rating' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {visibleColleges.map(college => (
            <tr key={college.id} className={college.featured ? 'featured' : 'non-featured'}>
              <td className="center">#{college.id}</td>
              <td>
                <strong>{college.name}</strong><br />
                {college.description}<br />
                {college.location}<br />
                {college.featured && <span className="featured-badge">🌟 Featured</span>}
                
                <div className="actions">
                  <span className="apply-now-btn">✅ Apply Now</span>
                  <span className="download-brochure-btn">📥 Download Brochure</span>
                  
                  <span className="compare-checkbox">
                    <input type="checkbox" style={{ marginRight: '5px' }} /> Add to Compare
                  </span>
                </div>
              </td>
              <td>₹{college.fees.toLocaleString()}</td>
              <td>₹{college.placement.toLocaleString()}</td>
              <td>{college.userReviewRating}/10</td>
              <td>#{college.ranking} in India</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!hasMore && <p style={{ textAlign: 'center' }}>No more colleges to load</p>}
    </div>
  );
};

export default CollegeTable;

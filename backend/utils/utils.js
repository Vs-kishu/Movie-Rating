const calculateAverageRating=(reviews)=> {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
    return (totalRating / reviews.length).toFixed(1); // returns average rating rounded to one decimal
  }

  module.exports = {calculateAverageRating};
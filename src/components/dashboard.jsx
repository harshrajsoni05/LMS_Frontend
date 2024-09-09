import { useState, useEffect } from "react";
import { fetchDashboardCounts, fetchRecentBooks } from "../api/DashboardServices";
import "../styles/dashboard.css"; 

import books from "../assets/images/books.png";
import categories from "../assets/images/categories.png";
import democracy from "../assets/images/democracy.png";
import userss from "../assets/images/userss.png";

import withLayout from "../hocs/WithLayoutComponent";

const LatestBooks = ({ books }) => {
  return (
    <div className="latest-books-container">
      {books.map((book) => (
        <div key={book.id} className="book-card">
          <img src={book.imageURL} alt={book.title} className="book-image" />
          <h2 className="book-title">{book.title}</h2>
          <p className="book-author">{book.author}</p>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState({
    booksCount: 0,
    categoriesCount: 0,
    issuancesCount: 0,
    usersCount: 0,
  });

  const [latestBooks, setLatestBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, recentBooks] = await Promise.all([
          fetchDashboardCounts(),
          fetchRecentBooks()
        ]);

        setData({
          booksCount: dashboardData.booksCount,
          categoriesCount: dashboardData.categoriesCount,
          issuancesCount: dashboardData.issuancesCount,
          usersCount: (dashboardData.usersCount - 1),
        });

        setLatestBooks(recentBooks);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-dashboard">
      <div className="dashboard">
        <div className="dashboard-card">
          <img src={books} alt="Books" />
          <h2>Total Books</h2>
          <p>{data.booksCount}</p>
        </div>
        <div className="dashboard-card">
          <img src={userss} alt="Users" />
          <h2>Total Users</h2>
          <p>{data.usersCount}</p>
        </div>
        <div className="dashboard-card">
          <img src={categories} alt="Categories" />
          <h2>Categories</h2>
          <p>{data.categoriesCount}</p>
        </div>
        <div className="dashboard-card">
          <img src={democracy} alt="Issued Books" />
          <h2>Issued Books</h2>
          <p>{data.issuancesCount}</p>
        </div>
      </div>
      <div className="recent-books-heading">
        <p>Recently Added Collection</p>
      </div>
      <LatestBooks books={latestBooks} />
    </div>
  );
};

export const DashboardwithLayout = withLayout(Dashboard);

import { useState, useEffect } from "react";
import {
  fetchDashboardCounts,
  fetchRecentBooks,
} from "../api/DashboardServices";
import "../styles/dashboard.css";

import Loader from "./Loader";
import HOC from "../hocs/WithLayoutComponent";

import books from "../assets/images/books.png";
import categories from "../assets/images/categories.png";
import democracy from "../assets/images/democracy.png";
import userss from "../assets/images/userss.png";
import { Link } from "react-router-dom";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const dashboardData = await fetchDashboardCounts();
        setData({
          booksCount: dashboardData.booksCount,
          categoriesCount: dashboardData.categoriesCount,
          issuancesCount: dashboardData.issuancesCount,
          usersCount: dashboardData.usersCount - 1,
        });

        const recentBooks = await fetchRecentBooks();
        setLatestBooks(recentBooks);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container-dashboard">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="dashboard">
            <Link to="/category" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <img src={categories} alt="Categories" />
                <h2>Categories</h2>
                <p>{data.categoriesCount}</p>
              </div>
            </Link>
            <Link to="/books" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <img src={books} alt="Books" />
                <h2>Total Books</h2>
                <p>{data.booksCount}</p>
              </div>
            </Link>

            <Link to="/user" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <img src={userss} alt="Users" />
                <h2>Total Users</h2>
                <p>{data.usersCount}</p>
              </div>
            </Link>

            <Link to="/issuance" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <img src={democracy} alt="Issued Books" />
                <h2>Issued Books</h2>
                <p>{data.issuancesCount}</p>
              </div>
            </Link>
          </div>

          <div className="recent-books-heading">
            <p>Recently Added Collection</p>
          </div>

          <LatestBooks books={latestBooks} />
        </>
      )}
    </div>
  );
};

export const DashboardwithLayout = HOC(Dashboard);

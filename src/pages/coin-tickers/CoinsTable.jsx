// src/App.jsx
import { useState, useEffect } from "react";
import styles from "./CoinsTable.module.css";

const CoinsTable = () => {
  // The data we're fetching from the API
  const [data, setData] = useState([]);

  // The page number we're currently on
  const [currentPage, setCurrentPage] = useState(1);

  // The data for the next and previous pages
  const [nextPageData, setNextPageData] = useState(null);
  const [prevPageData, setPrevPageData] = useState(null);

  // The index of the first item on the current page
  const [index, setIndex] = useState(0);

  // The number of items per page
  // const itemsPerPage = 10;

  // Fetch the data for the current page
  const fetchData = async () => {
    // Make the API request
    const response = await fetch(
      `https://api.coinlore.net/api/tickers/?start=${index}&limit=10`
    );

    // Get the JSON data from the response
    const result = await response.json();

    // Set the data to the response data
    setData(result.data);
  };

  // Prefetch the data for the next page
  const prefetchNextPage = async () => {
    // Make the API request
    const response = await fetch(
      `https://api.coinlore.net/api/tickers/?start=${index + 10}&limit=10`
    );

    // Get the JSON data from the response
    const result = await response.json();

    // Set the next page data to the response data
    setNextPageData(result.data);
  };

  // Prefetch the data for the previous page
  const prefetchPrevPage = async () => {
    // Make the API request
    const response = await fetch(
      `https://api.coinlore.net/api/tickers/?start=${index - 10}&limit=10`
    );

    // Get the JSON data from the response
    const result = await response.json();

    // Set the previous page data to the response data
    setPrevPageData(result.data);
  };

  // When the component mounts, fetch the data and prefetch the next and previous pages
  useEffect(() => {
    fetchData(currentPage);
    prefetchNextPage(currentPage + 1);
    prefetchPrevPage(currentPage - 1);
  }, [currentPage]);

  // Go to the next page
  const goToNextPage = () => {
    // If there's data for the next page, use it
    if (nextPageData) {
      setData(nextPageData);
      setNextPageData(null);
    } else {
      // Otherwise, fetch the data for the next page
      fetchData(currentPage + 1);
    }

    // Increment the current page
    setCurrentPage(currentPage + 1);

    // Increment the index
    setIndex(index + 10);
  };

  // Go to the previous page
  const goToPrevPage = () => {
    // If there's data for the previous page, use it
    if (prevPageData) {
      setData(prevPageData);
      setPrevPageData(null);
    } else {
      // Otherwise, fetch the data for the previous page
      fetchData(currentPage - 1);
    }

    // Decrement the current page
    setCurrentPage(currentPage - 1);

    // Decrement the index
    setIndex(index - 10);
  };

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.h1}>Coin Data</h1> */}

      {/* Table for larger screens */}
      <div className={styles.wrapper}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className="">💰 Coin Name</th>
                <th className=" ">📄 Code</th>
                <th className=" ">🤑 Price (USD)</th>
                <th className=" ">📉 Total Supply</th>
              </tr>
            </thead>
            <tbody>
              {data.map((coin) => (
                <tr key={coin.id}>
                  <td className={styles.td}>{coin.name}</td>
                  <td className={styles.td}>{coin.symbol}</td>
                  <td className={styles.td}>
                    ${coin.price_usd.toLocaleString()}
                  </td>
                  <td className={styles.td}>
                    {coin.tsupply} {coin.symbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card-like layout for mobile screens */}
        <div className={styles.mobileContainer}>
          {data.map((coin) => (
            <div key={coin.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <span>💰 Coin Name</span>
                  <span>{coin.name}</span>
                </div>

                <div>
                  <span>🤑 Price </span>
                  <span>${coin.price_usd.toLocaleString()}</span>
                </div>
              </div>
              <div className={styles.cardBottom}>
                <div>
                  <span>📄 Code</span>
                  <span className="">{coin.symbol}</span>
                </div>

                <div>
                  <span>📉 Total Supply</span>
                  <span className="">
                    {coin.tsupply} {coin.symbol}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          {currentPage === 1 ? (
            <div />
          ) : (
            <div className={styles.navBtn}>
              <button onClick={goToPrevPage} disabled={currentPage === 1}>
                <span className="arrow previous-arrow">&#129136;</span>
                Previous
              </button>
            </div>
          )}
          <div className={styles.navBtn}>
            <button onClick={goToNextPage}>
              Next <span className="arrow">&#129138;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinsTable;

import { useEffect, useState } from "react";

const TokenViewer = () => {
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
    <div>
      <h1>Cryptocurrency Data</h1>

      <table>
        <colgroup>
          <col />
          <col />
          <col />
        </colgroup>

        <tbody>
          <tr>
            <th>Coins</th>
            <th>Code</th>
            <th>Price</th>
            <th>Total Supply</th>
          </tr>
          {data.map((coin) => (
            <tr key={coin.id}>
              <td>{coin.name}</td>
              <td>{coin.symbol}</td>
              <td>${coin.price_usd}</td>
              <td>
                {coin.tsupply} {coin.symbol}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={goToNextPage}>Next</button>
      </div>
    </div>
  );
};


export default TokenViewer;

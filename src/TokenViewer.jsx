import { useEffect, useState } from "react";

const TokenViewer = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageData, setNextPageData] = useState(null);
  const [prevPageData, setPrevPageData] = useState(null);
  const [index, setIndex] = useState(0);
  // const itemsPerPage = 10;

  const fetchData = async () => {
    const response = await fetch(
      `https://api.coinlore.net/api/tickers/?start=${index}&limit=10`
    );
    const result = await response.json();
    setData(result.data);
  };

  const prefetchNextPage = async () => {
    const response = await fetch(
      `https://api.coinlore.net/api/tickers/?start=${index + 10}&limit=10`
    );
    const result = await response.json();
    setNextPageData(result.data);
  };

  const prefetchPrevPage = async () => {
    const response = await fetch(
      `https://api.coinlore.net/api/tickers/?start=${index - 10}&limit=10`
    );
    const result = await response.json();
    setPrevPageData(result.data);
  };

  useEffect(() => {
    fetchData(currentPage);
    prefetchNextPage(currentPage + 1);
    prefetchPrevPage(currentPage - 1);
  }, [currentPage]);

  const goToNextPage = () => {
    if (nextPageData) {
      setData(nextPageData);
      setNextPageData(null);
    } else {
      fetchData(currentPage + 1);
    }
    setCurrentPage(currentPage + 1);
    setIndex(index + 10);
  };

  const goToPrevPage = () => {
    if (prevPageData) {
      setData(prevPageData);
      setPrevPageData(null);
    } else {
      fetchData(currentPage - 1);
    }
    setCurrentPage(currentPage - 1);
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
      <button onClick={goToPrevPage} disabled={currentPage === 1}>
        Previous
      </button>
      <button onClick={goToNextPage}>Next</button>
    </div>
  );
};

export default TokenViewer;

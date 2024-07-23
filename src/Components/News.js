import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";

const News = ({
  country = "us",
  pageSize = 6,
  category = "general",
  apiKey,
  setProgress
}) => {
  // State variables to manage articles, loading status, page number, and total results
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // useEffect to update the document title and fetch news when the component mounts
  useEffect(() => {
    document.title = `${capitalizeFirstLetter(category)} - NewsApp`;
    updateNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch and update news articles
  const updateNews = async () => {
    setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    setProgress(30);
    let parsedData = await data.json();
    setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    setProgress(100);
  };

  // Function to fetch more data for infinite scroll
  const fetchMoreData = useCallback(async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page + 1}&pageSize=${pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    setPage((prevPage) => prevPage + 1);
  }, [page, country, category, pageSize, apiKey]);

  return (
    <div className="container my-3">
      <h2 className="text-center" style={{ margin: "70px 0px" }}>
        Today's News - Top {capitalizeFirstLetter(category)} Headlines
      </h2>
      {/* Show loading text while fetching data */}
      {loading && <h4 className="text-center">Loading...</h4>}
      <InfiniteScroll
        dataLength={articles.length} // Length of the articles array
        next={fetchMoreData} // Function to call when more data is needed
        hasMore={articles.length !== totalResults} // Check if there are more articles to load
        loader={<h4 className="text-center">Loading...</h4>} // Loader to show while fetching more data
      >
        <div className="container" style={{ overflowX: "hidden" }}>
          <div className="row">
            {articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={element.description ? element.description.slice(0, 88) : ""}
                  imageUrl={element.urlToImage}
                  newsURL={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

// PropTypes for type-checking the props
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  setProgress: PropTypes.func.isRequired,
};

export default News;

"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";
import Paginator from "./Paginator";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [searchedResultsCount, setSearchedResultsCount] = useState(0);
  const [paginationOffset, setPaginationOffset] = useState(0);
  const paginationLimit = 10;
  const fetchPosts = async (searchtext = "", offset = 0) => {
    const url = "/api/prompt";
    const params = new URLSearchParams({
      q: searchtext.toLowerCase() || "", //query
      o: offset, //offset
      l: paginationLimit, //limit
    });
    const response = await fetch(url + "?" + params.toString());
    if (response.ok) {
      const { prompts, total } = await response.json();
      setSearchedResults(prompts);
      setSearchedResultsCount(total);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        fetchPosts(e.target.value);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    fetchPosts(tagName);
  };

  const changeOffset = (offset) => {
    setPaginationOffset(offset);
    fetchPosts(searchText, offset);
  };

  return (
    <section className="feed mb-16">
      <form
        className="relative w-full flex-center"
        onSubmit={(e) => {
          e.preventDefault();
        }}>
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={searchedResults} handleTagClick={handleTagClick} />

      {searchedResults.length > 1 && (
        <Paginator
          offset={paginationOffset}
          limit={paginationLimit}
          total={searchedResultsCount}
          changeOffset={changeOffset}
        />
      )}
    </section>
  );
};

export default Feed;

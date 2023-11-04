"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

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
    // Search states
    const [searchText, setSearchText] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchedResults, setSearchedResults] = useState([]);

    const fetchPosts = async (searchtext = "") => {
        const url = "/api/prompt";
        const params = new URLSearchParams({
            q: searchtext.toLowerCase() || "", //query
            o: 0, //offset
            l: 10, //limit
        });
        const response = await fetch(url + "?" + params.toString());
        const data = await response.json();
        setSearchedResults(data);
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

    return (
        <section className="feed">
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

            <PromptCardList
                data={searchedResults}
                handleTagClick={handleTagClick}
            />
        </section>
    );
};

export default Feed;

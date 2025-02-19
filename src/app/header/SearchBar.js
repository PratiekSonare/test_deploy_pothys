import React from 'react';

const SearchBar = () => {
  return (
    <div className="flex rounded-full bg-[#d9d9d9] px-2 w-full md:max-w-full lg:h-[50px] sm:max-w-[300px] sm:h-[40px]">
      <button className="self-center flex p-1 cursor-pointer bg-[#d9d9d9]" />
      <input
        type="text"
        className="w-full bg-[#d9d9d9] flex bg-transparent pl-2 text-[#000] outline-0"
        placeholder="Search 'ParleG'"
      />
      <button type="submit" className="relative p-2 bg-[#d9d9d9] rounded-full">
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0" />
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
          <g id="SVGRepo_iconCarrier">
            <path
              d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="#999"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;

import { Search } from "lucide-react";

const SearchBox = ({ search, setSearch, page, setPage }) => {
  return (
    <div className="w-full p-2 px-3 bg-white rounded-lg border border-gray-300 shadow-sm flex items-center gap-2 focus-within:border-blue-500">
      <Search size={18} />

      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);

          if (page > 1) {
            setPage(1);
          }
        }}
        type="text"
        placeholder="พิมพ์ค้นหา"
        className="text-[0.9rem] w-full outline-none"
      />
    </div>
  );
};
export default SearchBox;

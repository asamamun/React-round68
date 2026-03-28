const Search = ({search, handleSearch}) => {

    return (
        <div>
            <input type="text" placeholder="Search..." value={search} onChange={(e) => handleSearch(e)} />
        </div>
    )
}
export default Search;
